/** Vercel: /api/save-github - 保存答题记录到 GitHub 仓库 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: 'Method not allowed' });

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const dataPath = process.env.GITHUB_DATA_PATH || 'data/quiz_results.json';

  if (!token || !repo) return res.status(500).json({ ok: false, msg: 'GITHUB_TOKEN 或 GITHUB_REPO 未配置' });
  const [owner, repoName] = repo.split('/').filter(Boolean);
  if (!owner || !repoName) return res.status(500).json({ ok: false, msg: 'GITHUB_REPO 格式错误' });

  const body = req.body || {};
  const record = {
    id: 'gh_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    deviceId: body.deviceId || '',
    userName: body.userName || '',
    correctCount: body.correctCount || 0,
    status: body.status || '',
    detail: body.detail || '',
    prize: body.prize || '',
    timeStr: body.timeStr || '',
    timestamp: Date.now()
  };
  if ((record.status || '') === '答题开始') return res.status(200).json({ ok: true });

  try {
    const api = 'https://api.github.com';
    let sha = null;
    let data = [];
    try {
      const getRes = await fetch(`${api}/repos/${owner}/${repoName}/contents/${dataPath}?ref=${branch}`, {
        headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json' }
      });
      if (getRes.ok) {
        const j = await getRes.json();
        sha = j.sha;
        if (j.content) {
          const decoded = Buffer.from(j.content.replace(/\n/g, ''), 'base64').toString('utf-8');
          data = JSON.parse(decoded || '[]');
        }
      }
    } catch (_) {}
    if (!Array.isArray(data)) data = [];

    data.push(record);
    const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
    const putRes = await fetch(`${api}/repos/${owner}/${repoName}/contents/${dataPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'quiz: ' + (record.userName || record.deviceId) + ' 提交',
        content,
        sha: sha || undefined,
        branch,
        committer: { name: 'Quiz Bot', email: 'quiz@local' }
      })
    });
    if (!putRes.ok) {
      const err = await putRes.text();
      return res.status(putRes.status).json({ ok: false, msg: 'GitHub API: ' + err });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, msg: String(e.message || e) });
  }
}
