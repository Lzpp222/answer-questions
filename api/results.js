/** Vercel Serverless: 读取答题记录（从 GitHub raw 或 API） */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ ok: false });

  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const dataPath = process.env.GITHUB_DATA_PATH || 'data/quiz_results.json';

  if (!repo) return res.status(500).json([]);
  const [owner, repoName] = repo.split('/').filter(Boolean);
  if (!owner || !repoName) return res.status(500).json([]);

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${dataPath}`;
  try {
    const r = await fetch(rawUrl, { headers: { 'Cache-Control': 'no-cache' } });
    if (!r.ok) return res.status(200).json([]);
    const data = await r.json();
    const list = Array.isArray(data) ? data : [];
    const filtered = list.filter(d => (d.status || '') !== '答题开始');
    return res.status(200).json(filtered);
  } catch (e) {
    return res.status(200).json([]);
  }
}
