const fs = require('fs');

// ===== TASK DATA (same as generate_schedule.js) =====
const PHASES = [
  { name: 'Phase 1: 基础架构与核心基建', weeks: 3, color: '#E53E3E', desc: '项目初始化、数据库搭建、用户注册/登录、双端身份切换、导航框架、API架构' },
  { name: 'Phase 2: 核心交易闭环',        weeks: 3, color: '#ED8936', desc: '发项目→投标→托管→交付→验收→结算全闭环、评价体系、佣金计算' },
  { name: 'Phase 3: 业务模块MVP',          weeks: 5, color: '#4299E1', desc: '首页、创作广场、资产库、培训学院、等级体系、创作者中心、需求方服务、人才库、平台活动' },
  { name: 'Phase 4: 扩展功能建设',          weeks: 4, color: '#9F7AEA', desc: '社区、会员体系、数据分析、消息通知、人才推荐、项目撮合' },
  { name: 'Phase 5: 优化与上线',           weeks: 3, color: '#38A169', desc: '测试、性能优化、安全审计、动画效果、三方对接、部署上线' },
];

const TASKS = [
  [0,'项目管理','项目初始化与脚手架搭建','P0',3,'','Next.js 16 + TypeScript + Tailwind CSS 4 初始化'],
  [0,'项目管理','技术选型与架构评审','P0',2,'','确认技术栈、目录结构、编码规范'],
  [0,'数据库','MySQL数据库搭建与初始化','P0',3,'','InnoDB引擎，utf8mb4字符集，建库建用户'],
  [0,'数据库','Prisma Schema 设计与迁移','P0',5,'3','基于27张表的完整Schema设计，含索引和外键'],
  [0,'数据库','Redis 缓存服务搭建','P0',2,'','会话管理、热点数据缓存、计数'],
  [0,'数据库','种子数据脚本编写','P0',2,'4','L1-L5等级预置数据、8大资产品类、专业角色'],
  [0,'用户体系','用户注册/登录功能','P0',5,'4','手机号注册+密码登录，bcrypt加密'],
  [0,'用户体系','JWT/会话管理','P0',3,'7','Token生成、验证、刷新、过期处理'],
  [0,'用户体系','双端身份切换系统','P0',5,'7','creator/client身份切换，导航项动态变化'],
  [0,'用户体系','用户实名认证','P1',3,'7','身份证/企业认证，人工审核流程'],
  [0,'用户体系','用户个人资料管理','P1',3,'7','头像/昵称/简介编辑，密码修改'],
  [0,'基础架构','前端导航框架搭建','P0',3,'9','PC端顶部导航+移动端TabBar，身份动态路由'],
  [0,'基础架构','API 基础架构搭建','P0',4,'4','RESTful API路由、中间件、错误处理'],
  [0,'基础架构','前端组件库建设','P1',5,'12','按钮/卡片/表单/弹窗/加载态等通用组件'],
  [0,'基础架构','CI/CD 流水线配置','P1',2,'13','GitHub Actions自动构建+部署'],
  [0,'基础架构','日志系统与监控搭建','P1',2,'13','ELK日志收集+性能监控'],
  [0,'基础架构','图标系统实现','P1',3,'12','44个SVG面性填充+双色图标，三端统一Logo'],
  [1,'接单大厅','需求方发布项目功能','P0',5,'9','项目表单：名称/类型/预算/等级要求/描述'],
  [1,'接单大厅','项目列表与筛选','P0',4,'18','卡片式列表+多维筛选（类型/等级/预算/紧急）'],
  [1,'接单大厅','项目详情页','P0',3,'18','完整项目描述、交付标准、需求方信息'],
  [1,'接单大厅','等级匹配机制','P0',3,'19','不同等级创作者看到不同项目池'],
  [1,'接单大厅','创作者投标功能','P0',4,'22','提交投标申请，附带个人简介和作品链接'],
  [1,'接单大厅','需求方选标功能','P0',3,'23','浏览投标列表，选定中标者'],
  [1,'交易支付','资金托管功能','P0',5,'23','需求方付款进入平台托管账户'],
  [1,'交易支付','订单生成与管理','P0',4,'23','中标后生成订单，状态流转管理'],
  [1,'交易支付','里程碑交付管理','P0',5,'24','分阶段验收，里程碑节点交付确认'],
  [1,'交易支付','资金释放与结算','P0',4,'24','验收通过后自动释放资金至创作者'],
  [1,'交易支付','佣金计算引擎','P0',4,'24','按等级佣金率+会员优惠计算，最低1%下限'],
  [1,'交易支付','交易流水记录','P0',3,'26','所有资金变动记录，对账使用'],
  [1,'评价体系','双向评价系统','P0',4,'24','需求方+创作者互评，1-5星评分'],
  [1,'评价体系','争议仲裁机制','P1',3,'30','提交证据→平台审核→48h内裁决→执行'],
  [1,'接单大厅','热门竞标排行侧边栏','P1',2,'19','PC端右侧热门项目排行+接单小贴士'],
  [2,'首页','首页 Hero Banner 区域','P1',3,'12','Slogan展示+核心数据统计+CTA按钮'],
  [2,'首页','四大引擎卡片展示','P1',3,'12','培训/接单/广场/资产四张导航卡片'],
  [2,'首页','五级体系首页展示','P1',3,'4','L1-L5等级卡片，含权益和佣金信息'],
  [2,'首页','热门项目推荐模块','P1',3,'19','首页展示可投标项目列表'],
  [2,'首页','身份切换器UI','P1',2,'9','头像旁身份标签+下拉菜单切换'],
  [2,'创作广场','作品展示网格布局','P1',4,'12','PC端4列/移动端2列瀑布流'],
  [2,'创作广场','作品上传/投稿功能','P1',4,'','支持故事/剧本/样片/完整漫剧'],
  [2,'创作广场','作品互动功能','P1',3,'39','浏览/点赞/评论/收藏/分享'],
  [2,'创作广场','版权登记与区块链确权','P2',5,'39','投稿即自动登记，生成唯一版权凭证'],
  [2,'创作广场','版权交易功能','P2',5,'42','采购方在线选购，协议模板，分润结算'],
  [2,'资产库','8大资产品类管理','P1',3,'4','角色/人脸/场景/道具/动作/音效/特效/风格'],
  [2,'资产库','资产上传与审核','P1',4,'44','上传者提交，平台审核入库'],
  [2,'资产库','资产浏览与搜索','P1',3,'44','按品类筛选，关键词搜索'],
  [2,'资产库','资产使用与分润结算','P1',5,'45','按次付费，三方分润计算，月度结算'],
  [2,'资产库','肖像权合规审核','P1',2,'44','人脸模型必须提供肖像权授权书'],
  [2,'培训学院','课程体系展示','P1',3,'12','三种课程模式：线上/线下VIP/线下大师'],
  [2,'培训学院','课程报名与支付','P1',4,'49','选课报名，在线支付'],
  [2,'培训学院','在线学习进度管理','P2',4,'50','录播视频播放，学习进度追踪'],
  [2,'培训学院','阶段考核与认证','P2',4,'50','考核提交，平台评分，自动定级'],
  [2,'培训学院','学费返还计算引擎','P2',4,'52','每笔订单自动扣除比例返还，进度展示'],
  [2,'等级体系','L1-L5等级规则引擎','P1',4,'4','等级定义、升降级条件、权限控制'],
  [2,'等级体系','等级成长路径展示','P1',3,'54','升级步骤条，进度可视化'],
  [2,'等级体系','每月自动升降级结算','P1',4,'54','每月1日自动扫描，条件判定，状态变更'],
  [2,'等级体系','会员订阅对比页面','P1',3,'12','免费版/Pro/Elite对比，先享后付条件说明'],
  [2,'创作者中心','创作者工作台仪表盘','P1',4,'9','数据总览：本月收入/进行中项目/待投标'],
  [2,'创作者中心','我的订单管理','P1',4,'24','进行中/已完成/已取消的项目列表'],
  [2,'创作者中心','作品集管理','P1',3,'39','已发布作品管理，广场投稿同步'],
  [2,'创作者中心','等级成长追踪','P1',3,'54','当前等级、升级进度、历史变更'],
  [2,'创作者中心','收益明细与提现','P1',4,'26','收入明细、提现管理、税务信息'],
  [2,'创作者中心','我的资产管理','P1',3,'45','已上传资产列表，使用次数和分润'],
  [2,'创作者中心','学费返还进度展示','P1',3,'52','进度条实时展示，多课程叠加'],
  [2,'创作者中心','账号设置','P1',2,'10','个人信息，实名认证，银行卡绑定'],
  [2,'需求方服务','需求方工作台','P1',4,'18','进行中项目/已完成/累计支出统计'],
  [2,'需求方服务','发布项目表单','P1',3,'18','项目名称/类型/预算/等级要求/描述'],
  [2,'需求方服务','创作者筛选与邀请','P1',4,'19','浏览人才库，直接邀请投标'],
  [2,'需求方服务','交易保障展示','P1',2,'12','资金托管/争议仲裁/质量管控说明'],
  [2,'平台活动','平台活动专区展示','P1',3,'12','聚合抖音/红果/快手/爱奇艺活动'],
  [2,'人才信息库','7大专业角色分类管理','P1',3,'4','导演/制作人/编剧/生成师/后期/美术/分镜师'],
  [2,'人才信息库','人才卡片展示与搜索','P1',4,'72','PC端侧边栏+网格，移动端芯片+2列'],
  [2,'人才信息库','人才详情弹窗','P1',3,'72','个人信息/作品集/技能/等级/联系方式'],
  [2,'人才信息库','创作者入驻审核流程','P1',5,'9','提交作品→平台审核→入库定级→接单'],
  [2,'人才信息库','PC端精确筛选（细分方向）','P2',3,'72','美术/分镜师等父分类下细分方向精确筛选'],
  [3,'社区','社区板块分类管理','P2',3,'12','8大板块：经验/互评/技术/资讯/心得/打卡/求助/组队'],
  [3,'社区','发帖功能','P2',4,'78','选择板块→填写标题/正文→上传图片→添加标签'],
  [3,'社区','帖子互动功能','P2',3,'79','点赞/评论/收藏/分享'],
  [3,'社区','热榜与推荐算法','P2',4,'79','综合浏览量/互动量/时效性计算排名'],
  [3,'社区','活跃达人展示','P2',2,'79','社区贡献最多创作者排名'],
  [3,'会员体系','会员订阅开通/取消','P2',4,'26','Pro/Elite/Business/Enterprise四种方案'],
  [3,'会员体系','先享后付计费引擎','P2',5,'84','月收入达标才扣费，低收入月自动免费'],
  [3,'会员体系','会员权益管理','P2',3,'84','佣金减免、功能特权、标识展示'],
  [3,'数据分析','创作者数据分析面板','P2',4,'58','转化率/趋势分析/竞品参考'],
  [3,'数据分析','需求方数据分析面板','P2',3,'67','项目数据/创作者匹配度分析'],
  [3,'数据分析','平台运营数据看板','P2',4,'26','GMV/MAU/转化率等核心指标实时展示'],
  [3,'消息通知','站内消息通知系统','P2',4,'12','中标通知/验收通知/评论回复/系统消息'],
  [3,'消息通知','消息推送集成','P2',3,'90','短信/App推送/邮件通知'],
  [3,'人才信息库','项目撮合功能','P2',4,'75','需求方可直接邀请人才投标'],
  [3,'人才信息库','人才推荐算法','P2',4,'72','基于技能/等级/历史评分的智能推荐'],
  [4,'测试','集成测试','P2',10,'','全流程测试：注册→发单→投标→交付→结算'],
  [4,'测试','性能测试与优化','P2',5,'96','500并发测试，SQL优化，缓存策略'],
  [4,'测试','安全审计','P2',4,'96','XSS/CSRF/SQL注入防护，数据加密检查'],
  [4,'优化','前端动画与过渡效果','P3',5,'12','卡片hover动效、页面切换动画、加载动画'],
  [4,'优化','推荐算法优化','P3',5,'93','项目推荐/作品推荐/人才推荐算法'],
  [4,'优化','移动端适配完善','P3',5,'12','各页面移动端响应式适配'],
  [4,'优化','三方平台对接','P3',8,'','抖音/红果/快手/爱奇艺活动对接API'],
  [4,'优化','SEO优化','P3',3,'12','SSR/元数据/结构化数据'],
  [4,'优化','多语言准备（i18n）','P3',4,'12','国际化框架，中文为主，英文准备'],
  [4,'上线','预发布环境部署','P2',3,'96','Staging环境，模拟真实数据'],
  [4,'上线','生产环境部署','P2',2,'106','Vercel/阿里云部署，域名配置，CDN'],
  [4,'上线','上线后监控与热修复','P2',5,'107','线上Bug修复，性能监控，应急响应'],
];

const PRIO_COLORS = { P0: '#E53E3E', P1: '#ED8936', P2: '#4299E1', P3: '#9CA3AF' };
const WEEK_START = new Date('2026-07-13');
const TOTAL_WEEKS = 18;

function fmt(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
function addWeek(d, w) { const n = new Date(d); n.setDate(n.getDate() + w * 7); return n; }
function addDay(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

// Calculate phase start weeks
let cumWeeks = 0;
const PHASE_START_WEEKS = [0];
for (let i = 1; i < PHASES.length; i++) { cumWeeks += PHASES[i-1].weeks; PHASE_START_WEEKS.push(cumWeeks); }

// Calculate total days per phase
const phaseDayOffsets = [0, 0, 0, 0, 0];

let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>生花AI创意平台 · 项目开发进度表</title>
<style>
:root {
  --primary:#E53E3E; --primary-bg:#FFF5F5; --primary-grad:linear-gradient(135deg,#E53E3E 0%,#F87171 100%);
  --secondary:#374151; --text:#1F2937; --text2:#6B7280; --border:#F0F0F0;
  --bg:#fff; --shadow:0 4px 12px rgba(229,62,62,0.03);
  --radius:16px; --radius-sm:10px;
}
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:"PingFang SC","Microsoft YaHei","Segoe UI",sans-serif; background:#F9FAFB; color:var(--text); line-height:1.6; }
.doc { max-width:1200px; margin:0 auto; background:white; box-shadow:0 0 60px rgba(229,62,62,0.06); border-radius:0 0 20px 20px; overflow:hidden; }
.cover { background:linear-gradient(135deg,#FFF0F0 0%,#FFFFFF 40%,#EBF4FF 100%); padding:80px 40px 50px; text-align:center; border-bottom:4px solid var(--primary); }
.cover h1 { font-size:42px; font-weight:800; background:var(--primary-grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.cover .sub { font-size:18px; color:var(--text2); margin:8px 0 20px; }
.cover .meta { display:flex; justify-content:center; gap:30px; font-size:14px; color:var(--text2); }
.content { padding:32px 40px; }
h2 { font-size:24px; color:var(--primary); margin:32px 0 16px; padding-bottom:8px; border-bottom:3px solid var(--primary); }
h3 { font-size:18px; color:var(--secondary); margin:24px 0 12px; padding-left:10px; border-left:4px solid var(--primary); }
p { margin:6px 0; font-size:14px; color:var(--text2); }
.summary-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin:16px 0; }
.scard { background:var(--primary-bg); border-radius:var(--radius-sm); padding:16px; text-align:center; border:1px solid var(--border); }
.scard .num { font-size:28px; font-weight:700; }
.scard .lbl { font-size:12px; color:var(--text2); margin-top:4px; }
.scard .p0 { color:#E53E3E; } .scard .p1 { color:#ED8936; } .scard .p2 { color:#4299E1; } .scard .p3 { color:#9CA3AF; }
table { width:100%; border-collapse:collapse; margin:12px 0; font-size:12px; }
th { background:#FFF5F5; color:var(--text); padding:8px 10px; text-align:left; font-weight:600; border-bottom:2px solid var(--primary); position:sticky; top:0; z-index:2; }
td { padding:6px 10px; border-bottom:1px solid var(--border); }
tr:nth-child(even) td { background:#FAFAFA; }
tr:hover td { background:#FFF0F0; }
.prio-badge { display:inline-block; padding:1px 8px; border-radius:4px; font-size:11px; font-weight:700; color:white; }
.phase-bar { display:inline-block; width:6px; height:14px; border-radius:2px; margin-right:6px; vertical-align:middle; }
.gantt { display:flex; gap:2px; align-items:center; }
.gantt-bar { height:14px; border-radius:3px; min-width:2px; }
.gantt-empty { height:14px; width:2px; background:#F0F0F0; border-radius:1px; }
.phase-section { margin:24px 0; padding:16px; border-radius:var(--radius-sm); border:1px solid var(--border); }
.phase-section h3 { border-left-color:inherit; margin-top:0; }
.phase-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.phase-stats { font-size:12px; color:var(--text2); }
.wk-label { font-size:9px; color:var(--text2); text-align:center; }
.prio-p0 { color:#E53E3E; font-weight:700; } .prio-p1 { color:#ED8936; font-weight:600; } .prio-p2 { color:#4299E1; } .prio-p3 { color:#9CA3AF; }
@media (max-width:768px) {
  .content { padding:16px; } .summary-grid { grid-template-columns:repeat(2,1fr); }
  .cover { padding:40px 20px; } .cover h1 { font-size:28px; }
}
</style>
</head>
<body>
<div class="doc">
<div class="cover">
  <h1>生花 AI 创意平台</h1>
  <div class="sub">项目开发进度表 · 2026年7月 ~ 2026年11月</div>
  <div class="meta"><span>总工期：18周 / 4.5个月</span><span>总任务：${TASKS.length} 项</span><span>总人天：${TASKS.reduce((s,t)=>s+t[4],0)}</span></div>
</div>
<div class="content">`;

// ---- Summary Cards ----
const p0c = TASKS.filter(t=>t[3]==='P0').length, p1c = TASKS.filter(t=>t[3]==='P1').length;
const p2c = TASKS.filter(t=>t[3]==='P2').length, p3c = TASKS.filter(t=>t[3]==='P3').length;
const totalDays = TASKS.reduce((s,t)=>s+t[4],0);

html += `
<h2>一、项目概览</h2>
<div class="summary-grid">
  <div class="scard"><div class="num" style="color:#E53E3E;">${TASKS.length}</div><div class="lbl">总任务数</div></div>
  <div class="scard"><div class="num" style="color:#E53E3E;">${totalDays}</div><div class="lbl">总人天</div></div>
  <div class="scard"><div class="num" style="color:#E53E3E;">18</div><div class="lbl">开发周数</div></div>
  <div class="scard"><div class="num" style="color:#E53E3E;">${TASKS.reduce((s,t)=>s+t[4],0)/18|0}</div><div class="lbl">平均人天/周</div></div>
  <div class="scard"><div class="num" style="color:#E53E3E;">${(totalDays/22/3)|0}</div><div class="lbl">建议团队人数</div></div>
</div>

<h2>二、优先级分布</h2>
<div class="summary-grid">
  <div class="scard"><div class="num p0">${p0c}</div><div class="lbl">P0 · 核心基础</div></div>
  <div class="scard"><div class="num p1">${p1c}</div><div class="lbl">P1 · 业务MVP</div></div>
  <div class="scard"><div class="num p2">${p2c}</div><div class="lbl">P2 · 扩展功能</div></div>
  <div class="scard"><div class="num p3">${p3c}</div><div class="lbl">P3 · 优化项</div></div>
  <div class="scard"><div class="num" style="color:#E53E3E;">${TASKS.length}</div><div class="lbl">合计</div></div>
</div>

<h2>三、阶段汇总</h2>
<table>
  <tr><th>阶段</th><th>时间范围</th><th>周数</th><th>P0</th><th>P1</th><th>P2</th><th>P3</th><th>总人天</th><th>核心内容</th></tr>`;

let phaseStart = new Date(WEEK_START);
PHASES.forEach((p, i) => {
  const pt = TASKS.filter(t => t[0] === i);
  const p0n = pt.filter(t=>t[3]==='P0').length, p1n = pt.filter(t=>t[3]==='P1').length;
  const p2n = pt.filter(t=>t[3]==='P2').length, p3n = pt.filter(t=>t[3]==='P3').length;
  const days = pt.reduce((s,t)=>s+t[4],0);
  const end = addWeek(phaseStart, p.weeks);
  html += `<tr><td><span class="phase-bar" style="background:${p.color};"></span>${p.name}</td><td>${fmt(phaseStart)} ~ ${fmt(end)}</td><td>${p.weeks}</td><td>${p0n}</td><td>${p1n}</td><td>${p2n}</td><td>${p3n}</td><td>${days}</td><td>${p.desc}</td></tr>`;
  phaseStart = end;
});
html += `<tr style="font-weight:700;background:#FFF5F5;"><td>合计</td><td>${fmt(WEEK_START)} ~ ${fmt(addWeek(WEEK_START, 18))}</td><td>18</td><td>${p0c}</td><td>${p1c}</td><td>${p2c}</td><td>${p3c}</td><td>${totalDays}</td><td>总任务数：${TASKS.length} 个</td></tr></table>`;

// ---- Phase-by-phase task tables ----
html += `\n<h2>四、详细任务分解</h2>`;

phaseStart = new Date(WEEK_START);
PHASES.forEach((p, i) => {
  const pt = TASKS.filter(t => t[0] === i);
  if (pt.length === 0) return;
  const phaseEnd = addWeek(phaseStart, p.weeks);

  html += `
<div class="phase-section" style="border-left:4px solid ${p.color};">
  <div class="phase-header">
    <h3 style="color:${p.color};border-left:none;padding-left:0;margin:0;">${p.name}</h3>
    <div class="phase-stats">${fmt(phaseStart)} ~ ${fmt(phaseEnd)} · ${p.weeks}周 · ${pt.length}项任务 · ${pt.reduce((s,t)=>s+t[4],0)}人天</div>
  </div>
  <table>
    <tr><th style="width:40px;">#</th><th style="width:100px;">模块</th><th>任务名称</th><th style="width:60px;">优先级</th><th style="width:60px;">工期</th><th style="width:60px;">依赖</th><th>备注</th></tr>`;

  let seq = 0;
  pt.forEach(t => {
    seq++;
    const prioColor = PRIO_COLORS[t[3]];
    html += `<tr><td>${seq}</td><td>${t[1]}</td><td>${t[2]}</td><td><span class="prio-badge" style="background:${prioColor};">${t[3]}</span></td><td>${t[4]}天</td><td>${t[5]||'—'}</td><td>${t[6]}</td></tr>`;
  });

  html += `</table></div>`;
  phaseStart = phaseEnd;
});

// ---- Gantt Chart ----
html += `\n<h2>五、甘特图时间线</h2>
<p style="margin-bottom:12px;">时间跨度：2026年7月13日 ~ 2026年11月15日（18周），色块表示任务所在阶段和时间跨度。</p>
<div style="overflow-x:auto;">
<table>
  <tr><th style="width:80px;">模块</th><th style="width:160px;">任务</th><th style="width:55px;">Prio</th>`;

for (let w = 1; w <= TOTAL_WEEKS; w++) {
  const ws = addWeek(WEEK_START, w - 1);
  html += `<th style="width:30px;font-size:9px;padding:4px 2px;text-align:center;">W${w}<br><span style="font-weight:400;">${fmt(ws).slice(5)}</span></th>`;
}
html += `</tr>`;

// Reset phase day offsets
const pdo = [0, 0, 0, 0, 0];
TASKS.forEach(t => {
  const pi = t[0];
  const startWeek = PHASE_START_WEEKS[pi] + pdo[pi] / 7;
  const durWeeks = t[4] / 7;
  pdo[pi] += t[4];

  html += `<tr><td style="font-size:11px;">${t[1]}</td><td style="font-size:11px;">${t[2]}</td><td><span class="prio-badge" style="background:${PRIO_COLORS[t[3]]};font-size:10px;">${t[3]}</span></td>`;
  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const wStart = w;
    const wEnd = w + 1;
    const tStart = startWeek;
    const tEnd = startWeek + durWeeks;
    const inRange = wStart >= tStart && wStart < tEnd;
    html += `<td style="padding:2px;text-align:center;${inRange ? `background:${PHASES[pi].color};` : ''}font-size:8px;">${inRange ? '█' : ''}</td>`;
  }
  html += `</tr>`;
});

html += `</table></div>
<p style="font-size:12px;color:var(--text2);margin-top:8px;">█ 色块表示任务时间范围 · 颜色对应五个阶段：Phase 1 红 · Phase 2 橙 · Phase 3 蓝 · Phase 4 紫 · Phase 5 绿</p>

<div class="footer" style="text-align:center;padding:40px 0 16px;color:var(--text2);font-size:12px;">
  <p>— 文档结束 —</p>
  <p>生花AI创意平台 · 项目开发进度表</p>
  <p>&copy; 2026 帧游计科技 · 仅供内部使用</p>
</div>

</div><!-- /content -->
</div><!-- /doc -->
</body>
</html>`;

fs.writeFileSync('e:\\AI视频\\生花\\schedule.html', html, 'utf-8');
console.log('✅ schedule.html 生成成功！');
console.log('📄 文件大小: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');