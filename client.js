// 替换DSH首页欢迎文字：主标题 + 英文副标题
// 只在首页执行：检测到欢迎页元素才启动替换轮询，离开首页自动停止，减少无谓轮询

const REPLACE_INTERVAL_MS = 700; // 欢迎页渲染轮询间隔

let replaceTimer = null;

// 首页特征：欢迎主标题存在且仍为原始文案
function isWelcomePage() {
  const h1 = document.querySelector('h1');
  return !!(h1 && h1.textContent.trim() === '探索未至之境');
}

function replaceWelcome() {
  // 主标题
  const h1 = document.querySelector('h1');
  if (h1 && h1.textContent.trim() === '探索未至之境') {
    h1.textContent = '欢迎使用DSH';
  }
  // 副标题（紧跟主标题的 <p>）
  const subEl = document.querySelector('h1 + p');
  if (subEl && subEl.textContent.trim() === 'Into the Unknown') {
    subEl.textContent = 'Custom AI Harness';
  }
}

// 确保替换轮询只在首页运行；离开首页立即停止
function ensureReplaceLoop() {
  if (isWelcomePage()) {
    if (!replaceTimer) {
      replaceTimer = setInterval(replaceWelcome, REPLACE_INTERVAL_MS);
    }
    replaceWelcome(); // 进入首页后立即替换一次
  } else if (replaceTimer) {
    clearInterval(replaceTimer);
    replaceTimer = null;
  }
}

// 监听 DOM 变化（SPA 路由切换 / 页面重渲染），动态判断是否处于首页
new MutationObserver(ensureReplaceLoop).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// 脚本加载时先检测一次
ensureReplaceLoop();
