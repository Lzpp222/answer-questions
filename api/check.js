/** Vercel Serverless: 检查设备是否已参与 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ hasRecord: false });

  const deviceId = req.query.deviceId || '';
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const dataPath = process.env.GITHUB_DATA_PATH || 'data/quiz_results.json';

  if (!repo || !deviceId) return res.status(200).json({ hasRecord: false, result: null });
  const [owner, repoName] = repo.split('/').filter(Boolean);
  if (!owner || !repoName) return res.status(200).json({ hasRecord: false, result: null });

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${dataPath}`;
  try {
    const r = await fetch(rawUrl, { headers: { 'Cache-Control': 'no-cache' } });
    if (!r.ok) return res.status(200).json({ hasRecord: false, result: null });
    const data = await r.json();
    const list = Array.isArray(data) ? data : [];
    const found = list.filter(d => (d.status || '') !== '答题开始' && d.deviceId === deviceId).pop();
    return res.status(200).json({ hasRecord: !!found, result: found || null });
  } catch (e) {
    return res.status(200).json({ hasRecord: false, result: null });
  }
}
