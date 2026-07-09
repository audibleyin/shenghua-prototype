const ExcelJS = require('exceljs');

// ===== CONFIG =====
// 假设项目从 2026年7月13日（周一）开始
const PROJECT_START = new Date('2026-07-13');
const PHASES = [
  { name: 'Phase 1: 基础架构与核心基建', weeks: 3,  color: 'FFE53E3E' },
  { name: 'Phase 2: 核心交易闭环',        weeks: 3,  color: 'FFED8936' },
  { name: 'Phase 3: 业务模块MVP',          weeks: 5,  color: 'FF4299E1' },
  { name: 'Phase 4: 扩展功能建设',          weeks: 4,  color: 'FF9F7AEA' },
  { name: 'Phase 5: 优化与上线',           weeks: 3,  color: 'FF38A169' },
];

function addWeek(date, w) { const d = new Date(date); d.setDate(d.getDate() + w * 7); return d; }
function addDay(date, d) { const n = new Date(date); n.setDate(n.getDate() + d); return n; }
function fmt(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// ===== TASK DATA =====
// 结构: [阶段索引, 模块, 任务名称, 优先级, 工期(人天), 依赖, 备注]
const TASKS = [
  // ===== Phase 1: 基础架构与核心基建 =====
  [0, '项目管理', '项目初始化与脚手架搭建', 'P0', 3, '', 'Next.js 16 + TypeScript + Tailwind CSS 4 初始化'],
  [0, '项目管理', '技术选型与架构评审', 'P0', 2, '', '确认技术栈、目录结构、编码规范'],
  [0, '数据库', 'MySQL数据库搭建与初始化', 'P0', 3, '', 'InnoDB引擎，utf8mb4字符集，建库建用户'],
  [0, '数据库', 'Prisma Schema 设计与迁移', 'P0', 5, '3', '基于27张表的完整Schema设计，含索引和外键'],
  [0, '数据库', 'Redis 缓存服务搭建', 'P0', 2, '', '会话管理、热点数据缓存、计数'],
  [0, '数据库', '种子数据脚本编写', 'P0', 2, '4', 'L1-L5等级预置数据、8大资产品类、专业角色'],
  [0, '用户体系', '用户注册/登录功能', 'P0', 5, '4', '手机号注册+密码登录，bcrypt加密'],
  [0, '用户体系', 'JWT/会话管理', 'P0', 3, '7', 'Token生成、验证、刷新、过期处理'],
  [0, '用户体系', '双端身份切换系统', 'P0', 5, '7', 'creator/client身份切换，导航项动态变化'],
  [0, '用户体系', '用户实名认证', 'P1', 3, '7', '身份证/企业认证，人工审核流程'],
  [0, '用户体系', '用户个人资料管理', 'P1', 3, '7', '头像/昵称/简介编辑，密码修改'],
  [0, '基础架构', '前端导航框架搭建', 'P0', 3, '9', 'PC端顶部导航+移动端TabBar，身份动态路由'],
  [0, '基础架构', 'API 基础架构搭建', 'P0', 4, '4', 'RESTful API路由、中间件、错误处理'],
  [0, '基础架构', '前端组件库建设', 'P1', 5, '12', '按钮/卡片/表单/弹窗/加载态等通用组件'],
  [0, '基础架构', 'CI/CD 流水线配置', 'P1', 2, '13', 'GitHub Actions自动构建+部署'],
  [0, '基础架构', '日志系统与监控搭建', 'P1', 2, '13', 'ELK日志收集+性能监控'],
  [0, '基础架构', '图标系统实现', 'P1', 3, '12', '44个SVG面性填充+双色图标，三端统一Logo'],

  // ===== Phase 2: 核心交易闭环 =====
  [1, '接单大厅', '需求方发布项目功能', 'P0', 5, '9', '项目表单：名称/类型/预算/等级要求/描述'],
  [1, '接单大厅', '项目列表与筛选', 'P0', 4, '18', '卡片式列表+多维筛选（类型/等级/预算/紧急）'],
  [1, '接单大厅', '项目详情页', 'P0', 3, '18', '完整项目描述、交付标准、需求方信息'],
  [1, '接单大厅', '等级匹配机制', 'P0', 3, '19', '不同等级创作者看到不同项目池'],
  [1, '接单大厅', '创作者投标功能', 'P0', 4, '21', '提交投标申请，附带个人简介和作品链接'],
  [1, '接单大厅', '需求方选标功能', 'P0', 3, '22', '浏览投标列表，选定中标者'],
  [1, '交易支付', '资金托管功能', 'P0', 5, '23', '需求方付款进入平台托管账户'],
  [1, '交易支付', '订单生成与管理', 'P0', 4, '23', '中标后生成订单，状态流转管理'],
  [1, '交易支付', '里程碑交付管理', 'P0', 5, '24', '分阶段验收，里程碑节点交付确认'],
  [1, '交易支付', '资金释放与结算', 'P0', 4, '24', '验收通过后自动释放资金至创作者'],
  [1, '交易支付', '佣金计算引擎', 'P0', 4, '24', '按等级佣金率+会员优惠计算，最低1%下限'],
  [1, '交易支付', '交易流水记录', 'P0', 3, '26', '所有资金变动记录，对账使用'],
  [1, '评价体系', '双向评价系统', 'P0', 4, '24', '需求方+创作者互评，1-5星评分'],
  [1, '评价体系', '争议仲裁机制', 'P1', 3, '28', '提交证据→平台审核→48h内裁决→执行'],
  [1, '接单大厅', '热门竞标排行侧边栏', 'P1', 2, '19', 'PC端右侧热门项目排行+接单小贴士'],

  // ===== Phase 3: 业务模块MVP =====
  [2, '首页', '首页 Hero Banner 区域', 'P1', 3, '12', 'Slogan展示+核心数据统计+CTA按钮'],
  [2, '首页', '四大引擎卡片展示', 'P1', 3, '12', '培训/接单/广场/资产四张导航卡片'],
  [2, '首页', '五级体系首页展示', 'P1', 3, '4', 'L1-L5等级卡片，含权益和佣金信息'],
  [2, '首页', '热门项目推荐模块', 'P1', 3, '19', '首页展示可投标项目列表'],
  [2, '首页', '身份切换器UI', 'P1', 2, '9', '头像旁身份标签+下拉菜单切换'],
  [2, '创作广场', '作品展示网格布局', 'P1', 4, '12', 'PC端4列/移动端2列瀑布流'],
  [2, '创作广场', '作品上传/投稿功能', 'P1', 4, '', '支持故事/剧本/样片/完整漫剧'],
  [2, '创作广场', '作品互动功能', 'P1', 3, '37', '浏览/点赞/评论/收藏/分享'],
  [2, '创作广场', '版权登记与区块链确权', 'P2', 5, '37', '投稿即自动登记，生成唯一版权凭证'],
  [2, '创作广场', '版权交易功能', 'P2', 5, '40', '采购方在线选购，协议模板，分润结算'],
  [2, '资产库', '8大资产品类管理', 'P1', 3, '4', '角色/人脸/场景/道具/动作/音效/特效/风格'],
  [2, '资产库', '资产上传与审核', 'P1', 4, '42', '上传者提交，平台审核入库'],
  [2, '资产库', '资产浏览与搜索', 'P1', 3, '42', '按品类筛选，关键词搜索'],
  [2, '资产库', '资产使用与分润结算', 'P1', 5, '43', '按次付费，三方分润计算，月度结算'],
  [2, '资产库', '肖像权合规审核', 'P1', 2, '42', '人脸模型必须提供肖像权授权书'],
  [2, '培训学院', '课程体系展示', 'P1', 3, '12', '三种课程模式：线上/线下VIP/线下大师'],
  [2, '培训学院', '课程报名与支付', 'P1', 4, '47', '选课报名，在线支付'],
  [2, '培训学院', '在线学习进度管理', 'P2', 4, '48', '录播视频播放，学习进度追踪'],
  [2, '培训学院', '阶段考核与认证', 'P2', 4, '48', '考核提交，平台评分，自动定级'],
  [2, '培训学院', '学费返还计算引擎', 'P2', 4, '49', '每笔订单自动扣除比例返还，进度展示'],
  [2, '等级体系', 'L1-L5等级规则引擎', 'P1', 4, '4', '等级定义、升降级条件、权限控制'],
  [2, '等级体系', '等级成长路径展示', 'P1', 3, '52', '升级步骤条，进度可视化'],
  [2, '等级体系', '每月自动升降级结算', 'P1', 4, '52', '每月1日自动扫描，条件判定，状态变更'],
  [2, '等级体系', '会员订阅对比页面', 'P1', 3, '12', '免费版/Pro/Elite对比，先享后付条件说明'],
  [2, '创作者中心', '创作者工作台仪表盘', 'P1', 4, '9', '数据总览：本月收入/进行中项目/待投标'],
  [2, '创作者中心', '我的订单管理', 'P1', 4, '24', '进行中/已完成/已取消的项目列表'],
  [2, '创作者中心', '作品集管理', 'P1', 3, '37', '已发布作品管理，广场投稿同步'],
  [2, '创作者中心', '等级成长追踪', 'P1', 3, '52', '当前等级、升级进度、历史变更'],
  [2, '创作者中心', '收益明细与提现', 'P1', 4, '26', '收入明细、提现管理、税务信息'],
  [2, '创作者中心', '我的资产管理', 'P1', 3, '43', '已上传资产列表，使用次数和分润'],
  [2, '创作者中心', '学费返还进度展示', 'P1', 3, '51', '进度条实时展示，多课程叠加'],
  [2, '创作者中心', '账号设置', 'P1', 2, '10', '个人信息，实名认证，银行卡绑定'],
  [2, '需求方服务', '需求方工作台', 'P1', 4, '18', '进行中项目/已完成/累计支出统计'],
  [2, '需求方服务', '发布项目表单', 'P1', 3, '18', '项目名称/类型/预算/等级要求/描述'],
  [2, '需求方服务', '创作者筛选与邀请', 'P1', 4, '19', '浏览人才库，直接邀请投标'],
  [2, '需求方服务', '交易保障展示', 'P1', 2, '12', '资金托管/争议仲裁/质量管控说明'],
  [2, '平台活动', '平台活动专区展示', 'P1', 3, '12', '聚合抖音/红果/快手/爱奇艺活动'],
  [2, '人才信息库', '7大专业角色分类管理', 'P1', 3, '4', '导演/制作人/编剧/生成师/后期/美术/分镜师'],
  [2, '人才信息库', '人才卡片展示与搜索', 'P1', 4, '70', 'PC端侧边栏+网格，移动端芯片+2列'],
  [2, '人才信息库', '人才详情弹窗', 'P1', 3, '70', '个人信息/作品集/技能/等级/联系方式'],
  [2, '人才信息库', '创作者入驻审核流程', 'P1', 5, '9', '提交作品→平台审核→入库定级→接单'],
  [2, '人才信息库', 'PC端精确筛选（细分方向）', 'P2', 3, '70', '美术/分镜师等父分类下细分方向精确筛选'],

  // ===== Phase 4: 扩展功能建设 =====
  [3, '社区', '社区板块分类管理', 'P2', 3, '12', '8大板块：经验/互评/技术/资讯/心得/打卡/求助/组队'],
  [3, '社区', '发帖功能', 'P2', 4, '76', '选择板块→填写标题/正文→上传图片→添加标签'],
  [3, '社区', '帖子互动功能', 'P2', 3, '77', '点赞/评论/收藏/分享'],
  [3, '社区', '热榜与推荐算法', 'P2', 4, '77', '综合浏览量/互动量/时效性计算排名'],
  [3, '社区', '活跃达人展示', 'P2', 2, '77', '社区贡献最多创作者排名'],
  [3, '会员体系', '会员订阅开通/取消', 'P2', 4, '26', 'Pro/Elite/Business/Enterprise四种方案'],
  [3, '会员体系', '先享后付计费引擎', 'P2', 5, '82', '月收入达标才扣费，低收入月自动免费'],
  [3, '会员体系', '会员权益管理', 'P2', 3, '82', '佣金减免、功能特权、标识展示'],
  [3, '数据分析', '创作者数据分析面板', 'P2', 4, '56', '转化率/趋势分析/竞品参考'],
  [3, '数据分析', '需求方数据分析面板', 'P2', 3, '65', '项目数据/创作者匹配度分析'],
  [3, '数据分析', '平台运营数据看板', 'P2', 4, '26', 'GMV/MAU/转化率等核心指标实时展示'],
  [3, '消息通知', '站内消息通知系统', 'P2', 4, '12', '中标通知/验收通知/评论回复/系统消息'],
  [3, '消息通知', '消息推送集成', 'P2', 3, '88', '短信/App推送/邮件通知'],
  [3, '人才信息库', '项目撮合功能', 'P2', 4, '73', '需求方可直接邀请人才投标'],
  [3, '人才信息库', '人才推荐算法', 'P2', 4, '70', '基于技能/等级/历史评分的智能推荐'],

  // ===== Phase 5: 优化与上线 =====
  [4, '测试', '集成测试', 'P2', 10, '', '全流程测试：注册→发单→投标→交付→结算'],
  [4, '测试', '性能测试与优化', 'P2', 5, '94', '500并发测试，SQL优化，缓存策略'],
  [4, '测试', '安全审计', 'P2', 4, '94', 'XSS/CSRF/SQL注入防护，数据加密检查'],
  [4, '优化', '前端动画与过渡效果', 'P3', 5, '12', '卡片hover动效、页面切换动画、加载动画'],
  [4, '优化', '推荐算法优化', 'P3', 5, '91', '项目推荐/作品推荐/人才推荐算法'],
  [4, '优化', '移动端适配完善', 'P3', 5, '12', '各页面移动端响应式适配'],
  [4, '优化', '三方平台对接', 'P3', 8, '', '抖音/红果/快手/爱奇艺活动对接API'],
  [4, '优化', 'SEO优化', 'P3', 3, '12', 'SSR/元数据/结构化数据'],
  [4, '优化', '多语言准备（i18n）', 'P3', 4, '12', '国际化框架，中文为主，英文准备'],
  [4, '上线', '预发布环境部署', 'P2', 3, '94', 'Staging环境，模拟真实数据'],
  [4, '上线', '生产环境部署', 'P2', 2, '104', 'Vercel/阿里云部署，域名配置，CDN'],
  [4, '上线', '上线后监控与热修复', 'P2', 5, '105', '线上Bug修复，性能监控，应急响应'],
];

// ===== GENERATE =====
async function main() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = '帧游计科技';
  workbook.created = new Date();

  // ===== Sheet 1: 开发进度总览 =====
  const sheet1 = workbook.addWorksheet('开发进度总览', {
    views: [{ state: 'frozen', ySplit: 2 }]
  });

  // 标题行
  sheet1.mergeCells('A1:H1');
  const titleCell = sheet1.getCell('A1');
  titleCell.value = '生花AI创意平台 — 项目开发进度表（总工期：~18周 / 4.5个月）';
  titleCell.font = { name: 'Microsoft YaHei', size: 16, bold: true, color: { argb: 'FFE53E3E' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet1.getRow(1).height = 40;

  // 表头
  const headers = ['序号', '阶段', '模块', '任务名称', '优先级', '工期(人天)', '依赖任务', '备注/说明'];
  const headerRow = sheet1.addRow(headers);
  headerRow.height = 28;
  headerRow.eachCell(cell => {
    cell.font = { name: 'Microsoft YaHei', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE53E3E' } };
    cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    };
  });

  // 计算日期
  let phaseStart = new Date(PROJECT_START);

  // 数据行
  let seq = 0;
  let phaseLabels = PHASES.map(p => p.name);

  TASKS.forEach((t, idx) => {
    seq++;
    const phaseIdx = t[0];
    const phaseName = PHASES[phaseIdx].name;
    const phaseColor = PHASES[phaseIdx].color;

    // 计算该任务的开始/结束日期（基于阶段起始）
    const taskStart = new Date(phaseStart);
    const taskEnd = new Date(phaseStart);
    taskEnd.setDate(taskEnd.getDate() + t[4]); // 加工期天数

    const row = sheet1.addRow([
      seq,
      phaseName,
      t[1],     // 模块
      t[2],     // 任务名称
      t[3],     // 优先级
      t[4],     // 工期
      t[5],     // 依赖
      t[6],     // 备注
    ]);
    row.height = 22;

    // 给阶段列着色
    const phaseCell = row.getCell(2);
    phaseCell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: phaseColor } };

    // 优先级着色
    const prioCell = row.getCell(5);
    const prioColors = { 'P0': 'FFE53E3E', 'P1': 'FFED8936', 'P2': 'FF4299E1', 'P3': 'FF9CA3AF' };
    prioCell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: prioColors[t[3]] || 'FF333333' } };

    // 边框
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
      cell.alignment = { vertical: 'center', wrapText: true };
      cell.font = { ...cell.font, name: 'Microsoft YaHei', size: 10 };
    });
  });

  // 列宽
  sheet1.getColumn(1).width = 6;   // 序号
  sheet1.getColumn(2).width = 22;  // 阶段
  sheet1.getColumn(3).width = 14;  // 模块
  sheet1.getColumn(4).width = 30;  // 任务名称
  sheet1.getColumn(5).width = 8;   // 优先级
  sheet1.getColumn(6).width = 10;  // 工期
  sheet1.getColumn(7).width = 12;  // 依赖
  sheet1.getColumn(8).width = 38;  // 备注

  // ===== Sheet 2: 甘特图时间线 =====
  const sheet2 = workbook.addWorksheet('甘特图时间线', {
    views: [{ state: 'frozen', ySplit: 2 }]
  });

  // 标题
  sheet2.mergeCells('A1:H1');
  const title2 = sheet2.getCell('A1');
  title2.value = '生花AI创意平台 — 开发时间线（2026年7月 - 2026年11月）';
  title2.font = { name: 'Microsoft YaHei', size: 14, bold: true, color: { argb: 'FFE53E3E' } };
  title2.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet2.getRow(1).height = 36;

  // 表头：任务信息 + 周次
  const weekHeaders = ['模块', '任务名称', '优先级', '工期(天)'];
  const totalWeeks = 18;
  for (let w = 1; w <= totalWeeks; w++) {
    // 计算该周起始日期
    const weekStart = addWeek(PROJECT_START, w - 1);
    const label = `W${w}\n${fmt(weekStart).slice(5)}`;
    weekHeaders.push(label);
  }

  const hRow2 = sheet2.addRow(weekHeaders);
  hRow2.height = 40;
  hRow2.eachCell((cell, col) => {
    cell.font = { name: 'Microsoft YaHei', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
    cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    };
  });

  // 阶段起始周索引
  let phaseWeekStarts = [0];
  let cumulative = 0;
  for (let i = 0; i < PHASES.length - 1; i++) {
    cumulative += PHASES[i].weeks;
    phaseWeekStarts.push(cumulative);
  }

  // 每阶段内任务按顺序展开
  let phaseTaskIdx = [0, 0, 0, 0, 0];
  let currentPhaseStartWeek = [0];
  let cumWeeks = 0;
  for (let i = 1; i < PHASES.length; i++) {
    cumWeeks += PHASES[i - 1].weeks;
    currentPhaseStartWeek.push(cumWeeks);
  }

  // 每阶段内任务按顺序累加天数
  let phaseDayOffset = [0, 0, 0, 0, 0];

  TASKS.forEach((t) => {
    const phaseIdx = t[0];
    const phaseColor = PHASES[phaseIdx].color;
    const days = t[4];
    const startWeekFloat = currentPhaseStartWeek[phaseIdx] + phaseDayOffset[phaseIdx] / 7;
    const durationWeeks = days / 7;
    phaseDayOffset[phaseIdx] += days;

    const rowData = [t[1], t[2], t[3], days];

    for (let w = 1; w <= totalWeeks; w++) {
      const wStart = w - 1;
      const wEnd = w;
      const taskStart = startWeekFloat;
      const taskEnd = startWeekFloat + durationWeeks;

      // 该周是否在任务范围内
      if (wStart >= taskStart && wStart < taskEnd) {
        rowData.push('██');
      } else if (wStart >= taskStart - 0.1 && wStart < taskEnd + 0.1) {
        // 边界
        rowData.push('▌');
      } else {
        rowData.push('');
      }
    }

    const dataRow = sheet2.addRow(rowData);
    dataRow.height = 20;

    // 优先级着色
    const prioCell2 = dataRow.getCell(3);
    const prioColors2 = { 'P0': 'FFE53E3E', 'P1': 'FFED8936', 'P2': 'FF4299E1', 'P3': 'FF9CA3AF' };
    prioCell2.font = { name: 'Microsoft YaHei', size: 9, bold: true, color: { argb: prioColors2[t[3]] || 'FF333333' } };

    // 甘特图部分着色
    for (let c = 5; c <= 5 + totalWeeks - 1; c++) {
      const cell = dataRow.getCell(c);
      if (cell.value && cell.value.toString().includes('█')) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: phaseColor } };
        cell.font = { color: { argb: 'FFFFFFFF' }, size: 8 };
      } else if (cell.value && cell.value.toString().includes('▌')) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: phaseColor } };
        cell.font = { color: { argb: 'FFFFFFFF' }, size: 8 };
      }
      cell.alignment = { horizontal: 'center', vertical: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFF0F0F0' } },
        bottom: { style: 'thin', color: { argb: 'FFF0F0F0' } },
        left: { style: 'thin', color: { argb: 'FFF0F0F0' } },
        right: { style: 'thin', color: { argb: 'FFF0F0F0' } },
      };
    }

    // 边框
    dataRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
      cell.font = { ...cell.font, name: 'Microsoft YaHei', size: 9 };
      cell.alignment = { ...cell.alignment, vertical: 'center', wrapText: true };
    });
  });

  // 列宽 - 甘特图
  sheet2.getColumn(1).width = 14;
  sheet2.getColumn(2).width = 28;
  sheet2.getColumn(3).width = 8;
  sheet2.getColumn(4).width = 8;
  for (let w = 1; w <= totalWeeks; w++) {
    sheet2.getColumn(4 + w).width = 7;
  }

  // ===== Sheet 3: 阶段汇总 =====
  const sheet3 = workbook.addWorksheet('阶段汇总', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  const summaryHeaders = ['阶段', '时间范围', '周数', 'P0任务数', 'P1任务数', 'P2任务数', 'P3任务数', '总人天', '主要内容'];
  const sRow = sheet3.addRow(summaryHeaders);
  sRow.height = 28;
  sRow.eachCell(cell => {
    cell.font = { name: 'Microsoft YaHei', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
    cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    };
  });

  let totalAll = 0;
  let phaseStartDate = new Date(PROJECT_START);

  PHASES.forEach((p, idx) => {
    const phaseTasks = TASKS.filter(t => t[0] === idx);
    const p0 = phaseTasks.filter(t => t[3] === 'P0').length;
    const p1 = phaseTasks.filter(t => t[3] === 'P1').length;
    const p2 = phaseTasks.filter(t => t[3] === 'P2').length;
    const p3 = phaseTasks.filter(t => t[3] === 'P3').length;
    const totalDays = phaseTasks.reduce((sum, t) => sum + t[4], 0);
    const phaseEnd = addWeek(phaseStartDate, p.weeks);
    totalAll += totalDays;

    const descs = {
      0: '项目初始化、数据库搭建、用户注册/登录、双端身份切换、导航框架、API架构',
      1: '发项目→投标→托管→交付→验收→结算全闭环、评价体系、佣金计算',
      2: '首页、创作广场、资产库、培训学院、等级体系、创作者中心、需求方服务、人才库、平台活动',
      3: '社区、会员体系、数据分析、消息通知、人才推荐、项目撮合',
      4: '测试、性能优化、安全审计、动画效果、三方对接、部署上线',
    };

    const row = sheet3.addRow([
      p.name,
      `${fmt(phaseStartDate)} ~ ${fmt(phaseEnd)}`,
      p.weeks,
      p0, p1, p2, p3,
      totalDays,
      descs[idx] || '',
    ]);
    row.height = 24;
    row.eachCell(cell => {
      cell.font = { name: 'Microsoft YaHei', size: 10 };
      cell.alignment = { vertical: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    });
    // 阶段名着色
    const nameCell = row.getCell(1);
    nameCell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: p.color } };

    phaseStartDate = phaseEnd;
  });

  // 合计行
  const totalRow = sheet3.addRow([
    '合计',
    `${fmt(PROJECT_START)} ~ ${fmt(addWeek(PROJECT_START, 18))}`,
    '18',
    TASKS.filter(t => t[3] === 'P0').length,
    TASKS.filter(t => t[3] === 'P1').length,
    TASKS.filter(t => t[3] === 'P2').length,
    TASKS.filter(t => t[3] === 'P3').length,
    totalAll,
    `总任务数：${TASKS.length} 个`,
  ]);
  totalRow.height = 28;
  totalRow.eachCell(cell => {
    cell.font = { name: 'Microsoft YaHei', size: 11, bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF5F5' } };
    cell.alignment = { vertical: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    };
  });

  sheet3.getColumn(1).width = 26;
  sheet3.getColumn(2).width = 28;
  sheet3.getColumn(3).width = 8;
  sheet3.getColumn(4).width = 10;
  sheet3.getColumn(5).width = 10;
  sheet3.getColumn(6).width = 10;
  sheet3.getColumn(7).width = 10;
  sheet3.getColumn(8).width = 10;
  sheet3.getColumn(9).width = 50;

  // ===== 保存 =====
  const outputPath = 'e:\\AI视频\\生花\\生花平台开发进度表.xlsx';
  await workbook.xlsx.writeFile(outputPath);
  console.log('✅ 进度表生成成功！');
  console.log('📄 输出路径: ' + outputPath);
  console.log('📊 包含 3 个工作表：');
  console.log('   1. 开发进度总览 - 107项任务明细');
  console.log('   2. 甘特图时间线 - 18周可视化排期');
  console.log('   3. 阶段汇总 - 5个阶段统计概览');
  console.log(`📦 总任务数: ${TASKS.length}，总人天: ${totalAll}`);
  console.log(`   P0: ${TASKS.filter(t=>t[3]==='P0').length} 项`);
  console.log(`   P1: ${TASKS.filter(t=>t[3]==='P1').length} 项`);
  console.log(`   P2: ${TASKS.filter(t=>t[3]==='P2').length} 项`);
  console.log(`   P3: ${TASKS.filter(t=>t[3]==='P3').length} 项`);
}

main().catch(err => { console.error('❌ 生成失败:', err); process.exit(1); });