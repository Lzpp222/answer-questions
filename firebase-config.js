// Firebase 配置 - 需在 Firebase 控制台创建项目后填写
// 1. 打开 https://console.firebase.google.com 创建项目
// 2. 项目设置 -> 常规 -> 您的应用 -> 添加 Web 应用
// 3. 复制配置填入下方
// 4. 启用 Firestore：构建 -> Firestore 数据库 -> 创建数据库
// 5. 规则设为：allow read, write: if true; （仅用于活动，生产环境请加强安全）
var FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
// 若以上为空，答题页仅用本地存储；管理员页可查看题目，但无法查看/删除作答记录
