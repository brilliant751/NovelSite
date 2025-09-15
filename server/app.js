const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

// 管理员账号信息
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};

// 存储登录会话（实际项目中应使用数据库或Redis）
let activeSessions = new Map();

// 模拟数据
let novels = [
  {
    id: 1,
    title: "天龙八部",
    author: "金庸",
    category: "武侠",
    description: "北宋年间，外族纷纷觊觎大宋国土，形成汉、胡对立的局面。丐帮帮主乔峰因拒绝副帮主妻子康敏之爱遭报复陷害，被指为契丹人而众叛亲离。",
    cover: "https://via.placeholder.com/200x280/4CAF50/white?text=天龙八部",
    readCount: 125000,
    isCompleted: true,
    isFavorited: false
  },
  {
    id: 2,
    title: "射雕英雄传",
    author: "金庸",
    category: "武侠",
    description: "南宋偏安，金国入侵，蒙古崛起，国仇家恨，恩怨情仇，众多的历史事件和历史人物巧妙地融合在一起。",
    cover: "https://via.placeholder.com/200x280/FF9800/white?text=射雕英雄传",
    readCount: 98000,
    isCompleted: true,
    isFavorited: false
  },
  {
    id: 3,
    title: "神雕侠侣",
    author: "金庸",
    category: "武侠",
    description: "南宋末年，江南少年杨过得到绝世武功传授，也得到了一生的真爱，在经历了一番坎坷后，最终成为一代神雕大侠。",
    cover: "https://via.placeholder.com/200x280/2196F3/white?text=神雕侠侣",
    readCount: 87000,
    isCompleted: true,
    isFavorited: false
  },
  {
    id: 4,
    title: "斗破苍穹",
    author: "天蚕土豆",
    category: "玄幻",
    description: "少年萧炎，天赋异禀，却因家族变故而落魄。他凭借强大的意志与不屈的精神，在斗气大陆上逆袭崛起，成就斗帝传奇。",
    cover: "https://via.placeholder.com/200x280/E91E63/white?text=斗破苍穹",
    readCount: 156000,
    isCompleted: true,
    isFavorited: false
  },
  {
    id: 5,
    title: "完美世界",
    author: "辰东",
    category: "玄幻",
    description: "一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。群雄并起，万族林立，诸圣争霸，乱天动地。",
    cover: "https://via.placeholder.com/200x280/9C27B0/white?text=完美世界",
    readCount: 143000,
    isCompleted: false,
    isFavorited: false
  },
  {
    id: 6,
    title: "遮天",
    author: "辰东",
    category: "玄幻",
    description: "冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺，亘古长存。这是太空探测器在枯寂的宇宙中捕捉到的一幅极其震撼的画面。",
    cover: "https://via.placeholder.com/200x280/FF5722/white?text=遮天",
    readCount: 189000,
    isCompleted: true,
    isFavorited: false
  }
];

// 用户收藏数据
let userFavorites = [];

// 模拟章节数据
let chapters = {
  1: [ // 天龙八部的章节
    { id: 1, novelId: 1, title: "Chapter 1 青衫磊落险峰行", content: "大理国都城大理，坐落在点苍山下，洱海之滨。这日天气晴朗，春意盎然。街市上行人如织，一派繁华气象。\n\n忽然间，远处传来阵阵马蹄声，由远而近，甚是急促。众人纷纷侧目观看，只见一匹快马飞驰而来，马上骑者身披青衫，面如冠玉，正是大理段氏的世子段誉。\n\n段誉勒马在茶楼前停下，翻身下马，快步走进茶楼。楼中食客见是世子到来，纷纷起身行礼。段誉摆了摆手，径直走到二楼雅座。\n\n'公子，您要点些什么？'小二恭敬地问道。\n\n'来壶好茶，再来几样精致小点。'段誉说道，目光却望向窗外，似乎在等待什么人。" },
    { id: 2, novelId: 1, title: "Chapter 2 玉壁月华明", content: "就在这时，楼下传来一阵骚动。段誉向下望去，只见一个蒙面女子正与几个恶汉纠缠。那女子身材窈窕，虽蒙着面纱，但从其身形举止来看，定是个绝色佳人。\n\n'光天化日之下，竟敢调戏良家女子！'段誉见状，心中义愤填膺，当即起身下楼。\n\n虽然段誉不会武功，但毕竟是大理世子，这几个恶汉见了他也不敢造次。段誉走到女子身前，对那几个恶汉说道：'几位好汉，这位姑娘若是有什么得罪之处，在下愿意代为赔礼。'\n\n那蒙面女子见段誉出面相救，心中感激，但又担心连累了他。" }
  ],
  4: [ // 斗破苍穹的章节
    { id: 1, novelId: 4, title: "Chapter 1 陨落的天才", content: "萧家后山，青石小径蜿蜒而上，直通山顶的一处幽静竹林。\n\n竹林深处，一名少年盘腿而坐，双目紧闭，正在修炼斗气。少年约莫十六七岁年纪，面目清秀，只是眉宇间偶尔闪过的一丝无奈，让人察觉到他内心的不平静。\n\n这少年正是萧炎，萧家新一代中最有天赋的弟子，曾经的天才少年。\n\n然而，三年前的一场变故，让他从云端跌落到了深渊。原本的斗气修为，在一夜之间全部消失殆尽，从一个天才变成了废物。\n\n'呼...'萧炎缓缓睁开双眼，眸中闪过一丝苦涩。又是一次无功而返的修炼。" },
    { id: 2, novelId: 4, title: "Chapter 2 神秘戒指", content: "萧炎站起身来，拍了拍身上的尘土，正准备下山回家，忽然发现手指上的那枚古朴戒指散发出微弱的光芒。\n\n这枚戒指是母亲留给他的唯一遗物，平日里看起来普普通通，没想到今日竟然有了异样。\n\n'这是...'萧炎惊疑不定地看着戒指，只见那光芒越来越亮，最后竟然凝聚成一个虚幻的人影。\n\n'小家伙，终于让我等到了。'那人影开口说道，声音苍老而威严。\n\n萧炎大吃一惊，连忙后退几步：'你...你是谁？'\n\n'我叫药老，曾经也是斗气大陆上的强者。'老者淡淡一笑，'小家伙，看你的情况，应该是遇到了什么麻烦吧？'" }
  ]
};

// API路由

// 获取所有小说
app.get('/api/novels', (req, res) => {
  const { search, category } = req.query;
  let filteredNovels = novels;

  // 搜索功能
  if (search) {
    filteredNovels = filteredNovels.filter(novel => 
      novel.title.toLowerCase().includes(search.toLowerCase()) ||
      novel.author.toLowerCase().includes(search.toLowerCase()) ||
      novel.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 分类筛选
  if (category && category !== 'all') {
    filteredNovels = filteredNovels.filter(novel => 
      novel.category === category
    );
  }

  res.json(filteredNovels);
});

// 获取单个小说详情
app.get('/api/novels/:id', (req, res) => {
  const novelId = parseInt(req.params.id);
  const novel = novels.find(n => n.id === novelId);
  
  if (!novel) {
    return res.status(404).json({
      success: false,
      message: '小说不存在'
    });
  }

  // 返回小说信息，包含收藏状态
  const novelWithStatus = {
    ...novel,
    isFavorited: novel.isFavorited || false
  };

  res.json({
    success: true,
    data: novelWithStatus
  });
});

// 获取小说章节列表
app.get('/api/novels/:id/chapters', (req, res) => {
  const novelId = parseInt(req.params.id);
  const novelChapters = chapters[novelId] || [];
  
  // 只返回章节标题和ID，不返回内容
  const chapterList = novelChapters.map(chapter => ({
    id: chapter.id,
    novelId: chapter.novelId,
    title: chapter.title
  }));

  res.json({
    success: true,
    data: chapterList
  });
});

// 获取具体章节内容
app.get('/api/novels/:novelId/chapters/:chapterId', (req, res) => {
  const novelId = parseInt(req.params.novelId);
  const chapterId = parseInt(req.params.chapterId);
  
  const novelChapters = chapters[novelId] || [];
  const chapter = novelChapters.find(c => c.id === chapterId);
  
  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: '章节不存在'
    });
  }

  res.json({
    success: true,
    data: chapter
  });
});

// 获取收藏列表
// 收藏/取消收藏
app.post('/api/favorite/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const novel = novels.find(n => n.id === id);
  if (novel) {
    novel.isFavorited = !novel.isFavorited;
    res.json({ success: true, isFavorited: novel.isFavorited });
  } else {
    res.status(404).json({ success: false, message: '小说未找到' });
  }
});

//搜索小说（简化，兼容前端）
app.get('/api/search', (req, res) => {
  const { q = '', category = 'all' } = req.query;
  let results = novels.filter(novel => {
    const matchTitle = novel.title.includes(q);
    const matchAuthor = novel.author.includes(q);
    const matchCategory = category === 'all' || novel.category === category;
    return (matchTitle || matchAuthor) && matchCategory;
  });
  res.json(results);
});

// 获取排行榜数据
app.get('/api/ranking', (req, res) => {
  try {
    // 为小说添加额外的排行榜数据
    const novelsWithRankingData = novels.map(novel => ({
      ...novel,
      updateTime: generateUpdateTime(),
      popularityScore: novel.readCount + (novel.isFavorited ? 1000 : 0)
    }));

    // 人气榜：按阅读量和收藏状态排序
    const popular = [...novelsWithRankingData]
      .sort((a, b) => b.popularityScore - a.popularityScore);

    // 最新榜：按更新时间排序
    const latest = [...novelsWithRankingData]
      .sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));

    // 完结榜：只显示已完结的小说，按阅读量排序
    const completed = novelsWithRankingData
      .filter(novel => novel.isCompleted)
      .sort((a, b) => b.readCount - a.readCount);

    res.json({
      popular,
      latest,
      completed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取排行榜数据失败'
    });
  }
});

// 生成模拟的更新时间
function generateUpdateTime() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // 0-7天前
  const hoursAgo = Math.floor(Math.random() * 24); // 0-24小时前
  
  const updateDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
  
  if (daysAgo === 0) {
    if (hoursAgo === 0) {
      return '刚刚更新';
    } else {
      return `${hoursAgo}小时前`;
    }
  } else {
    return `${daysAgo}天前`;
  }
}

// 取消收藏
app.delete('/api/favorites/:id', (req, res) => {
  const novelId = parseInt(req.params.id);
  userFavorites = userFavorites.filter(id => id !== novelId);

  res.json({
    success: true,
    message: '取消收藏成功'
  });
});

// 检查是否已收藏
app.get('/api/favorites/check/:id', (req, res) => {
  const novelId = parseInt(req.params.id);
  const isFavorited = userFavorites.includes(novelId);

  res.json({
    success: true,
    data: { isFavorited }
  });
});

// 获取分类列表
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(novels.map(novel => novel.category))];
  res.json({
    success: true,
    data: categories
  });
});

// 登录API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码不能为空'
    });
  }
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // 生成简单的会话ID（实际项目中应使用JWT或更安全的方式）
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    activeSessions.set(sessionId, {
      username: username,
      loginTime: new Date(),
      isAdmin: true
    });
    
    res.json({
      success: true,
      message: '登录成功',
      sessionId: sessionId,
      user: {
        username: username,
        isAdmin: true
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    });
  }
});

// 登出API
app.post('/api/logout', (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && activeSessions.has(sessionId)) {
    activeSessions.delete(sessionId);
  }
  
  res.json({
    success: true,
    message: '登出成功'
  });
});

// 检查登录状态API
app.get('/api/check-auth', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (sessionId && activeSessions.has(sessionId)) {
    const session = activeSessions.get(sessionId);
    res.json({
      success: true,
      isLoggedIn: true,
      user: {
        username: session.username,
        isAdmin: session.isAdmin
      }
    });
  } else {
    res.json({
      success: true,
      isLoggedIn: false
    });
  }
});

// 静态文件服务（为前端提供服务）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 广告点击统计API
app.post('/api/ad-click', (req, res) => {
  const { adType, page, novelId, chapterId, timestamp, userAgent } = req.body;
  
  // 记录广告点击数据（实际项目中可以存储到数据库）
  console.log('广告点击统计:', {
    adType,
    page: page || 'index',
    novelId,
    chapterId,
    timestamp,
    userAgent: userAgent?.substring(0, 100), // 截短用户代理字符串
    ip: req.ip || req.connection.remoteAddress
  });
  
  // 可以在这里添加数据库存储逻辑
  // await AdClickLog.create({ adType, page, novelId, chapterId, timestamp, userAgent, ip });
  
  res.json({ 
    success: true, 
    message: '广告点击已记录' 
  });
});

// 广告统计查询API（管理后台用）
app.get('/api/ad-stats', (req, res) => {
  // 实际项目中从数据库查询统计数据
  const mockStats = {
    totalClicks: 1250,
    todayClicks: 45,
    topAds: [
      { adType: 'banner-top', clicks: 320 },
      { adType: 'sidebar-1', clicks: 280 },
      { adType: 'content-middle', clicks: 195 }
    ],
    clicksByPage: {
      index: 850,
      reading: 400
    }
  };
  
  res.json({
    success: true,
    data: mockStats
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`小说网站服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
