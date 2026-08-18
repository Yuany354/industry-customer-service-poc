/* ============================================================
   产业版优化方案 v1.1 · 交互增强层
   注入方式：index.html 末尾加载，不修改原编译产物
   覆盖优化点：W0-1 / W0-2 / W0-5 / W1-1~W1-5 / W4-3 / W4-4 / W4-5 /
              W4-6 / W4'-6 / W5-1~5-4 / X-2 / X-4
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 全局状态 ---------- */
  var state = { signed: true };

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var $$ = $all; /* 别名：现货报价卡历史代码使用 $$ */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function isHx(node) { return !!(node.closest && node.closest('.hx-toolbar,.hx-msg-panel,.hx-mask,.hx-ai-drawer,.hx-ai-ball,.hx-note,.hx-guest-ribbon')); }

  /* ---------- 轻提示 toast ---------- */
  function toast(text) {
    var t = el('div', '', text);
    t.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:1000;' +
      'background:#0b1f3a;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;' +
      'box-shadow:0 10px 25px rgba(11,31,58,.3);opacity:0;transition:opacity .2s';
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = '1'; });
    setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 250); }, 2600);
  }

  /* ==========================================================
     1. 演示工具条：签约身份切换（W0-2 / W1-1 / X-4）
     ========================================================== */
  function buildToolbar() {
    var bar = el('div', 'hx-toolbar');
    bar.innerHTML =
      '<b>演示工具 <small>v1.1 增强</small></b>' +
      '<div class="hx-seg">' +
      '<button data-role="signed" class="on">已签约 · 华辰金属</button>' +
      '<button data-role="guest">未签约访客</button>' +
      '</div>' +
      '<p>切换身份体验：未签约访客点击业务入口将触发签约引导（W0-2/X-4）。</p>';
    document.body.appendChild(bar);
    $all('.hx-seg button', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.signed = btn.getAttribute('data-role') === 'signed';
        $all('.hx-seg button', bar).forEach(function (b) { b.classList.toggle('on', b === btn); });
        decorate();
        toast(state.signed ? '已切换：签约客户「华辰金属」视图' : '已切换：未签约访客视图，业务入口将引导签约');
      });
    });
  }

  /* ==========================================================
     2. 签约引导模态框（X-4：价值说明 + 签约引导 + 联系客户经理）
     ========================================================== */
  var mask, modal;
  function buildModal() {
    mask = el('div', 'hx-mask');
    modal = el('div', 'hx-modal');
    mask.appendChild(modal);
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.classList.remove('open'); });
  }
  function showSignModal() {
    modal.innerHTML =
      '<h3>开通产业客户服务</h3>' +
      '<p class="hx-modal-sub">您正在以访客身份浏览。以下业务需完成企业签约后使用：</p>' +
      '<ul>' +
      '<li>一单一策定制套保方案（场景模板 → 计划书交付）</li>' +
      '<li>大宗采销信息发布与意向对接</li>' +
      '<li>套保额度申请 / 交割进度跟踪 / 专属客户经理 1v1</li>' +
      '</ul>' +
      '<div class="hx-modal-actions">' +
      '<button class="hx-btn text" data-act="browse">继续浏览内容</button>' +
      '<button class="hx-btn primary" data-act="contact">联系客户经理了解签约</button>' +
      '</div>';
    mask.classList.add('open');
    $('[data-act=browse]', modal).onclick = function () { mask.classList.remove('open'); };
    $('[data-act=contact]', modal).onclick = function () {
      mask.classList.remove('open');
      toast('已通知专属客户经理「顾明远」，将在 1 个工作日内与您联系');
    };
  }
  function showSuitModal() {
    modal.innerHTML =
      '<h3>适当性校验（W4-5）</h3>' +
      '<p class="hx-modal-sub">提交申请前需完成适当性测评。测评约需 3 分钟，结果在有效期内无需重复作答。</p>' +
      '<div class="hx-modal-actions">' +
      '<button class="hx-btn text" data-act="back">返回修改</button>' +
      '<button class="hx-btn primary" data-act="kyc">去完成测评</button>' +
      '</div>';
    mask.classList.add('open');
    $('[data-act=back]', modal).onclick = function () { mask.classList.remove('open'); };
    $('[data-act=kyc]', modal).onclick = function () {
      mask.classList.remove('open');
      var kycBtn = $all('.site-shell button').filter(function (b) { return /风险偏好/.test(b.textContent); })[0];
      if (kycBtn) { kycBtn.click(); toast('已跳转至风险偏好 KYC 测评'); }
      else toast('请从左侧导航进入「风险偏好」完成测评');
    };
  }

  /* ==========================================================
     3. 点击拦截（capture 阶段，先于 React 事件）
        - 未签约访客 → 业务入口触发签约引导（W0-2 / W1-1）
        - 一单一策提交 → 适当性校验（W4-5）
     ========================================================== */
  var BUSINESS_TEXT = /发布需求|用此模板|提交申请|申请开通|进入交易|管理关注/;
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    if (isHx(t)) return;
    var btn = t.closest('button');
    if (!btn) return;
    var view = ($('.site-shell') || {}).getAttribute ? $('.site-shell').getAttribute('data-view') : '';

    if (!state.signed) {
      var isBusiness = btn.closest('.quick-services') || btn.closest('[data-need-sign]') || BUSINESS_TEXT.test(btn.textContent);
      if (isBusiness) { e.stopPropagation(); e.preventDefault(); showSignModal(); return; }
    }
    if (state.signed && view === 'scenario' && /提交申请/.test(btn.textContent)) {
      e.stopPropagation(); e.preventDefault(); showSuitModal(); return;
    }
  }, true);

  /* ==========================================================
     4. 消息中心：分级面板（W0-5）
     ========================================================== */
  var MSG = {
    biz: [
      { t: '一单一策申请 RM20260812031 状态更新', p: '已进入「方案沟通」，预计 2 个工作日内反馈', time: '10:24' },
      { t: '采销信息 CS20260813008 审核通过', p: '您发布的「出售·碳酸锂 99.5%」已公开展示', time: '09:12' }
    ],
    risk: [
      { t: '持仓风险指标接近预警线', p: '沪铜 CU2609 多头持仓敞口达预设阈值 85%，建议关注', time: '11:02', warn: true },
      { t: '保证金比例调整通知', p: '交易所上调螺纹钢保证金至 9%，请留意资金安排', time: '昨天', warn: true }
    ],
    content: [
      { t: '有色板块新增 3 篇研报', p: '周正《铜：库存去化速度仍是定价关键》等', time: '08:30' },
      { t: '《监管政策解读》专栏更新', p: '您关注的分类有新内容', time: '昨天' }
    ]
  };
  var msgPanel;
  function buildMsgPanel() {
    msgPanel = el('div', 'hx-msg-panel');
    document.body.appendChild(msgPanel);
  }
  function renderMsgPanel(tab) {
    var tabs = [['biz', '业务状态'], ['risk', '风控通知'], ['content', '内容更新']];
    msgPanel.innerHTML =
      '<header><b>消息中心</b><button data-close="1">✕</button></header>' +
      '<div class="hx-msg-tabs">' + tabs.map(function (x) {
        return '<button data-tab="' + x[0] + '" class="' + (x[0] === tab ? 'on' : '') + '">' + x[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="hx-msg-list">' + MSG[tab].map(function (m) {
        return '<div class="hx-msg-item' + (m.warn ? ' warn' : '') + '"><i></i><div><h4>' + m.t + '</h4><p>' + m.p + '</p></div><time>' + m.time + '</time></div>';
      }).join('') + '</div>';
    $('[data-close]', msgPanel).onclick = function () { msgPanel.classList.remove('open'); };
    $all('[data-tab]', msgPanel).forEach(function (b) {
      b.onclick = function () { renderMsgPanel(b.getAttribute('data-tab')); };
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    var bell = t.closest('.bell');
    if (bell) {
      e.stopPropagation(); e.preventDefault();
      renderMsgPanel('biz');
      msgPanel.classList.toggle('open');
    } else if (!t.closest('.hx-msg-panel') && msgPanel.classList.contains('open')) {
      msgPanel.classList.remove('open');
    }
  }, true);

  /* ==========================================================
     5. AI 助理：悬浮球 + 抽屉（W5-1 ~ W5-4）
     ========================================================== */
  var aiDrawer;
  var AI_SCENES = [
    { k: 'delivery', b: '交割日历', s: '查交易所交割日程', q: '沪铜 CU2609 的交割日期是什么时候？', a: '沪铜 CU2609：最后交易日 9月15日，最后交割日 9月18日；仓单提交截止 9月17日 15:00。需要查看其他品种可继续问我。' },
    { k: 'account', b: '账户查询', s: '小账类资金持仓', q: '查询我的保证金可用余额', a: '您尾号 6028 的期货账户：保证金可用 ¥1,286,400，持仓占用 ¥2,143,700，风险度 62.4%。数据为原型演示。' },
    { k: 'riskrule', b: '风控规则', s: '小控类规则问答', q: '强平预警线是多少？', a: '默认风控规则：风险度 ≥ 85% 触发预警通知，≥ 100% 进入追保流程。您的企业可与客户经理约定个性化阈值。' }
  ];
  function aiAnswer(q) {
    if (/交割|日历/.test(q)) return AI_SCENES[0].a;
    if (/账户|资金|保证金|余额/.test(q)) return AI_SCENES[1].a;
    if (/风控|强平|规则|预警/.test(q)) return AI_SCENES[2].a;
    return null;
  }
  function buildAI() {
    var ball = el('button', 'hx-ai-ball', '🤖');
    ball.title = 'AI 助理（引导式问答）';
    document.body.appendChild(ball);

    aiDrawer = el('div', 'hx-ai-drawer');
    aiDrawer.innerHTML =
      '<div class="hx-ai-head"><b>🤖 AI 助理</b><button data-close="1">✕</button></div>' +
      '<div class="hx-ai-scenes">' + AI_SCENES.map(function (s) {
        return '<button data-q="' + s.q + '"><b>' + s.b + '</b><small>' + s.s + '</small></button>';
      }).join('') + '</div>' +
      '<div class="hx-ai-chat"><div class="hx-ai-msg bot">您好，我是产业版 AI 助理。点击上方便捷场景，或直接输入问题。</div></div>' +
      '<div class="hx-ai-bound">💡 我可以回答交割日程 / 账户查询 / 风控规则相关问题（引导式问答，限定标准答案范围）</div>' +
      '<div class="hx-ai-input"><input placeholder="请输入问题，如：CU2609 交割日期" /><button class="hx-btn primary" data-send="1">发送</button></div>' +
      '<div class="hx-ai-foot"><span class="hx-ai-status"><i></i>人工客服 · 24h 值守 · 在线</span><button data-human="1">转人工客服</button></div>';
    document.body.appendChild(aiDrawer);

    ball.addEventListener('click', function () { aiDrawer.classList.toggle('open'); });
    $('[data-close]', aiDrawer).addEventListener('click', function () { aiDrawer.classList.remove('open'); });
    $all('.hx-ai-scenes button', aiDrawer).forEach(function (b) {
      b.addEventListener('click', function () { aiAsk(b.getAttribute('data-q')); });
    });
    var input = $('.hx-ai-input input', aiDrawer);
    function submit() {
      var q = input.value.trim();
      if (!q) return;
      input.value = '';
      aiAsk(q);
    }
    $('[data-send]', aiDrawer).addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    $('[data-human]', aiDrawer).addEventListener('click', function () {
      aiBot('已为您转接人工客服（24h 值守）。工单号 KF20260814-019，客服「顾明远」将尽快接入；您也可拨打服务热线 400-800-2026。');
    });
  }
  function aiUser(text) {
    var chat = $('.hx-ai-chat', aiDrawer);
    var m = el('div', 'hx-ai-msg user');
    m.textContent = text;
    chat.appendChild(m);
    chat.scrollTop = chat.scrollHeight;
  }
  function aiBot(html) {
    var chat = $('.hx-ai-chat', aiDrawer);
    chat.appendChild(el('div', 'hx-ai-msg bot', html));
    chat.scrollTop = chat.scrollHeight;
  }
  function aiAsk(q) {
    aiUser(q);
    var a = aiAnswer(q);
    setTimeout(function () {
      if (a) { aiBot(a); return; }
      var m = el('div', 'hx-ai-msg bot',
        '该问题超出我的服务范围（交割日程 / 账户查询 / 风控规则）。建议联系您的专属客户经理获得解答。' +
        '<button class="hx-human-link">转人工客服</button>');
      $('.hx-ai-chat', aiDrawer).appendChild(m);
      $('.hx-human-link', m).addEventListener('click', function () {
        aiBot('已为您转接人工客服（24h 值守）。工单号 KF20260814-019，客服将尽快接入。');
      });
      $('.hx-ai-chat', aiDrawer).scrollTop = 1e6;
    }, 350);
  }

  /* ==========================================================
     6. 视图级注入（W1-1 / W4-3 / W4-4 / W4-6 / W4'-6）
        MutationObserver 跟随 React 重渲染保持生效
     ========================================================== */
  var NOTES = {
    sourcing: ['info', '信息口径', '信息由我司审核后发布；平台仅提供信息发布与意向对接服务，意向请联系客户经理。一期不提供线上撮合。'],
    applications: ['', '时效承诺（W4-6）', '响应时效承诺：受理申请后 2 个工作日内首次反馈；方案类申请预计 5 个工作日内交付计划书 PDF。'],
    scenario: ['amber', '风险偏好 KYC（W4-4）', '尚未完成风险偏好测评？可「按中性偏好处理」先行提交，或先完成测评获得更适配的方案建议；未完成测评不阻断提交。'],
    exposure: ['', '敞口分析说明（W4-3）', '当前敞口分析基于期货持仓与套保信号；现货敞口请在一单一策需求表单中一并描述。'],
    stress: ['', '压力测试说明', '压力测试复用风控侧能力；套保预算化场景规划中。'],
    kyc: ['', '测评说明', '测评结果用于一单一策方案的风险偏好带出；未完成测评不阻断业务提交（W4-4 软引导）。']
  };

  /* ==========================================================
     首页 · 现货报价紧凑卡（参考华泰天玑现货报价结构）
     - 收敛为「报价列表/我的监控」两 Tab；申请与提醒记录归平台统一模块
     - 基差/涨跌：正红负绿；免责声明常驻；查看更多 → 投研支持
     ========================================================== */
  var hxq = { tab: 'list', alerts: {} };
  var HX_QUOTES = {
    list: [
      { name: '热轧板卷', spec: '4.75mm · 汇总价格：上海', unit: '元/吨', spot: '3260', chg: 0, fold: '3260', fut: 'HC2610', futPrice: '3251', basis: 9, basisChg: -18 },
      { name: '螺纹钢', spec: 'HRB400E Φ18 · 汇总价格：上海', unit: '元/吨', spot: '3030', chg: -10, fold: null, fut: 'RB2610', futPrice: '3016', basis: 14, basisChg: -14 },
      { name: '沪铜', spec: '1#电解铜 · 汇总价格：上海', unit: '元/吨', spot: '79240', chg: 180, fold: '79240', fut: 'CU2609', futPrice: '79160', basis: 80, basisChg: 35 }
    ],
    watch: [
      { name: '沪铜', spec: '1#电解铜 · 汇总价格：上海', unit: '元/吨', spot: '79240', chg: 180, fold: '79240', fut: 'CU2609', futPrice: '79160', basis: 80, basisChg: 35 }
    ]
  };
  function fmtNum(n) {
    if (n > 0) return '<span class="hxq-up">+' + n + '</span>';
    if (n < 0) return '<span class="hxq-down">' + n + '</span>';
    return '<span class="hxq-flat">0</span>';
  }
  function buildQuoteCard() {
    var p = el('section', 'hxq-panel');
    renderHxq(p);
    return p;
  }
  function renderHxq(p) {
    var rows = hxq.tab === 'list' ? HX_QUOTES.list : HX_QUOTES.watch;
    var body = rows.map(function (r) {
      var alertKey = r.fut;
      var done = hxq.alerts[alertKey];
      return '<tr><td class="hxq-name"><b>' + r.name + ' <small>' + r.unit + '</small></b><small>' + r.spec + '</small></td>' +
        '<td>2026-08-14</td><td>' + r.spot + '</td><td>' + fmtNum(r.chg) + '</td>' +
        '<td>' + (r.fold || '-') + '</td>' +
        '<td>' + r.futPrice + '<br><span class="hxq-fut">主 ' + r.fut + '</span></td>' +
        '<td>' + fmtNum(r.basis) + '</td><td>' + fmtNum(r.basisChg) + '</td>' +
        '<td><button class="hxq-alert' + (done ? ' done' : '') + '" data-k="' + alertKey + '">' + (done ? '已提醒 ✓' : '新增提醒') + '</button></td></tr>';
    }).join('');
    var empty = hxq.tab === 'watch' && rows.length === 0
      ? '<tr><td colspan="9" style="text-align:center;color:rgba(0,0,0,.45);padding:26px">暂无监控品种，在报价列表点「新增提醒」即可加入监控</td></tr>' : '';
    p.innerHTML =
      '<div class="hxq-head"><h2>现货报价</h2>' +
      '<small>不构成投资建议，据此操作，风险自担。</small>' +
      '<button class="hxq-more">查看更多 现货数据 →</button></div>' +
      '<div class="hxq-tabs">' +
      '<button data-t="list" class="' + (hxq.tab === 'list' ? 'on' : '') + '">报价列表</button>' +
      '<button data-t="watch" class="' + (hxq.tab === 'watch' ? 'on' : '') + '">我的监控</button></div>' +
      '<table class="hxq-table"><thead><tr><th>品种</th><th>日期</th><th>现货价格</th><th>涨跌</th><th>现货折盘面价</th><th>期货价格</th><th>基差</th><th>基差变化</th><th>操作</th></tr></thead>' +
      '<tbody>' + (body || empty) + '</tbody></table>';
    $$('.hxq-tabs button', p).forEach(function (b) {
      b.addEventListener('click', function () { hxq.tab = b.dataset.t; renderHxq(p); });
    });
    $('.hxq-more', p).addEventListener('click', function () {
      var btns = document.querySelectorAll('.main-header nav button');
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].textContent.trim() === '投研支持') { btns[i].click(); return; }
      }
    });
    $$('.hxq-alert', p).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('done')) return;
        hxq.alerts[b.dataset.k] = true;
        toast('已添加基差提醒：' + b.dataset.k + '，触发阈值后消息通知');
        renderHxq(p);
      });
    });
  }

  function decorate() {
    var shell = $('.site-shell');
    if (!shell) return;
    var view = shell.getAttribute('data-view') || 'home';

    /* W0-1 一级导航红点：投研支持 / 基础服务 */
    $all('.main-header nav button').forEach(function (b) {
      var needDot = /投研支持|基础服务/.test(b.textContent);
      b.classList.toggle('hx-nav-dot', needDot);
    });

    /* 品牌字样：恒衍 → 国泰 / 国泰君安期货 */
    var logoSpan = $('.main-header .logo span');
    if (logoSpan && logoSpan.textContent !== '国泰') logoSpan.textContent = '国泰';
    var utilFirst = $('.utility > div > span');
    if (utilFirst && utilFirst.textContent !== '国泰君安期货') utilFirst.textContent = '国泰君安期货';

    /* W0-5 铃铛徽标 */
    var bell = $('.header-actions .bell');
    if (bell && !$('.hx-bell-badge', bell)) {
      bell.appendChild(el('i', 'hx-bell-badge', '6'));
    }

    /* 视图级提示条：插入 main 顶部（仅直接子级，避免误删重建模块内的提示条） */
    var main = $('main', shell);
    if (main) {
      var old = main.querySelector(':scope > .hx-note');
      if (old) old.remove();
      var cfg = NOTES[view];
      if (cfg) {
        var note = el('div', 'hx-note ' + cfg[0], '<b>' + cfg[1] + '</b><span>' + cfg[2] + '</span>');
        var firstWrap = main.firstElementChild;
        if (firstWrap) main.insertBefore(note, firstWrap);
        else main.appendChild(note);
      }
    }

    /* W1 首页重建 + W-NAV 基础服务重建：覆盖渲染，离开卸载 */
    var homeApp = document.getElementById('hxw-app');
    var basicApp = document.getElementById('hxb-app');
    if (main) {
      main.classList.toggle('hx-main-override', view === 'home' || view === 'basic');
      if (view === 'home') {
        if (!homeApp) main.appendChild(buildHomeApp());
        else renderHwKingkong(homeApp); /* W1-1 身份切换时重排金刚区 */
      } else if (homeApp) { stopHwBanner(); homeApp.remove(); hw.lastSigned = null; }
      if (view === 'basic') {
        if (!basicApp) main.appendChild(buildBasicApp());
      } else if (basicApp) basicApp.remove();
    }

    /* 首页 · 现货报价紧凑卡：保留在 W1 模块之后，离开首页卸载 */
    var qCard = document.querySelector('.hxq-panel');
    if (main) {
      if (view === 'home') {
        if (!qCard) {
          homeApp = document.getElementById('hxw-app');
          if (homeApp) main.insertBefore(buildQuoteCard(), homeApp.nextSibling);
        }
      } else if (qCard) qCard.remove();
    }

    /* W1-1 未签约访客提示带 */
    var oldRibbon = $('.hx-guest-ribbon');
    if (oldRibbon) oldRibbon.remove();
    if (!state.signed) {
      var ribbon = el('div', 'hx-guest-ribbon',
        '当前为未签约访客视图：内容栏目可自由浏览，业务办理入口将引导签约。 <button data-sign="1">了解签约 ›</button>');
      var header = $('.main-header', shell);
      if (header && header.nextSibling) shell.insertBefore(ribbon, header.nextSibling);
      $('[data-sign]', ribbon).addEventListener('click', showSignModal);
    }

    /* X-2 即将上线统一置灰 + tooltip */
    $all('.site-shell button').forEach(function (b) {
      var soon = /即将上线|规划中/.test(b.textContent) && b.textContent.length < 30;
      b.classList.toggle('hx-coming-soon', soon);
      if (soon) b.title = '规划中，敬请期待';
    });
  }

  /* ==========================================================
     7. 基础服务 · W-NAV 模板A 重建
        侧栏：咨询与知识[C] / 工具与案例库[C] / 活动与调研[R↗]
              / 人才服务[C+F] / 仓单及交割指南[C+R↗]
     ========================================================== */
  var HXB_TABS = ['全部', '政策解读', '套保会计', '内控制度', '基础知识'];
  var HXB_DOT_TABS = ['政策解读'];            /* W2-1 红点分类 */
  /* W2 侧栏分类树：咨询与知识子分类（CMS 分类树，监管解读🔴复用关注链路） */
  var HXB_CONSULT_CHILDREN = [
    { name: '可行性分析', tab: '可行性分析' },
    { name: '内控制度', tab: '内控制度' },
    { name: '监管解读', tab: '政策解读', dot: true },
    { name: '套保会计', tab: '套保会计' },
    { name: '基础知识', tab: '基础知识' }
  ];
  var HXB_ARTICLES = [
    { cat: '政策解读', title: '《期货和衍生品法》实施要点与企业合规清单', date: '08-12', isNew: true, file: '企业合规清单.pdf' },
    { cat: '政策解读', title: '场外衍生品业务监管新规解读：对产业客户的影响', date: '08-05' },
    { cat: '套保会计', title: '套保会计实操：现金流量套期的会计处理', date: '08-08', file: '分录示例.xlsx' },
    { cat: '套保会计', title: '套期有效性评估的常见问答', date: '07-28' },
    { cat: '内控制度', title: '企业衍生品业务内控制度模板（可下载）', date: '07-20', file: '内控制度模板.docx' },
    { cat: '内控制度', title: '衍生品业务授权与审批流程设计要点', date: '07-12' },
    { cat: '基础知识', title: '期货期权基础图解：从远期到期权', date: '07-10' },
    { cat: '基础知识', title: '交割与仓单业务入门速查', date: '07-02' }
    /* 可行性分析：暂无内容 → 演示 W2-5 空态 */
  ];
  /* C/R/F 仅为内部功能分类标注，界面不展示（HXB_SECTIONS 仅存结构与红点） */
  var HXB_SECTIONS = [
    { id: 'consult', name: '咨询与知识', dot: true },
    { id: 'tools', name: '工具与案例库' },
    { id: 'events', name: '活动与调研' },
    { id: 'talent', name: '人才服务' },
    { id: 'guide', name: '仓单及交割', jump: true }   /* W2-2 复用型跳转项，不建本地内容 */
  ];
  var HXB_EVENTS = [
    { d: '20', m: '8月', title: '有色产业链沙龙', meta: '线下 · 上海 · 15:00—17:00', type: '沙龙' },
    { d: '02', m: '9月', title: '黑色产业链秋季供需展望', meta: '线上直播 · 15:00—16:30', type: '峰会' },
    { d: '22', m: '9月', title: '华东铜加工企业调研行', meta: '线下调研 · 江苏常州 · 审核中', type: '调研' }
  ];
  var hxb = { section: 'consult', tab: '全部', page: 1, article: null, fav: {}, talentDone: false };

  function buildBasicApp() {
    var app = el('div', '', ''); app.id = 'hxb-app';
    app.innerHTML =
      '<div class="hxb-layout"><nav class="hxb-side"></nav><div class="hxb-main"></div></div>';
    renderHxbSide(app);
    renderHxbMain(app);
    return app;
  }
  function renderHxbSide(app) {
    var side = $('.hxb-side', app);
    side.innerHTML = '';
    HXB_SECTIONS.forEach(function (s) {
      var b = el('button');
      b.className = s.id === hxb.section ? 'on' : '';
      b.innerHTML = (s.dot ? '<i class="hxb-dot"></i>' : '') + '<span>' + s.name + '</span>' + (s.jump ? '<i class="hxb-jump">↗</i>' : '');
      b.addEventListener('click', function () {
        if (s.jump) { toast('已带来源参数跳转主经纪商服务·' + s.name + '（W2-2，不重复开发），返回时回到本栏目'); return; }
        hxb.section = s.id; hxb.article = null; hxb.page = 1;
        renderHxbSide(app); renderHxbMain(app);
      });
      side.appendChild(b);
      /* 咨询与知识展开 CMS 分类树子项 */
      if (s.id === 'consult' && hxb.section === 'consult') {
        HXB_CONSULT_CHILDREN.forEach(function (c) {
          var cb = el('button', 'hxb-child' + (hxb.tab === c.tab ? ' on' : ''));
          cb.innerHTML = (c.dot ? '<i class="hxb-dot"></i>' : '') + '<span>' + c.name + '</span>';
          cb.addEventListener('click', function () {
            hxb.tab = c.tab; hxb.article = null; hxb.page = 1;
            renderHxbSide(app); renderHxbMain(app);
          });
          side.appendChild(cb);
        });
      }
    });
  }
  function hxbCrumb(name) {
    return '<div class="hxb-crumb">产业版首页 › 基础服务 › <b>' + name + '</b></div>';
  }
  function renderHxbMain(app) {
    var box = $('.hxb-main', app);
    if (hxb.section === 'consult') return renderHxbConsult(box);
    if (hxb.section === 'tools') return renderHxbTools(box);
    if (hxb.section === 'events') return renderHxbEvents(box);
    if (hxb.section === 'talent') return renderHxbTalent(box);
  }
  /* 咨询与知识：Tab + 列表 + 详情（W2-1 / W2-3 / W2-5） */
  function renderHxbConsult(box) {
    if (hxb.article) return renderHxbDetail(box, hxb.article);
    var html = hxbCrumb('咨询与知识') +
      '<h3 class="hxb-section-title">咨询与知识</h3>' +
      '<p class="hxb-section-sub">CMS 供稿 · 复用研报详情模板与关注链路；🔴 = 关注分类有更新</p>' +
      '<div class="hxb-tabs">' + HXB_TABS.map(function (t) {
        return '<button data-tab="' + t + '" class="' + (t === hxb.tab ? 'on' : '') + '">' + t +
          (HXB_DOT_TABS.indexOf(t) >= 0 ? '<i class="hxb-dot"></i>' : '') + '</button>';
      }).join('') + '</div><div class="hxb-list"></div><div class="hxb-pager"></div>';
    box.innerHTML = html;
    var list = $('.hxb-list', box);
    var items = HXB_ARTICLES.filter(function (a) { return hxb.tab === '全部' || a.cat === hxb.tab; });
    if (!items.length) {
      list.innerHTML = '<div class="hxb-empty"><b>内容整理中（W2-5 空态）</b>「' + hxb.tab + '」分类暂无内容，可订阅提醒，上线后通过消息🔔通知。</div>';
      $('.hxb-empty', list).appendChild(hxbBtn('订阅提醒', '', function () { toast('已订阅「' + hxb.tab + '」更新提醒'); }));
    }
    /* 列表分页：每页 5 条 */
    var PAGE = 5;
    var pages = Math.max(1, Math.ceil(items.length / PAGE));
    if (hxb.page > pages) hxb.page = pages;
    items.slice((hxb.page - 1) * PAGE, hxb.page * PAGE).forEach(function (a) {
      var row = el('div', 'hxb-item');
      row.innerHTML = '<span class="hxb-cat">' + a.cat + '</span><h4>📄 ' + a.title + '</h4>' +
        (a.isNew ? '<span class="hxb-new">NEW</span>' : '') +
        '<time>' + a.date + '</time>' +
        '<button class="hxb-star' + (hxb.fav[a.title] ? ' on' : '') + '" title="收藏">' + (hxb.fav[a.title] ? '★' : '☆') + '</button>';
      $('.hxb-star', row).addEventListener('click', function (e) {
        e.stopPropagation();
        hxb.fav[a.title] = !hxb.fav[a.title];
        renderHxbConsult(box);
        toast(hxb.fav[a.title] ? '已收藏' : '已取消收藏');
      });
      row.addEventListener('click', function () { hxb.article = a; renderHxbMain($('#hxb-app')); });
      list.appendChild(row);
    });
    var pager = $('.hxb-pager', box);
    if (pages > 1) {
      var pHtml = '<button data-p="prev"' + (hxb.page === 1 ? ' disabled' : '') + '>‹</button>';
      for (var pi = 1; pi <= pages; pi++) pHtml += '<button data-p="' + pi + '" class="' + (pi === hxb.page ? 'on' : '') + '">' + pi + '</button>';
      pHtml += '<button data-p="next"' + (hxb.page === pages ? ' disabled' : '') + '>›</button>';
      pager.innerHTML = pHtml;
      $all('button', pager).forEach(function (b) {
        b.addEventListener('click', function () {
          var p = b.getAttribute('data-p');
          if (p === 'prev') hxb.page = Math.max(1, hxb.page - 1);
          else if (p === 'next') hxb.page = Math.min(pages, hxb.page + 1);
          else hxb.page = +p;
          renderHxbConsult(box);
        });
      });
    }
    $all('[data-tab]', box).forEach(function (b) {
      b.addEventListener('click', function () { hxb.tab = b.getAttribute('data-tab'); hxb.page = 1; renderHxbConsult(box); });
    });
  }
  function renderHxbDetail(box, a) {
    box.innerHTML = hxbCrumb('咨询与知识') +
      '<div class="hxb-detail">' +
      '<h2>' + a.title + '</h2>' +
      '<div class="hxb-meta">' + a.date + ' · ' + a.cat + ' · 内容运营供稿（复用研报详情模板）</div>' +
      '<p>本篇为原型演示正文。实际生产中由 CMS 供稿，正文、附件与分类关注能力复用研报详情页模板，无需重复开发。</p>' +
      '<p>要点包括：适用场景、操作流程、合规边界与常见问题；配套模板/工具以附件形式提供下载。</p>' +
      (a.file ? '<div class="hxb-file">📎 ' + a.file + '</div>' : '') +
      '<div class="hxb-actions"></div></div>';
    var actions = $('.hxb-actions', box);
    if (a.file) $('.hxb-file', box).appendChild(hxbBtn('下载附件', 'primary', function () { toast('附件下载已开始（演示）'); }));
    actions.appendChild(hxbBtn('‹ 返回列表', 'text', function () { hxb.article = null; renderHxbMain($('#hxb-app')); }));
    actions.appendChild(hxbBtn('关注该分类', 'primary', function () {
      toast('已关注「' + a.cat + '」：后续更新将通过消息🔔推送并在侧栏显示红点（W2-3 闭环）');
    }));
  }
  /* 工具与案例库 */
  function renderHxbTools(box) {
    var tools = [
      { b: '制度模板库', p: '内控制度、授权审批、业务台账等模板，可直接下载使用。', f: '制度模板包.zip' },
      { b: '测算工具', p: '套保比例测算表、基差/榨利测算模板（Excel）。', f: '测算工具包.xlsx' },
      { b: '行业案例集', p: '有色/黑色/能化产业链套保案例汇编（去公司名）。', f: '案例集.pdf' }
    ];
    box.innerHTML = hxbCrumb('工具与案例库') +
      '<h3 class="hxb-section-title">工具与案例库</h3>' +
      '<p class="hxb-section-sub">制度模板 / 测算工具 / 行业案例下载（CMS 供稿）</p>' +
      '<div class="hxb-cards">' + tools.map(function (t) {
        return '<div class="hxb-card"><b>' + t.b + '</b><p>' + t.p + '</p><small style="color:var(--muted,#6d7989)">📎 ' + t.f + '</small></div>';
      }).join('') + '</div>';
    $all('.hxb-card', box).forEach(function (c, i) {
      c.appendChild(hxbBtn('下载', '', function () { toast('「' + tools[i].b + '」下载已开始（演示）'); }));
    });
  }
  /* 活动与调研：R·复用会议预约 */
  function renderHxbEvents(box) {
    box.innerHTML = hxbCrumb('活动与调研') +
      '<h3 class="hxb-section-title">活动与调研</h3>' +
      '<p class="hxb-section-sub">沙龙 / 培训 / 产地调研报名 · 复用线下会议预约链路 [R↗]</p>' +
      '<div>' + HXB_EVENTS.map(function (ev) {
        return '<div class="hxb-event"><time><b>' + ev.d + '</b><span>' + ev.m + '</span></time>' +
          '<div><h4>' + ev.title + '</h4><p>' + ev.type + ' · ' + ev.meta + '</p></div></div>';
      }).join('') + '</div>';
    $all('.hxb-event', box).forEach(function (row, i) {
      row.appendChild(hxbBtn('报名', 'primary', function () {
        toast('已带来源参数跳转「会议预约」（R·复用，不重复开发）：' + HXB_EVENTS[i].title);
      }));
    });
  }
  /* 人才服务：C+F 培训计划报名 + 专家库空态 */
  function renderHxbTalent(box) {
    box.innerHTML = hxbCrumb('人才服务') +
      '<h3 class="hxb-section-title">产业人才培训计划</h3>' +
      '<p class="hxb-section-sub">套保会计/期货入门/定制内训 · 提交报名后由人力资源部对接 [C+F]</p>' +
      (hxb.talentDone
        ? '<div class="hx-note info"><b>已提交</b><span>报名已受理，人力资源部将在 2 个工作日内与您联系。</span></div>'
        : '<form class="hxb-form">' +
          '<label>企业名称<input required placeholder="如：华辰金属"/></label>' +
          '<label>联系人<input required placeholder="姓名"/></label>' +
          '<label>联系电话<input required placeholder="手机/座机"/></label>' +
          '<label>意向方向<select><option>套保会计培训</option><option>期货入门培训</option><option>定制内训（上门）</option></select></label>' +
          '<label class="full">备注<textarea rows="2" placeholder="可选：人数、期望时间等"></textarea></label>' +
          '<div class="full"></div></form>') +
      '<div class="hxb-empty"><b>外部专家资源库</b>模块建设中（一期降级为内容介绍，见待确认问题 Q3）</div>';
    if (!hxb.talentDone) {
      var holder = $('.hxb-form .full', box);
      holder.appendChild(hxbBtn('提交报名', 'primary', function (e) {
        e.preventDefault();
        hxb.talentDone = true;
        renderHxbTalent(box);
        toast('报名已提交，将同步至「我的意向单」状态跟踪');
      }));
      $('.hxb-form', box).addEventListener('submit', function (e) { e.preventDefault(); });
    }
    var empty = $('.hxb-empty', box);
    empty.appendChild(hxbBtn('订阅提醒', '', function () { toast('已订阅「外部专家资源库」上线提醒'); }));
  }
  function hxbBtn(text, kind, fn) {
    var b = el('button', 'hx-btn' + (kind ? ' ' + kind : ''), '');
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  }

  /* ==========================================================
     8. 首页 · W1 线框稿重建（分流枢纽，不承载功能）
        Banner 轮播 + 我的工作台聚合(W1-2) + 金刚区(W1-1)
        + 产业投研精选(W1-4) + 政策解读 + 采销速览(W1-3) + 研究与活动(W1-5)
     ========================================================== */
  var hw = { slide: 0, timer: null, lastSigned: null };

  function goNav(name) {
    var btns = document.querySelectorAll('.main-header nav button');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim() === name) { btns[i].click(); return; }
    }
  }
  function goBasic(section, tab) {
    hxb.section = section; hxb.article = null;
    if (tab) hxb.tab = tab;
    goNav('基础服务');
    var app = document.getElementById('hxb-app');
    if (app) { renderHxbSide(app); renderHxbMain(app); }
  }

  var HW_BANNERS = [
    { t: '产业版一站式服务', p: '研究洞察 · 风险管理 · 大宗采销 · 交易接入，面向产业客户的全流程服务枢纽', b: '了解服务边界', act: function () { goNav('产业咨询'); } },
    { t: '君英汇 · 黑色产业链秋季峰会', p: '09-02 上海 · 线下峰会报名通道已开启', b: '立即报名', act: function () { toast('已带来源参数跳转「会议预约」（R·复用）：黑色产业链秋季峰会'); } },
    { t: '新功能上线：AI 助理', p: '交割日历 / 账户查询 / 风控规则引导式问答，24h 人工客服值守', b: '立即体验', act: function () { aiDrawer.classList.add('open'); } }
  ];
  var HW_KING = [
    { k: 'quota', ico: '🛡', name: '套保额度', biz: 1, go: function () { goNav('风险管理'); } },
    { k: 'delivery', ico: '📦', name: '仓单交割', biz: 1, go: function () { toast('已带来源参数跳转主经纪商服务·仓单及交割（W2-2），返回时回到首页'); } },
    { k: 'suit', ico: '📋', name: '一单一策', biz: 1, go: function () { goNav('风险管理'); } },
    { k: 'sourcing', ico: '🚚', name: '采销信息', biz: 1, go: function () { goNav('大宗采销'); } },
    { k: 'risk', ico: '⚖️', name: '风险管理', biz: 1, go: function () { goNav('风险管理'); } },
    { k: 'research', ico: '📈', name: '研报中心', biz: 0, go: function () { goNav('投研支持'); } },
    { k: 'events', ico: '📅', name: '会议报名', biz: 0, go: function () { goBasic('events'); } },
    { k: 'manager', ico: '🤝', name: '联系客户经理', biz: 0, go: function () { toast('已通知专属客户经理「顾明远」，将在 1 个工作日内与您联系'); } }
  ];

  function buildHomeApp() {
    var app = el('div', ''); app.id = 'hxw-app';
    app.innerHTML =
      '<div class="hw-top">' +
      '<div class="hw-banner"><div class="hw-slides"></div><div class="hw-dots"></div></div>' +
      '<aside class="hw-workbench panel"></aside>' +
      '</div>' +
      '<div class="hw-kingkong panel"></div>' +
      '<div class="hw-grid">' +
      '<section class="hw-research panel"></section>' +
      '<section class="hw-policy panel"></section>' +
      '<section class="hw-sourcing panel"></section>' +
      '<section class="hw-events panel"></section>' +
      '</div>';
    renderHwBanner(app);
    renderHwWorkbench(app);
    renderHwKingkong(app);
    renderHwResearch(app);
    renderHwPolicy(app);
    renderHwSourcing(app);
    renderHwEvents(app);
    return app;
  }

  /* Banner 轮播：5s 自动 + 圆点手动 */
  function renderHwBanner(app) {
    var slides = $('.hw-slides', app), dots = $('.hw-dots', app);
    slides.innerHTML = HW_BANNERS.map(function (s, i) {
      return '<div class="hw-slide s' + i + '"><div><h2>' + s.t + '</h2><p>' + s.p + '</p>' +
        '<button data-i="' + i + '">' + s.b + '</button></div></div>';
    }).join('');
    dots.innerHTML = HW_BANNERS.map(function (s, i) {
      return '<button data-i="' + i + '" aria-label="第' + (i + 1) + '屏"></button>';
    }).join('');
    function show(i) {
      hw.slide = i;
      $all('.hw-slide', slides).forEach(function (n, j) { n.classList.toggle('on', j === i); });
      $all('button', dots).forEach(function (n, j) { n.classList.toggle('on', j === i); });
    }
    function restart() {
      stopHwBanner();
      hw.timer = setInterval(function () { show((hw.slide + 1) % HW_BANNERS.length); }, 5000);
    }
    show(0);
    $all('button', slides).forEach(function (b) {
      b.addEventListener('click', function () { HW_BANNERS[+b.getAttribute('data-i')].act(); });
    });
    $all('button', dots).forEach(function (b) {
      b.addEventListener('click', function () { show(+b.getAttribute('data-i')); restart(); });
    });
    restart();
  }
  function stopHwBanner() { if (hw.timer) { clearInterval(hw.timer); hw.timer = null; } }

  /* 我的工作台（W1-2：聚合各模块申请单状态，不在首页另建状态） */
  function renderHwWorkbench(app) {
    var w = $('.hw-workbench', app);
    w.innerHTML =
      '<div class="block-title"><div><h2>我的工作台</h2><p>复用各模块状态 · 聚合呈现</p></div>' +
      '<button class="link-button" data-w="all">全部记录 ›</button></div>' +
      '<button class="hw-wb-item" data-w="biz" data-need-sign="1"><b>在办业务</b><em>3 项</em><i>›</i></button>' +
      '<button class="hw-wb-item" data-w="risk" data-need-sign="1"><b>风控通知</b><em class="warn">⚠ 2</em><i>›</i></button>' +
      '<button class="hw-wb-item" data-w="follow"><b>我的关注</b><em class="dot">7</em><span>复用研报关注链路</span><i>›</i></button>';
    var acts = {
      all: function () { var b = $('.workspace-entry'); if (b) b.click(); },
      biz: function () { var b = $('.workspace-entry'); if (b) b.click(); },
      risk: function () { renderMsgPanel('risk'); msgPanel.classList.add('open'); },
      follow: function () { goNav('投研支持'); }
    };
    $all('[data-w]', w).forEach(function (b) {
      b.addEventListener('click', function () { acts[b.getAttribute('data-w')](); });
    });
  }

  /* 金刚区（W1-1：按签约状态差异化排序；业务入口未签约点击走签约引导） */
  function renderHwKingkong(app) {
    var box = $('.hw-kingkong', app);
    if (!box || (hw.lastSigned === state.signed && box.childElementCount)) return;
    hw.lastSigned = state.signed;
    var items = HW_KING.slice().sort(function (a, b) {
      return state.signed ? (b.biz - a.biz) : (a.biz - b.biz);
    });
    box.innerHTML =
      '<div class="hw-king-head"><h2>高频服务</h2></div>' +
      '<div class="hw-king-grid">' + items.map(function (it) {
        return '<button data-k="' + it.k + '"' + (it.biz ? ' data-need-sign="1"' : '') + '>' +
          '<span>' + it.ico + '</span><b>' + it.name + '</b></button>';
      }).join('') + '</div>';
    $all('[data-k]', box).forEach(function (b) {
      var it = HW_KING.filter(function (x) { return x.k === b.getAttribute('data-k'); })[0];
      b.addEventListener('click', function () { it.go(); });
    });
  }

  /* 产业投研精选（W1-4：复用市场洞察只读缩略视图） */
  var HW_BASIS = [85, 40, 65, 20, 55, 75, 30, 60, 15, 45, 70, 25, 50, 35, 80, 10, 62, 28];
  function basisSvg() {
    var cells = '';
    for (var i = 0; i < HW_BASIS.length; i++) {
      cells += '<rect x="' + (i % 6) * 21 + '" y="' + Math.floor(i / 6) * 20 + '" width="19" height="18" rx="2" fill="var(--blue,#143c6b)" fill-opacity="' + (HW_BASIS[i] / 100).toFixed(2) + '"/>';
    }
    return '<svg viewBox="0 0 125 58" role="img" aria-label="基差地图缩略">' + cells + '</svg>';
  }
  function curveSvg() {
    return '<svg viewBox="0 0 125 58" role="img" aria-label="榨利曲线缩略">' +
      '<polyline points="0,44 20,40 40,32 60,34 80,24 100,18 120,12" fill="none" stroke="var(--blue,#143c6b)" stroke-width="2"/>' +
      '<polyline points="0,50 20,48 40,44 60,46 80,42 100,40 120,36" fill="none" stroke="var(--muted,#6d7989)" stroke-width="1.5" stroke-dasharray="3 3"/>' +
      '</svg>';
  }
  function renderHwResearch(app) {
    var box = $('.hw-research', app);
    box.innerHTML =
      '<div class="block-title"><div><small>RESEARCH PICKS</small><h2>产业投研精选</h2><p>复用市场洞察只读视图</p></div>' +
      '<button class="link-button" data-more="1">更多 ›</button></div>' +
      '<div class="hw-thumbs">' +
      '<div class="hw-thumb"><b>基差地图</b>' + basisSvg() + '<small>沪铜 +80 · 螺纹 +14 · 原油 +3.6</small></div>' +
      '<div class="hw-thumb"><b>榨利曲线</b>' + curveSvg() + '<small>豆粕盘面榨利 · 近月走强</small></div>' +
      '</div>';
    $('[data-more]', box).addEventListener('click', function () { goNav('投研支持'); });
  }

  /* 政策与解读（内容中心 Feed 标题流） */
  var HW_POLICY = [
    { c: '监管政策解读', t: '《期货和衍生品法》实施要点与企业合规清单', d: '08-12' },
    { c: '产业导向专题', t: '有色产业链三季度供需展望：库存去化仍是主线', d: '08-10' },
    { c: '监管政策解读', t: '场外衍生品业务监管新规解读：对产业客户的影响', d: '08-05' }
  ];
  function renderHwPolicy(app) {
    var box = $('.hw-policy', app);
    box.innerHTML =
      '<div class="block-title"><div><small>POLICY FEED</small><h2>政策与解读</h2><p>内容中心供稿</p></div>' +
      '<button class="link-button" data-more="1">更多 ›</button></div>' +
      '<div class="hw-policy-list">' + HW_POLICY.map(function (a, i) {
        return '<div class="hw-policy-item" data-i="' + i + '"><span class="hw-cat">' + a.c + '</span><h4>' + a.t + '</h4><time>' + a.d + '</time></div>';
      }).join('') + '</div>';
    $('[data-more]', box).addEventListener('click', function () { goBasic('consult', '政策解读'); });
    $all('.hw-policy-item', box).forEach(function (row) {
      row.addEventListener('click', function () {
        goBasic('consult', HW_POLICY[+row.getAttribute('data-i')].c === '监管政策解读' ? '政策解读' : '全部');
      });
    });
  }

  /* 采销信息速览（W1-3：只读卡片流 + 信息示例标注） */
  function renderHwSourcing(app) {
    var box = $('.hw-sourcing', app);
    box.innerHTML =
      '<div class="block-title"><div><small>SOURCING FEED</small><h2>采销信息速览</h2><p>只读卡片流 · 一期不做撮合</p></div>' +
      '<button class="hx-btn primary" data-pub="1">发布需求</button></div>' +
      '<div class="hw-src-list">' +
      '<div class="hw-src-item"><em class="sell">出售</em><div><b>碳酸锂 99.5%</b><p>500 吨 · 华东 · 08-13 发布</p></div></div>' +
      '<div class="hw-src-item"><em class="buy">求购</em><div><b>不锈钢 304</b><p>2000 吨 · 华南 · 08-12 发布</p></div></div>' +
      '<div class="hw-src-item"><em class="sell">出售</em><div><b>电解铜 1#</b><p>300 吨 · 华北 · 08-11 发布</p></div></div>' +
      '</div>';
    $('[data-pub]', box).addEventListener('click', function () { goNav('大宗采销'); });
  }

  /* 研究与活动（W1-5：活动日历与研究合并一卡，复用会议预约） */
  function renderHwEvents(app) {
    var box = $('.hw-events', app);
    box.innerHTML =
      '<div class="block-title"><div><h2>研究与活动</h2><p>君英汇沙龙 / 峰会 · 复用会议预约</p></div>' +
      '<button class="link-button" data-more="1">全部 ›</button></div>' +
      '<div class="event-row"><time><b>20</b><span>8月</span></time><div><em>线下沙龙</em><h3>有色产业链沙龙</h3><p>上海 · 15:00—17:00</p></div><button class="outline-button" data-ev="0">报名</button></div>' +
      '<div class="event-row"><time><b>02</b><span>9月</span></time><div><em>线上直播</em><h3>黑色产业链秋季供需展望</h3><p>15:00—16:30 · 峰会</p></div><button class="outline-button" data-ev="1">报名</button></div>' +
      '<div class="event-row"><time><b>22</b><span>9月</span></time><div><em class="offline">线下调研</em><h3>华东铜加工企业调研行</h3><p>江苏常州 · 审核中</p></div><button class="outline-button" data-ev="2">详情</button></div>';
    $all('[data-ev]', box).forEach(function (b) {
      b.addEventListener('click', function () { toast('已带来源参数跳转「会议预约」（R·复用，不重复开发）'); });
    });
    $('[data-more]', box).addEventListener('click', function () { goBasic('events'); });
  }

  /* ==========================================================
     启动
     ========================================================== */
  function boot() {
    buildToolbar();
    buildModal();
    buildMsgPanel();
    buildAI();
    /* 数据说明条：点「我知道了」后收起黄条（原编译产物仅弹 toast） */
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t instanceof Element && t.closest('.data-disclaimer button')) {
        setTimeout(function () { var d = $('.data-disclaimer'); if (d) d.style.display = 'none'; }, 60);
      }
    }, true);
    decorate();
    var pending = false;
    var mo = new MutationObserver(function (muts) {
      if (pending) return;
      var relevant = muts.some(function (m) {
        return !isHx(m.target) && !(m.addedNodes && Array.prototype.every.call(m.addedNodes, isHx));
      });
      if (!relevant) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; decorate(); });
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-view'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
