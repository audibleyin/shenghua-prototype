const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  TableOfContents, Header, Footer, PageNumber, TabStopPosition, TabStopType,
  convertInchesToTwip, LevelFormat, NumberFormat
} = require('docx');
const fs = require('fs');

// ========== HELPER ==========
function heading(text, level = 1) {
  const lvMap = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3, 4: HeadingLevel.HEADING_4 };
  return new Paragraph({ text, heading: lvMap[level] || HeadingLevel.HEADING_2, spacing: { before: level === 1 ? 360 : 240, after: 120 } });
}
function para(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, size: 21, ...opts })], spacing: { after: 80 } });
}
function boldPara(text) {
  return new Paragraph({ children: [new TextRun({ text, bold: true, size: 21 })], spacing: { after: 80 } });
}
function emptyLine() {
  return new Paragraph({ spacing: { after: 60 } });
}
function cell(text, opts = {}) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 18, ...opts })], spacing: { after: 0 } })],
    ...(opts.width ? { width: { size: opts.width, type: WidthType.PERCENTAGE } } : {}),
  });
}
function headerCell(text, width) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, color: "333333" })], spacing: { after: 0 } })],
    ...(width ? { width: { size: width, type: WidthType.PERCENTAGE } } : {}),
    shading: { fill: "FFF5F5" },
    verticalAlign: "center",
  });
}
function row(cells) {
  return new TableRow({ children: cells });
}
function makeTable(headers, data, colWidths) {
  const hRow = row(headers.map((h, i) => headerCell(h, colWidths ? colWidths[i] : undefined)));
  const dRows = data.map(r => row(r.map((c, i) => cell(c, { width: colWidths ? colWidths[i] : undefined }))));
  return new Table({ rows: [hRow, ...dRows], width: { size: 100, type: WidthType.PERCENTAGE } });
}

// ========== DOCUMENT ==========
const doc = new Document({
  title: "生花AI创意平台开发详细设计文档",
  description: "系统架构、模块设计、数据库设计、业务流程、权限体系、前端交互概览",
  creator: "帧游计科技",
  styles: {
    paragraphStyles: [
      { id: "heading1", name: "Heading 1", run: { size: 32, bold: true, color: "E53E3E" }, paragraph: { spacing: { before: 360, after: 200 } } },
      { id: "heading2", name: "Heading 2", run: { size: 26, bold: true, color: "374151" }, paragraph: { spacing: { before: 280, after: 160 } } },
      { id: "heading3", name: "Heading 3", run: { size: 22, bold: true, color: "1F2937" }, paragraph: { spacing: { before: 200, after: 120 } } },
      { id: "heading4", name: "Heading 4", run: { size: 20, bold: true, color: "1F2937" }, paragraph: { spacing: { before: 160, after: 100 } } },
    ]
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {},
      children: [
        emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "生花", size: 64, bold: true, color: "E53E3E", font: "Microsoft YaHei" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "AI 创意平台", size: 44, bold: true, color: "E53E3E", font: "Microsoft YaHei" })] }),
        emptyLine(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "开发详细设计文档", size: 36, color: "374151", font: "Microsoft YaHei" })] }),
        emptyLine(), emptyLine(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "版本：V1.0", size: 22, color: "6B7280" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "日期：2026年7月9日", size: 22, color: "6B7280" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "密级：内部", size: 22, color: "6B7280" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "AI创作生态平台", size: 22, bold: true, color: "E53E3E" })] }),
        emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "© 2026 帧游计科技 · 机密文件 · 仅供内部使用", size: 18, color: "9CA3AF" })] }),
      ]
    },
    // ===== TOC =====
    {
      properties: {},
      children: [
        new Paragraph({ text: "目  录", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }),
        new TableOfContents("目录", { hyperlink: true }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 1: 系统架构设计 =====
    {
      properties: {},
      children: [
        heading("第一章 系统架构设计", 1),
        heading("1.1 系统整体架构", 2),
        para("生花AI创意平台采用分层架构设计，自顶向下分为用户层、应用层、支撑层、数据层，同时对接外部平台。各层职责明确，通过标准API接口进行数据交互。"),
        emptyLine(),
        boldPara("用户层（User Layer）"),
        para("包含四类用户角色：需求方（视频平台/品牌方/IP方/个人需求方）、创作者（内部学员/外部个人/工作室）、故事投稿者、资产上传者。"),
        boldPara("应用层（Application Layer）"),
        para("包含三大核心应用模块：首页（流量分发引擎）、接单大厅（交易撮合引擎）、创作广场（内容生态引擎）；以及三个辅助模块：资产库（数字资产引擎）、培训学院（人才孵化引擎）、人才信息库（人才发现引擎）。"),
        boldPara("支撑层（Support Layer）"),
        para("包含等级体系（L1-L5五级认证）、交易保障（资金托管/仲裁/质控）、信用评价（双向评价+信用分）、消息通知（站内信/短信/推送）。"),
        boldPara("数据层（Data Layer）"),
        para("包含用户中心、项目中心、内容中心、交易中心、培训中心五大数据中心。"),
        boldPara("外部对接（External Integration）"),
        para("对接抖音、红果短剧、快手、爱奇艺、B站/小红书等主流内容平台，实现活动对接和内容分发。"),
        emptyLine(),

        heading("1.2 四大核心引擎", 2),
        makeTable(
          ["引擎", "模块", "核心职能", "飞轮效应"],
          [
            ["供给侧引擎", "培训学院", "培养分级创作者 → 优质供给", "更多培训 → 更多创作者 → 更好供给"],
            ["变现侧引擎", "接单大厅", "撮合交易 → 创作者赚到钱", "更多创作者赚钱 → 吸引更多创作者"],
            ["内容侧引擎", "创作广场", "UGC内容池 → 商家选品采购", "更多UGC → 更多采购 → 激励更多创作"],
            ["资源侧引擎", "资产库", "人脸/素材资产化 → 降本增效", "更多资产 → 降低制作成本 → 更多项目"],
          ]
        ),
        emptyLine(),

        heading("1.3 核心数据流向", 2),
        para("主数据流（培训变现）：培训学院 → 等级认证 → 接单大厅 → 项目交付 → 学费返还。创作者赚到钱 → 口碑传播 → 吸引更多学员 → 培训收入增长 → 飞轮加速。"),
        para("副数据流（内容生态）：UGC创作 → 创作广场 → 版权登记 → 版权交易 → 分润结算。"),
        para("副数据流（资产生态）：资产上传 → 审核入库 → 授权使用 → 使用付费 → 三方分润。"),
        emptyLine(),

        heading("1.4 技术栈选型", 2),
        makeTable(
          ["技术栈", "版本/选型", "用途"],
          [
            ["前端框架", "Next.js / React", "PC端Web应用"],
            ["移动端", "移动端适配（响应式）", "移动端H5应用"],
            ["后端运行时", "Node.js", "API服务端"],
            ["关系数据库", "MySQL 8.0+（InnoDB）", "业务数据存储，utf8mb4字符集"],
            ["缓存数据库", "Redis 7.0+", "会话管理、热点数据缓存、计数"],
            ["对象存储", "阿里云OSS/兼容S3", "文件/图片/视频素材存储"],
            ["搜索引擎", "Elasticsearch", "日志检索与分析"],
            ["部署环境", "CentOS/Ubuntu LTS", "服务器操作系统"],
          ]
        ),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 2: 核心模块功能详细设计 =====
    {
      properties: {},
      children: [
        heading("第二章 核心模块功能详细设计", 1),
        heading("2.1 首页（流量分发引擎）", 2),
        para("首页是平台的流量调度中心，负责将不同类型的用户引导到最适合的功能模块。"),
        makeTable(
          ["区域", "内容", "功能逻辑"],
          [
            ["Hero Banner", "平台Slogan + 核心数据 + CTA按钮", "展示核心数据：注册创作者12,680+、完成项目3,450+、累计交易额¥2,800万、好评率98.5%"],
            ["身份切换器", "头像旁身份标签，点击弹出下拉菜单", "已登录用户可一键切换身份端，导航项和默认页面随之变化"],
            ["四大引擎卡片", "培训/接单/广场/资产", "点击跳转到对应模块页面，hover显示详细描述"],
            ["五级体系展示", "L1-L5等级卡片", "展示每级权益、可接项目类型、佣金比例"],
            ["平台活动专区", "抖音/红果/快手/爱奇艺活动", "展示各平台最新创作活动和奖励"],
            ["热门项目推荐", "最新/最热门项目卡片", "按用户等级展示可投标项目"],
          ]
        ),
        emptyLine(),

        heading("2.2 接单大厅（交易撮合引擎）", 2),
        para("平台核心交易模块，实现需求方与创作者的精准匹配和高效交易。"),
        makeTable(
          ["功能", "说明", "业务规则"],
          [
            ["项目浏览", "卡片式项目列表，展示预算/等级要求/截止日期", "按等级过滤：不同等级创作者看到不同项目池"],
            ["多维筛选", "按类型/等级/预算/紧急程度筛选", "支持组合筛选，实时刷新结果"],
            ["项目详情", "完整项目描述、交付标准、需求方信息", "弹窗展示，包含投标入口"],
            ["投标/接单", "创作者提交投标申请", "需满足等级要求，附带个人简介和作品链接"],
            ["交付管理", "分阶段验收、进度追踪", "按合同约定的里程碑节点验收"],
            ["结算分账", "验收通过后自动释放资金", "扣除平台佣金后，创作者收到净额"],
          ]
        ),
        emptyLine(),
        boldPara("等级匹配机制"),
        para("L1新星：可见预算 ≤ ¥2,000 的入门项目；L2新锐：可见预算 ≤ ¥5,000 的标准项目；L3精英：可见预算 ≤ ¥15,000 的中型项目；L4资深：可见预算 ≤ ¥50,000 的大型项目；L5大师：可见全部项目。"),
        emptyLine(),

        heading("2.3 创作广场（内容生态引擎）", 2),
        para("UGC内容池，让创作者自由发布作品，吸引内容采购方（MCN/发行方）选品采购版权。"),
        makeTable(
          ["功能", "说明", "业务规则"],
          [
            ["作品展示", "瀑布流/网格布局，展示作品封面、创作者、浏览/点赞数据", "按推荐/最新/热门/潜力排序"],
            ["作品投稿", "创作者上传故事/剧本/样片/完整漫剧", "支持多种类型：故事投稿、漫剧样片、完整剧本"],
            ["版权登记", "区块链版权确权", "投稿即自动登记，生成唯一版权凭证"],
            ["版权采购", "采购方在线选购作品版权", "支持议价，平台提供版权转让协议模板"],
            ["互动社交", "浏览、点赞、评论、收藏、分享", "增加作品曝光，提升创作者影响力"],
          ]
        ),
        emptyLine(),

        heading("2.4 资产库（数字资产引擎）", 2),
        para("数字资产交易平台，将人脸、角色、场景等创作素材资产化，实现持续分润。"),
        makeTable(
          ["品类", "说明", "典型资产"],
          [
            ["角色形象", "完整角色立绘/模型", "古风美女全身立绘、赛博朋克角色包"],
            ["人脸模型", "可用于AI换脸的人脸数据", "真人授权人脸、虚拟人脸模型"],
            ["场景环境", "背景场景素材", "唐风宫殿、赛博城市、海景环境"],
            ["道具武器", "道具/武器/载具等", "冷兵器3D模型包、未来载具"],
            ["动作预设", "角色动作模板", "舞蹈动作预设包、打斗动作库"],
            ["音效配乐", "BGM/音效/配音", "古风BGM套装、环境音效库"],
            ["特效预设", "视觉特效模板", "仙侠法术特效、粒子效果包"],
            ["风格预设", "画风/滤镜/调色", "水彩风格滤镜、胶片质感预设"],
          ]
        ),
        emptyLine(),
        boldPara("资产分润规则"),
        para("上传者获得60%-80%（根据独家/非独家）；平台收取15%-30%；推荐人获得5%-10%（如有）。每次使用按设定单价扣费，月度结算。"),
        emptyLine(),

        heading("2.5 培训学院（人才孵化引擎）", 2),
        para("平台供给侧核心引擎，通过付费培训培养分级创作者，线下课程包含就业接单指导。"),
        makeTable(
          ["维度", "线上·自学基础班", "线下·VIP实战班", "线下·VIP大师班"],
          [
            ["价格", "¥1,980 - ¥39,800", "¥3,980 - ¥12,800", "¥39,800 - ¥79,800"],
            ["课时", "20课时", "60课时", "120课时"],
            ["形式", "录播视频+社群答疑", "线下集训+导师1对1", "封闭集训+项目孵化"],
            ["内容", "AI绘画基础+Seedance+分镜基础", "高级运镜+叙事+商业实战", "IP策划+团队管理+全流程品控"],
            ["认证", "L1新星", "L2-L3", "L4-L5"],
            ["就业服务", "纯学习不含就业", "接单指导+学费返还", "VIP资源+签约+高薪直推"],
          ]
        ),
        emptyLine(),

        heading("2.6 等级体系（信用评价引擎）", 2),
        makeTable(
          ["等级", "名称", "可接项目", "佣金比例", "核心权益"],
          [
            ["L1", "新星", "入门项目（≤¥2,000）", "15%", "新手保护期、基础接单"],
            ["L2", "新锐", "标准项目（≤¥5,000）", "12%", "更多项目可见、基础推荐"],
            ["L3", "精英", "中型项目（≤¥15,000）", "10%", "品牌合作优先、团队功能"],
            ["L4", "资深", "大型项目（≤¥50,000）", "8%", "高薪项目优先、专属顾问"],
            ["L5", "大师", "全部项目（无上限）", "5%", "平台签约、独家项目、VIP资源"],
          ]
        ),
        emptyLine(),
        boldPara("升降级规则"),
        para("升级条件：完成指定数量项目+平均评分≥4.5星+通过对应等级考核+无重大违规记录。降级规则：连续3个月无活跃接单记录或平均评分降至3.5星以下或收到3次以上投诉或交付质量严重不达标。评级周期：每月1日系统自动结算。"),
        emptyLine(),

        heading("2.7 社区（用户运营引擎）", 2),
        para("创作者交流社区，促进经验分享、技术讨论、互助成长。共设8大板块：经验分享、作品互评、技术讨论、行业资讯、接单心得、学习打卡、问答求助、组队招募。"),
        para("核心功能：发帖（选择板块→填写标题/正文→上传图片→添加标签）、互动（点赞/评论/收藏/分享）、热榜（综合浏览量/互动量/时效性计算）、活跃达人展示。"),
        emptyLine(),

        heading("2.8 需求方服务", 2),
        para("合作流程：发布项目 → 筛选创作者 → 托管资金 → 过程管理 → 验收结算。"),
        para("发单表单字段：项目名称、项目类型（系列漫剧/品牌定制/单集短片/IP改编）、预算范围（¥500-2K / ¥2K-5K / ¥5K-15K / ¥15K-50K / ¥50K+）、等级要求、项目描述。"),
        para("交易保障：资金托管（平台托管账户，验收后释放）、争议仲裁（48小时内裁决）、质量管控（分阶段验收）、信用评价（双向评价）。"),
        emptyLine(),

        heading("2.9 创作者中心", 2),
        para("创作者的个人工作台，包含以下模块：数据总览（本月收入/进行中项目/待投标项目/资产收益）、我的订单（进行中/已完成/已取消）、作品集、等级成长、收益明细、我的资产、培训记录、账号设置。"),
        para("学费返还进度：仅线下VIP课程享有学费返还权益。每笔接单收入自动扣除20%-30%用于返还学费，累计返还金额不超过课程学费总额。"),
        emptyLine(),

        heading("2.10 平台活动专区", 2),
        para("聚合抖音、红果、快手、爱奇艺等主流平台的创作活动和激励计划。已对接平台：抖音（创作激励/大赛）、红果短剧（分账合作）、快手（星芒计划）、爱奇艺（云腾计划）。待开放：优酷、腾讯视频、微信视频号、B站、小红书。"),
        emptyLine(),

        heading("2.11 人才信息库（人才发现引擎）", 2),
        para("建立专业人才分类信息库，汇聚AI行业从业者与大学生。7大专业角色覆盖AI漫剧完整制作流程：导演、制作人、编剧、生成师、后期剪辑、美术、分镜师。"),
        para("核心策略：先建库，后交易。前期吸引AI行业从业者+大学生提交作品审核，建立专业人才信息库；后期在信息库基础上撮合项目、对接需求方。"),
        para("人才库不设单独的登记入口，用户通过「成为创作者」→「我是老手」提交作品集，平台审核通过后直接进入人才库并获得等级，开通接单权限。审核不通过则无法入库。"),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 3: 数据库表结构设计 =====
    {
      properties: {},
      children: [
        heading("第三章 数据库表结构设计", 1),
        heading("3.1 命名规范", 2),
        para("表名：小写字母+下划线，如 user、creator_profile。字段名：小写字母+下划线，如 user_id、created_at。主键：统一使用 id（BIGINT自增）。外键：字段名以 _id 结尾。索引：idx_ 前缀，唯一索引 uk_ 前缀。时间字段：统一使用 datetime。软删除：统一使用 is_deleted（tinyint）。"),
        emptyLine(),

        heading("3.2 用户中心域", 2),
        boldPara("1. 用户表（user）"),
        makeTable(
          ["字段名", "类型", "主键", "非空", "说明"],
          [
            ["id", "BIGINT(20)", "PK", "Y", "用户唯一标识，自增主键"],
            ["phone", "VARCHAR(20)", "", "Y", "手机号，登录账号，唯一"],
            ["email", "VARCHAR(100)", "", "N", "邮箱地址"],
            ["password_hash", "VARCHAR(255)", "", "Y", "密码哈希值（bcrypt）"],
            ["nickname", "VARCHAR(50)", "", "N", "用户昵称"],
            ["avatar_url", "VARCHAR(500)", "", "N", "头像URL"],
            ["status", "TINYINT(4)", "", "Y", "状态：0=禁用 1=正常 2=冻结"],
            ["last_login_at", "DATETIME", "", "N", "最后登录时间"],
            ["is_deleted", "TINYINT(1)", "", "Y", "软删除标记"],
            ["created_at", "DATETIME", "", "Y", "创建时间"],
            ["updated_at", "DATETIME", "", "Y", "更新时间"],
          ]
        ),
        para("索引：uk_phone（唯一），idx_status，idx_nickname"),
        emptyLine(),

        boldPara("2. 用户身份表（user_identity）"),
        makeTable(
          ["字段名", "类型", "主键", "非空", "说明"],
          [
            ["id", "BIGINT(20)", "PK", "Y", "自增主键"],
            ["user_id", "BIGINT(20)", "FK", "Y", "用户ID，关联user.id"],
            ["identity_type", "VARCHAR(20)", "", "Y", "身份类型：creator/client"],
            ["is_active", "TINYINT(1)", "", "Y", "当前选中身份"],
            ["profile_completed", "TINYINT(1)", "", "Y", "资料是否完善"],
            ["created_at", "DATETIME", "", "Y", "创建时间"],
            ["updated_at", "DATETIME", "", "Y", "更新时间"],
          ]
        ),
        para("索引：uk_user_identity（唯一，user_id + identity_type），idx_user_active"),
        emptyLine(),

        boldPara("3. 用户认证表（user_auth）"),
        makeTable(
          ["字段名", "类型", "主键", "非空", "说明"],
          [
            ["id", "BIGINT(20)", "PK", "Y", "自增主键"],
            ["user_id", "BIGINT(20)", "FK", "Y", "用户ID，关联user.id"],
            ["real_name", "VARCHAR(50)", "", "N", "真实姓名"],
            ["id_card", "VARCHAR(18)", "", "N", "身份证号"],
            ["auth_status", "TINYINT(4)", "", "Y", "0=未认证 1=审核中 2=已认证 3=失败"],
            ["auth_type", "VARCHAR(20)", "", "N", "认证类型：real_name/company"],
            ["auth_time", "DATETIME", "", "N", "认证通过时间"],
            ["created_at", "DATETIME", "", "Y", "创建时间"],
            ["updated_at", "DATETIME", "", "Y", "更新时间"],
          ]
        ),
        para("索引：uk_user_auth（唯一，user_id），idx_auth_status"),
        emptyLine(),

        heading("3.3 创作者体系域", 2),
        boldPara("4. 创作者档案表（creator_profile）"),
        para("字段：id, user_id(FK), professional_role_id(FK), level_code, gender, city, experience_years, is_student, is_studio, bio, skills(JSON), representative_works, total_projects, total_income, avg_rating, is_verified, entry_path, is_deleted, created_at, updated_at。"),
        para("索引：uk_creator_user（唯一，user_id），idx_level，idx_role，idx_city，idx_verified"),
        emptyLine(),

        boldPara("5. 创作者等级表（creator_level）"),
        para("预置L1-L5五级数据。字段：id, level_code(唯一), level_name, min_projects, min_rating, budget_limit, commission_rate, commission_rate_pro, commission_rate_elite, min_commission, monthly_order_limit, settlement_cycle, free_commission_orders, permissions(JSON), sort_order, is_active, created_at。"),
        emptyLine(),

        boldPara("6. 创作者等级变更记录表（creator_level_log）"),
        para("字段：id, user_id(FK), old_level, new_level, change_type(upgrade/downgrade/initial), reason, operator_id, created_at。"),
        emptyLine(),

        boldPara("7. 专业角色表（professional_role）"),
        para("7大角色+细分方向。字段：id, role_code(唯一), role_name, parent_id(FK), sort_order, is_active, created_at。"),
        emptyLine(),

        boldPara("8. 创作者审核记录表（creator_review）"),
        para("字段：id, user_id(FK), review_type(entry/level_up/appeal), status(0=待审核 1=通过 2=不通过), quality_score, tech_score, experience_score, sustainability_score, total_score, assigned_level, review_comment, reviewer_id, reviewed_at, created_at。"),
        emptyLine(),

        heading("3.4 人才信息库域", 2),
        boldPara("9. 人才信息表（talent_info）"),
        para("字段：id, user_id(FK), professional_role_id(FK), display_name, gender, city, experience, is_student, is_studio, level_code, is_verified, is_available, skills(JSON), representative_works, stats_summary, is_in_talent_pool, is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("10. 人才作品集表（talent_portfolio）"),
        para("字段：id, talent_id(FK), title, description, file_url, file_type(video/image/pdf), sort_order, is_deleted, created_at, updated_at。"),
        emptyLine(),

        heading("3.5 项目交易域", 2),
        boldPara("11. 项目表（project）"),
        para("字段：id, client_id(FK), title, project_type(series/brand/single/ip), budget_min, budget_max, level_required, description, episode_count, duration_days, status(pending/open/in_progress/completed/cancelled/disputed), is_urgent, is_featured, is_sticky, deadline, bid_count, view_count, tags(JSON), is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("12. 投标表（project_bid）"),
        para("字段：id, project_id(FK), creator_id(FK), bid_amount, bid_message, status(pending/accepted/rejected/withdrawn), is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("13. 订单表（order）"),
        para("字段：id, order_no(唯一), project_id(FK), client_id(FK), creator_id(FK), bid_id(FK), total_amount, commission_rate, commission_amount, creator_amount, escrow_amount, status(pending/escrowed/in_progress/delivered/reviewing/completed/cancelled/disputed), milestone_count, completed_milestones, is_free_commission, completed_at, is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("14. 订单里程碑表（order_milestone）"),
        para("字段：id, order_id(FK), milestone_name, sort_order, amount, status(pending/submitted/approved/rejected), delivery_note, delivery_url, approved_at, created_at, updated_at。"),
        emptyLine(),

        heading("3.6 内容创作域（创作广场）", 2),
        boldPara("15. 作品表（work）"),
        para("字段：id, creator_id(FK), title, work_type(story/sample/script/comic), description, cover_url, file_url, price, status(draft/published/sold), copyright_id(区块链版权登记ID), is_hot, is_new, view_count, like_count, comment_count, tags(JSON), is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("16. 版权交易表（copyright_transaction）"),
        para("字段：id, work_id(FK), buyer_id(FK), seller_id(FK), amount, commission_rate, commission_amount, platform_share, seller_share, status(pending/negotiating/completed/cancelled), contract_url, completed_at, is_deleted, created_at, updated_at。"),
        emptyLine(),

        heading("3.7 数字资产域", 2),
        boldPara("17. 资产分类表（asset_category）"),
        para("8大品类预置数据。字段：id, category_code(唯一), category_name, icon, sort_order, is_active, created_at。"),
        emptyLine(),

        boldPara("18. 资产表（asset）"),
        para("字段：id, uploader_id(FK), category_id(FK), title, description, thumbnail_url, file_url, price, is_exclusive, status(pending/approved/rejected/offline), review_comment, usage_count, is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("19. 资产使用记录表（asset_usage）"),
        para("字段：id, asset_id(FK), user_id(FK), project_id(FK), fee, uploader_share, platform_share, referrer_share, referrer_id, settlement_status(0=未结算 1=已结算), created_at。"),
        emptyLine(),

        heading("3.8 培训学院域", 2),
        boldPara("20. 课程表（course）"),
        para("字段：id, title, course_type(online/offline_vip/offline_master), price, price_max, hours, format, content, certification, has_refund, sort_order, is_active, is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("21. 课程报名表（course_enrollment）"),
        para("字段：id, user_id(FK), course_id(FK), status(pending/learning/graduated/dropped), progress, assigned_level, total_refund, refund_rate, is_deleted, created_at, updated_at。"),
        emptyLine(),

        heading("3.9 社区域", 2),
        boldPara("22. 社区帖子表（community_post）"),
        para("字段：id, user_id(FK), board, title, content, images(JSON), tags(JSON), view_count, like_count, comment_count, is_essence, is_deleted, created_at, updated_at。"),
        emptyLine(),

        heading("3.10 交易财务域", 2),
        boldPara("23. 交易流水表（transaction）"),
        para("字段：id, tx_no(唯一), user_id(FK), tx_type, amount, balance_before, balance_after, status(pending/success/failed), reference_id, reference_type, remark, created_at。"),
        emptyLine(),

        boldPara("24. 会员订阅表（membership）"),
        para("字段：id, user_id(FK), plan_code, user_type, status(active/inactive/cancelled), price, monthly_threshold(先享后付阈值), charged_month, expire_at, created_at, updated_at。"),
        emptyLine(),

        heading("3.11 评价体系域", 2),
        boldPara("25. 评价表（review）"),
        para("字段：id, order_id(FK), from_id(FK), to_id(FK), rating(1-5), content, review_type(client_to_creator/creator_to_client), is_deleted, created_at。"),
        emptyLine(),

        heading("3.12 平台运营域", 2),
        boldPara("26. 平台活动表（platform_activity）"),
        para("字段：id, platform, activity_name, reward, cooperation_type, start_time, end_time, status(0=未开始 1=进行中 2=已结束), is_deleted, created_at, updated_at。"),
        emptyLine(),

        boldPara("27. 系统配置表（system_config）"),
        para("字段：id, config_key(唯一), config_value, description, created_at, updated_at。"),
        emptyLine(),

        heading("3.13 Redis缓存设计", 2),
        makeTable(
          ["Key模式", "Value类型", "说明", "过期时间"],
          [
            ["session:{token}", "JSON", "用户登录会话", "7天"],
            ["user:{id}:profile", "JSON", "用户基本信息缓存", "1小时"],
            ["project:hot", "SortedSet", "热门项目排行", "10分钟"],
            ["talent:role:{role}", "JSON", "人才库按角色缓存", "30分钟"],
            ["counter:project:{id}:view", "Int", "项目浏览计数", "持久"],
            ["counter:work:{id}:like", "Int", "作品点赞计数", "持久"],
            ["rate:commission", "JSON", "佣金比例配置缓存", "1天"],
            ["sms:code:{phone}", "String", "短信验证码", "5分钟"],
          ]
        ),
        emptyLine(),

        heading("3.14 外键关系汇总", 2),
        para("user_identity.user_id -> user.id；user_auth.user_id -> user.id；creator_profile.user_id -> user.id；creator_profile.professional_role_id -> professional_role.id；talent_info.user_id -> user.id；project.client_id -> user.id；project_bid.project_id -> project.id；project_bid.creator_id -> user.id；order.project_id -> project.id；order.client_id/creator_id -> user.id；order_milestone.order_id -> order.id；work.creator_id -> user.id；asset.uploader_id -> user.id；asset.category_id -> asset_category.id；asset_usage.asset_id -> asset.id；course_enrollment.user_id -> user.id；course_enrollment.course_id -> course.id；review.order_id -> order.id；review.from_id/to_id -> user.id；membership.user_id -> user.id。"),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 4: 数据库对象设计 =====
    {
      properties: {},
      children: [
        heading("第四章 数据库对象设计", 1),
        heading("4.1 视图设计", 2),
        para("v_creator_dashboard：创作者工作台视图，关联creator_profile + order + review，用于展示创作者核心数据指标。"),
        para("v_talent_search：人才搜索视图，关联talent_info + professional_role + creator_level，支持按角色/等级/城市多维度搜索。"),
        para("v_project_detail：项目详情视图，关联project + user + project_bid，展示项目完整信息。"),
        para("v_monthly_settlement：月度结算视图，关联order + transaction + membership，用于月度财务核算。"),
        emptyLine(),

        heading("4.2 存储过程设计", 2),
        para("sp_calculate_commission：根据订单金额、创作者等级、会员身份计算实际佣金和各方分润。"),
        para("sp_monthly_membership_charge：月度会员费核算，按'先享后付'规则判断是否扣费。"),
        para("sp_auto_level_upgrade：每月1日自动扫描创作者等级变更，满足条件的自动升级/降级。"),
        para("sp_tuition_refund：订单完成后自动触发学费返还计算。"),
        emptyLine(),

        heading("4.3 触发器设计", 2),
        para("trg_order_completed：订单完成后自动创建transaction流水、更新creator_profile统计数据。"),
        para("trg_bid_accepted：投标中标后自动更新project状态为in_progress，拒绝其他投标。"),
        para("trg_asset_used：资产使用后自动递增asset.usage_count，计算uploader_share。"),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 5: 关键业务流程 =====
    {
      properties: {},
      children: [
        heading("第五章 关键业务流程", 1),
        heading("5.1 创作者入驻流程（双通道）", 2),
        boldPara("通道一：培训定级（零基础新手）"),
        para("点击「成为创作者」→ 选择「我是新手」→ 进入培训学院 → 选择课程（线上/线下）→ 在线付费 → 开始学习 → 阶段考核 → 获得认证 → 自动定级 → 进入人才库 → 开通接单 → 学费返还。"),
        emptyLine(),
        boldPara("通道二：作品定级（有经验的老手）"),
        para("点击「成为创作者」→ 选择「我是老手」→ 填写信息+上传作品（≥2个）→ 平台审核定级（1-3工作日）→ 审核通过→进入人才库+定级+接单。审核不通过→不入库，可补充作品后重新提交。"),
        para("审核维度：作品质量40% · 技术能力25% · 项目经验20% · 持续能力15%"),
        emptyLine(),

        heading("5.2 项目交易全流程", 2),
        para("需求方发布项目 → 需求方托管资金 → 系统按等级推送 → 创作者投标 → 需求方选标 → 分阶段交付 → 验收通过 → 释放资金。争议处理路径：争议 → 平台仲裁 → 裁决执行。"),
        emptyLine(),

        heading("5.3 培训→接单闭环（培训变现飞轮）", 2),
        para("报名课程 → 在线学习 → 阶段考核 → 获得等级 → 接单大厅 → 完成项目 → 学费返还。闭环效应：创作者赚到钱 → 口碑传播 → 吸引更多学员 → 培训收入增长 → 飞轮加速。"),
        emptyLine(),

        heading("5.4 版权交易流程", 2),
        para("创作者投稿 → 区块链确权 → 广场展示 → 采购方选中 → 议价签约 → 版权转让+分润。版权交易佣金8%（会员6%）。"),
        emptyLine(),

        heading("5.5 佣金计算流程", 2),
        para("实际佣金 = 项目金额 × (等级佣金率 - 会员减免率)，最低1%。"),
        para("示例：L3创作者标准佣金7%，购买Pro会员减免2%，实际佣金5%。L5创作者标准佣金3%，购买Elite会员减免3%，实际佣金1%（触达下限）。"),
        para("L1新手保护期：前5单免佣金，并赠送30天Pro会员免费体验。"),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 6: 用户角色与权限体系 =====
    {
      properties: {},
      children: [
        heading("第六章 用户角色与权限体系", 1),
        heading("6.1 需求方角色分类", 2),
        makeTable(
          ["角色", "画像", "核心诉求", "典型场景"],
          [
            ["视频平台", "爱奇艺/快手/红果等", "稳定供给、质量可控、分账合作", "发项目→选创作者→批量交付→分账"],
            ["品牌方/IP方", "品牌定制漫剧、IP改编授权方", "高品质定制、品牌调性匹配", "发品牌定制→选精英级→审核交付"],
            ["个人需求方", "自媒体人、小说作者、创业者", "低预算也能做漫剧", "发小体量项目→选新锐级→快速交付"],
            ["内容采购方", "MCN/发行方", "找到有潜力的故事/漫剧成品", "浏览广场→选中作品→采购版权"],
          ]
        ),
        emptyLine(),

        heading("6.2 供给侧角色分类", 2),
        makeTable(
          ["角色", "画像", "核心诉求", "典型场景"],
          [
            ["内部学员创作者", "平台培训成长", "学有所成、稳定接单、学费返还", "培训→考核→获等级→接单→学费返还"],
            ["外部个人创作者", "已有AI漫剧能力", "更多商单、等级认证背书", "提交作品→审核定级→接单→升级"],
            ["外部工作室/公司", "AI漫剧制作团队", "批量接单、团队管理", "公司认证→团队定级→批量承接项目"],
            ["故事投稿者", "普通人好故事不会制作", "故事被选中、获得版权收益", "投稿→生成剧本/样片→被选中→获版权费"],
            ["资产上传者", "演员/模特/设计师", "人脸/素材资产化、被动收入", "上传→审核入库→被使用→获使用费"],
          ]
        ),
        emptyLine(),

        heading("6.3 权限矩阵", 2),
        makeTable(
          ["功能模块", "游客", "需求方", "L1新星", "L2新锐", "L3精英", "L4资深", "L5大师"],
          [
            ["浏览首页/广场/社区", "✓", "✓", "✓", "✓", "✓", "✓", "✓"],
            ["发布项目", "—", "✓", "—", "—", "—", "—", "—"],
            ["投标接单", "—", "—", "L1+项目", "L2+项目", "L3+项目", "L4+项目", "全部项目"],
            ["上传作品到广场", "—", "—", "✓", "✓", "✓", "✓", "✓"],
            ["版权交易", "—", "✓", "✓", "✓", "✓", "✓", "✓"],
            ["上传资产", "—", "—", "✓", "✓", "✓", "✓", "✓"],
            ["社区发帖", "—", "✓", "✓", "✓", "✓", "✓", "✓"],
            ["报名培训", "—", "—", "✓", "✓", "✓", "✓", "✓"],
            ["平台签约", "—", "—", "—", "—", "—", "可申请", "自动"],
            ["团队管理", "—", "—", "—", "—", "✓", "✓", "✓"],
          ]
        ),
        emptyLine(),

        heading("6.4 双端身份体系设计", 2),
        para("设计理念：参照Boss直聘的招人版与求职版切换逻辑，用户注册/登录时不绑定身份角色，注册后通过导航栏的切换按钮在「需求方」和「创作者」之间自由切换。"),
        boldPara("核心设计原则"),
        para("① 一个账号，双重身份，无需注册两个账号。② 场景隔离，功能聚焦。③ 一键切换，无缝衔接。"),
        makeTable(
          ["维度", "需求方", "创作者"],
          [
            ["身份定位", "有AI漫剧制作需求的一方", "提供AI漫剧制作服务的一方"],
            ["核心动作", "提需求：发布项目、筛选创作者、托管资金、验收交付", "成为创作者：提交作品审核、进入人才库、接单赚钱"],
            ["导航可见项", "发项目、人才库、创作广场、资产库、社区", "接单大厅、创作者中心、培训学院、人才库、社区"],
            ["首页CTA", "「我是需求方·发布项目」", "「成为创作者·接单赚钱」"],
          ]
        ),
        emptyLine(),

        heading("6.5 创作者评级体系", 2),
        boldPara("双入口设计"),
        makeTable(
          ["评级路径", "适用人群", "初始等级"],
          [
            ["入口一：培训定级", "零基础新手、转行从业者", "通常L1-L2"],
            ["入口二：作品定级", "已有AI漫剧经验的从业者", "根据作品质量L1-L4"],
          ]
        ),
        emptyLine(),
        boldPara("动态升级机制"),
        para("升级维度：接单完成量（40%）+ 用户反馈评分（35%）+ 作品质量提升（15%）+ 社区活跃度（10%）。升级条件：综合评分达到上一级标准 + 最近10个项目平均评分≥4.0。降级条件：连续3个项目评分低于3.5，或30天无接单活动。评级周期：每月1日系统自动结算。"),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 7: 前端页面与交互概览 =====
    {
      properties: {},
      children: [
        heading("第七章 前端页面与交互概览", 1),
        heading("7.1 PC端导航与身份切换", 2),
        para("顶部导航栏包含品牌Logo、导航链接（根据身份动态显示）、身份切换器、登录/注册按钮。导航链接分三类：common（双方可见：首页、创作广场、人才库、资产库、等级体系、社区）、creator（创作者可见：接单大厅、培训学院、创作者中心）、client（需求方可见：发项目）。"),
        para("身份切换器位于导航栏右侧，用户头像旁设身份标签（如「创作者」），点击后弹出下拉菜单选择切换，导航项和默认页面平滑过渡。默认登录后进入创作者身份。"),
        emptyLine(),

        heading("7.2 移动端Tab导航与页面结构", 2),
        para("移动端采用底部Tab Bar导航，包含5个主Tab：首页、接单/发项目（根据身份切换）、广场、社区、我的。Tab Bar上的第二个Tab会根据当前身份动态切换：创作者身份显示「接单」，需求方身份显示「发项目」。"),
        para("还有6个子页面通过跳转导航访问：资产库、培训学院、等级体系、平台活动、需求方服务、人才库。"),
        emptyLine(),

        heading("7.3 关键页面交互说明", 2),
        boldPara("首页"),
        para("Banner区域展示Slogan和核心数据（12,680+创作者、3,450+完成项目、¥2,800万交易额）。快速操作入口含8个快捷按钮：接单大厅、创作广场、资产库、培训学院、等级体系、平台活动、社区、人才库。热门项目和广场精选横向滚动展示。"),
        emptyLine(),
        boldPara("接单大厅"),
        para("顶部筛选器支持按类型/等级/紧急程度筛选，带数字计数。项目卡片包含预算标签（毛玻璃效果）、等级要求、截止日期、统计栏（集数/工期/评分）、需求方信息。PC端3列网格，移动端单列列表。"),
        emptyLine(),
        boldPara("创作广场"),
        para("顶部胶囊式标签切换（推荐/最新/热门/潜力）。PC端4列网格布局，移动端2列瀑布流。作品卡片包含状态标签（🔥热门/✓已售/🆕新作/⭐新人佳作）、统计数据、价格标签。"),
        emptyLine(),
        boldPara("人才库"),
        para("PC端左侧边栏7大角色分类+6个细分方向，右侧人才卡片网格展示。移动端顶部角色芯片横滑切换，2列网格展示。辅助筛选：已认证/有作品/可接单/大学生/工作室。空状态显示引导加入。"),
        emptyLine(),
        boldPara("创作者中心（个人主页）"),
        para("移动端个人主页展示头像、姓名、等级、统计数据（47项目/4.8评分/¥18.6万收入）。本月收入卡片含趋势柱状图。学费返还进度条展示。菜单分组：订单管理、作品集、资产、收益明细、等级成长、培训记录、评价、通知、设置。"),
        emptyLine(),

        heading("7.4 响应式设计规范", 2),
        para("PC端：最大宽度1200px居中布局。1024px以下：引擎网格2列，项目网格2列，创作广场3列，等级卡片3列。768px以下：导航链接隐藏，引擎网格1列，项目网格1列，创作广场2列，等级卡片2列，创作者工作台1列。Hero区域标题从52px缩小至28px。"),
        emptyLine(),

        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ===== CHAPTER 8: 平台收费体系 =====
    {
      properties: {},
      children: [
        heading("第八章 平台收费体系", 1),
        heading("8.1 优化后收费规则总览", 2),
        makeTable(
          ["收费场景", "收费方式", "收费对象", "比例/金额", "会员优惠"],
          [
            ["项目交易完成", "交易佣金", "创作者", "L1:10% / L2:8% / L3:7% / L4:5% / L5:3%", "Pro-2% / Elite-3%，下限1%"],
            ["资产授权使用", "分成", "上传者", "平台15-30% / 上传者60-80%", "Elite/Enterprise-3%"],
            ["版权交易", "佣金", "采购方", "8%", "Business/Enterprise 6%"],
            ["培训报名", "直销", "学员", "线上¥1,980-39,800 / 线下¥3,980-79,800", "—"],
            ["增值服务-置顶", "按次", "需求方", "¥200/次（7天）", "Business 2次/月免费"],
            ["增值服务-推荐", "按周", "需求方", "¥500/周", "Enterprise 1次/月免费"],
            ["增值服务-作品置顶", "按次", "创作者", "¥100/次（7天）", "Pro 1次/月免费"],
            ["提现手续费", "比例", "创作者", "1%（最低¥1/笔）", "L1-L2/Elite/Enterprise免"],
          ]
        ),
        emptyLine(),

        heading("8.2 佣金与等级关联表（优化后）", 2),
        makeTable(
          ["等级", "标准佣金", "+Pro会员", "+Elite会员", "最低佣金", "结算周期"],
          [
            ["L1新星", "10%", "8%", "7%", "7%", "T+7"],
            ["L2新锐", "8%", "6%", "5%", "5%", "T+5"],
            ["L3精英", "7%", "5%", "4%", "4%", "T+3"],
            ["L4资深", "5%", "3%", "2%", "2%", "T+1"],
            ["L5大师", "3%", "1%", "1%", "1%", "即时"],
          ]
        ),
        para("L1新手保护期：前5单免佣金（原3单），并赠送30天Pro会员免费体验。"),
        emptyLine(),

        heading("8.3 先享后付机制", 2),
        para("参照影视分账平台'扶持期让利'策略，会员费采用先享后付计费："),
        para("Pro创作者（¥98/月）：当月接单收入 ≥ ¥3,000 时扣费，低于则免费。"),
        para("Elite创作者（¥298/月）：当月接单收入 ≥ ¥8,000 时扣费，低于则免费。"),
        para("Business（¥128/月）：当月项目支出 ≥ ¥5,000 时扣费，低于则免费。"),
        para("Enterprise（¥398/月）：当月项目支出 ≥ ¥20,000 时扣费，低于则免费。"),
        para("优势：消除'入不敷出'顾虑，降低新手尝试成本，平台与创作者利益绑定。"),
        emptyLine(),

        heading("8.4 会员权益对比", 2),
        boldPara("创作者端"),
        makeTable(
          ["权益", "免费版", "Pro ¥98/月", "Elite ¥298/月"],
          [
            ["佣金比例", "标准（10%-3%）", "标准-2%", "标准-3%（下限1%）"],
            ["作品置顶", "—", "1次/月", "3次/月"],
            ["项目优先匹配", "—", "✓", "优先"],
            ["数据分析面板", "基础", "高级", "专业"],
            ["独家项目入口", "—", "—", "✓"],
            ["专属顾问", "—", "—", "✓"],
            ["提现手续费", "L1-L2免费/L3+1%", "1%", "免"],
            ["结算加速", "标准", "标准", "T+1"],
          ]
        ),
        emptyLine(),
        boldPara("需求方端"),
        makeTable(
          ["权益", "免费版", "Business ¥128/月", "Enterprise ¥398/月"],
          [
            ["项目发布数", "3个/月", "不限", "不限"],
            ["项目置顶", "—", "2次/月", "5次/月"],
            ["精选推荐位", "—", "—", "1次/月"],
            ["版权交易佣金", "8%", "6%", "6%"],
            ["创作者筛选", "基础", "高级+优先", "精准+定向"],
            ["专属客户经理", "—", "—", "✓"],
            ["批量项目管理", "—", "—", "✓"],
          ]
        ),
        emptyLine(),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 200 }, children: [new TextRun({ text: "— 文档结束 —", size: 24, color: "9CA3AF", italics: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "生花AI创意平台 · 开发详细设计文档 V1.0", size: 18, color: "9CA3AF" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "© 2026 帧游计科技 · 机密文件 · 仅供内部使用", size: 18, color: "9CA3AF" })] }),
      ]
    },
  ]
});

// ========== GENERATE ==========
const OUTPUT_PATH = "e:\\AI视频\\生花\\生花平台开发详细设计文档.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log("✅ 文档生成成功！");
  console.log("📄 输出路径: " + OUTPUT_PATH);
  console.log("📦 文件大小: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch(err => {
  console.error("❌ 生成失败:", err);
  process.exit(1);
});