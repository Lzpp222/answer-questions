/** Vercel: /api/github-delete - 删除设备记录（允许重答） */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const dataPath = process.env.GITHUB_DATA_PATH || 'data/quiz_results.json';

  if (!token || !repo) return res.status(500).json({ ok: false, msg: '未配置' });
  const [owner, repoName] = repo.split('/').filter(Boolean);
  if (!owner || !repoName) return res.status(500).json({ ok: false });

  const deviceId = (req.body && req.body.deviceId) || '';
  if (!deviceId) return res.status(400).json({ ok: false, msg: '缺少 deviceId' });

  const api = 'https://api.github.com';
  try {
    const getRes = await fetch(`${api}/repos/${owner}/${repoName}/contents/${dataPath}?ref=${branch}`, {
      headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json' }
    });
    if (!getRes.ok) return res.status(getRes.status).json({ ok: false, msg: '无法读取数据' });
    const j = await getRes.json();
    const sha = j.sha;
    let data = [];
    if (j.content) {
      const decoded = Buffer.from(j.content.replace(/\n/g, ''), 'base64').toString('utf-8');
      data = JSON.parse(decoded || '[]');
    }
    const filtered = data.filter(r => r.deviceId !== deviceId);
    if (filtered.length === data.length) return res.status(200).json({ ok: true });

    const content = Buffer.from(JSON.stringify(filtered, null, 2), 'utf-8').toString('base64');
    const putRes = await fetch(`${api}/repos/${owner}/${repoName}/contents/${dataPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'quiz: 删除设备 ' + deviceId,
        content,
        sha,
        branch,
        committer: { name: 'Quiz Bot', email: 'quiz@local' }
      })
    });
    if (!putRes.ok) {
      const err = await putRes.text();
      return res.status(putRes.status).json({ ok: false, msg: err });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, msg: String(e.message || e) });
  }
}
