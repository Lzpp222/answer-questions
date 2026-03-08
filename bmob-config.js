// Bmob 配置 - 作为 Firebase 备用，国内手机网络通常可访问
// LeanCloud 已下线，Bmob 为国内 BaaS 替代方案
//
// 配置步骤：
// 1. 打开 https://www.bmobapp.com 注册并创建应用
// 2. 应用 -> 设置 -> 应用密钥：复制 Application ID、REST API Key
// 3. 应用 -> 设置 -> 域名管理：获取 API 域名（新应用有测试域名，正式上线需绑定备案域名）
//    测试域名格式通常为 https://xxx.bmobapp.com 或控制台显示的地址
// 4. 数据服务 -> 创建表，表名为 QuizResult（与下方 BMOB_CLASS 一致）
// 5. 添加列：deviceId(字符串)、userName(字符串)、correctCount(数字)、status(字符串)、
//    detail(字符串)、prize(字符串)、timeStr(字符串)
//
// 留空则仅使用 Firebase，不启用 Bmob 备用
var BMOB_CONFIG = {
  appId: '61224d8b145357eaea7dd7eb1bf0fc92',
  apiKey: 'a45327ff305af73a60be9cc36f5323bf',
  serverURL: ''   // 无备案域名时留空，否则会卡在「加载中」；有域名时填控制台显示的 API 地址
};
var BMOB_CLASS = 'QuizResult';
