// Firebase 配置 - 需在 Firebase 控制台创建项目后填写
// 1. 打开 https://console.firebase.google.com 创建项目
// 2. 项目设置 -> 常规 -> 您的应用 -> 添加 Web 应用
// 3. 复制配置填入下方
// 4. 启用 Firestore：构建 -> Firestore 数据库 -> 创建数据库
// 5. 【重要】Firestore 规则：控制台 -> Firestore -> 规则，必须包含：
//    match /databases/{database}/documents {
//      match /quiz_results/{doc} { allow read, write: if true; }
//    }
//    否则无法写入，管理员后台看不到记录
var FIREBASE_CONFIG = {
  apiKey: "AIzaSyCbvuztTW-syhjAqwp2uAH2SamUM1CEFOM",
  authDomain: "answer-recode.firebaseapp.com",
  projectId: "answer-recode",
  storageBucket: "answer-recode.firebasestorage.app",
  messagingSenderId: "432504572951",
  appId: "1:432504572951:web:1aa282e57aa0ab2f63a052",
  measurementId: "G-8T6CEQLYE2"
};
// 若以上为空，答题页仅用本地存储；管理员页可查看题目，但无法查看/删除作答记录
