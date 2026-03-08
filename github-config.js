// GitHub 存储配置 - 数据保存在仓库的 data/quiz_results.json
//
// 配置步骤：
// 1. 在 GitHub 创建 Personal Access Token：Settings → Developer settings → Personal access tokens
//    勾选 repo 权限
// 2. 将 token 填入 github-server-config.json（仅服务端，勿提交到 Git）
// 3. owner/repo 填你的仓库信息
// 4. apiBase：部署到 Vercel 时留空；部署到 GitHub Pages 时填 Vercel API 地址
//
var GITHUB_CONFIG = {
  owner: 'lzpp222',
  repo: 'answer-questions',
  branch: 'main',
  dataPath: 'data/quiz_results.json',
  apiBase: ''   // 空=同源；GitHub Pages 部署时填 Vercel 地址，如 'https://quiz-xxx.vercel.app'
};
