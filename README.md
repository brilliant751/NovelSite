# 小说网站项目结构

## 📁 项目结构

```
NovelSite/
├── client/                          # 前端项目根目录
│   ├── index.html                   # 网站首页（欢迎页面）
│   ├── assets/                      # 共享资源目录
│   │   └── js/                      # JavaScript库
│   │       └── vue.global.js        # Vue.js框架
│   └── pages/                       # 页面目录
│       ├── index/                   # 主页面（书架、收藏、搜索）
│       │   ├── index.html           # 主页面HTML
│       │   ├── style.css            # 主页面样式
│       │   └── app.js               # 主页面JavaScript逻辑
│       └── reading/                 # 阅读页面
│           ├── reading.html         # 阅读页面HTML
│           ├── style.css            # 阅读页面样式
│           └── reading.js           # 阅读页面JavaScript逻辑
└── server/                          # 后端项目
    ├── app.js                       # Express服务器
    └── package.json                 # 后端依赖配置
```

## 🚀 访问方式

1. **网站首页**: `http://localhost:3000/`
   - 欢迎页面，点击"进入网站"跳转到主功能页面

2. **主功能页面**: `http://localhost:3000/pages/index/index.html`
   - 书架：浏览所有小说
   - 收藏：查看收藏的小说
   - 搜索：搜索小说

3. **阅读页面**: `http://localhost:3000/pages/reading/reading.html?novel=1`
   - 小说阅读界面
   - 章节导航和内容显示

## 📋 页面功能

### 主功能页面 (`pages/index/`)
- ✅ 小说浏览（书架）
- ✅ 收藏管理
- ✅ 搜索功能
- ✅ 小说分类筛选
- ✅ 响应式设计

### 阅读页面 (`pages/reading/`)
- ✅ 小说章节阅读
- ✅ 章节目录导航
- ✅ 上一章/下一章导航
- ✅ 阅读进度记录
- ✅ 响应式阅读体验

## 🔧 技术栈

- **前端**: Vue.js 3 (CDN), Axios, HTML5, CSS3
- **后端**: Node.js, Express.js
- **数据**: 内存模拟数据（可扩展为数据库）

## 📱 响应式设计

- 桌面端优化显示
- 平板端适配
- 移动端友好界面

## 🎯 页面导航流程

```
首页 (index.html)
    ↓ [进入网站]
主功能页面 (pages/index/index.html)
    ↓ [点击小说]
阅读页面 (pages/reading/reading.html)
    ↓ [返回书架]
主功能页面 (pages/index/index.html)
```

## 🛠 开发说明

1. 每个页面都有独立的HTML、CSS、JS文件
2. 共享资源放在 `assets/` 目录
3. 页面间通过相对路径跳转
4. 样式和逻辑完全分离，便于维护
