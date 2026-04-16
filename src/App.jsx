import { useState, useEffect, useRef } from "react";

const ORANGE = "#E8601C";
const ORANGE2 = "#F4A259";
const ORANGE_LIGHT = "#FFF5F0";
const RED = "#C0392B";
const GREEN = "#27AE60";
const BLUE = "#3498DB";
const GRAY = "#999";
const BG = "#FAFAFA";
const BORDER = "#F0F0F0";

const TREND_DATA = [
  { d: "Mar 17", v: 72 }, { d: "Mar 18", v: 74 }, { d: "Mar 19", v: 71 },
  { d: "Mar 20", v: 75 }, { d: "Mar 21", v: 78 }, { d: "Mar 22", v: 76 },
  { d: "Mar 23", v: 80 }, { d: "Mar 24", v: 79 }, { d: "Mar 25", v: 82 },
  { d: "Mar 26", v: 81 }, { d: "Mar 27", v: 83 }, { d: "Mar 28", v: 80 },
  { d: "Mar 29", v: 78 }, { d: "Mar 30", v: 82 }, { d: "Mar 31", v: 85 },
  { d: "Apr 1", v: 83 }, { d: "Apr 2", v: 81 }, { d: "Apr 3", v: 84 },
  { d: "Apr 4", v: 86 }, { d: "Apr 5", v: 85 }, { d: "Apr 6", v: 82 },
  { d: "Apr 7", v: 84 }, { d: "Apr 8", v: 87 }, { d: "Apr 9", v: 85 },
  { d: "Apr 10", v: 83 }, { d: "Apr 11", v: 86 }, { d: "Apr 12", v: 84 },
  { d: "Apr 13", v: 82 }, { d: "Apr 14", v: 85 }, { d: "Apr 15", v: 82 },
];

// Weekly leaderboard: user is 4th
const DRIVERS_WEEKLY = [
  { id: 1, name: "Chan Wing", ini: "CW", pts: 488 },
  { id: 2, name: "Lee Ka Ming", ini: "LK", pts: 475 },
  { id: 3, name: "Wong Ho", ini: "WH", pts: 461 },
  { id: 4, name: "You", ini: "YT", pts: 420, me: true },
  { id: 5, name: "Tsang Ming", ini: "TM", pts: 398 },
  { id: 6, name: "Lam Siu", ini: "LS", pts: 372 },
  { id: 7, name: "Ng Hoi", ini: "NH", pts: 355 },
  { id: 8, name: "Cheung Wai", ini: "CG", pts: 340 },
  { id: 9, name: "Fong Yip", ini: "FY", pts: 318 },
  { id: 10, name: "Yau Shing", ini: "YS", pts: 295 },
];

// Monthly leaderboard: user is 6th (different totals, different order)
const DRIVERS_MONTHLY = [
  { id: 2, name: "Lee Ka Ming", ini: "LK", pts: 1920 },
  { id: 1, name: "Chan Wing", ini: "CW", pts: 1885 },
  { id: 3, name: "Wong Ho", ini: "WH", pts: 1840 },
  { id: 5, name: "Tsang Ming", ini: "TM", pts: 1795 },
  { id: 6, name: "Lam Siu", ini: "LS", pts: 1740 },
  { id: 4, name: "You", ini: "YT", pts: 1680, me: true },
  { id: 7, name: "Ng Hoi", ini: "NH", pts: 1620 },
  { id: 8, name: "Cheung Wai", ini: "CG", pts: 1540 },
  { id: 9, name: "Fong Yip", ini: "FY", pts: 1480 },
  { id: 10, name: "Yau Shing", ini: "YS", pts: 1390 },
];

// Legacy compat
const DRIVERS = DRIVERS_WEEKLY;

const METRICS = [
  { name: "Hard braking", val: 75, color: ORANGE },
  { name: "Acceleration", val: 88, color: GREEN },
  { name: "Speeding", val: 70, color: RED },
  { name: "Sharp turns", val: 92, color: GREEN },
  { name: "Following dist.", val: 80, color: ORANGE },
];

const REWARDS_LIST = [
  { id: 1, icon: "⛽", name: "Fuel voucher HK$50", desc: "Shell / Caltex", cost: 800, bg: "#E8F5E9" },
  { id: 2, icon: "🍜", name: "Meal coupon HK$30", desc: "7-Eleven / Circle K", cost: 500, bg: "#FFF3E0" },
  { id: 3, icon: "📱", name: "Phone top-up HK$20", desc: "Any HK carrier", cost: 350, bg: "#E3F2FD" },
  { id: 4, icon: "🎯", name: "Priority rest day", desc: "Pick your off day", cost: 2000, bg: "#F3E5F5" },
  { id: 5, icon: "🏆", name: "Gold driver badge", desc: "Display on vehicle", cost: 3000, bg: ORANGE_LIGHT },
];

const BADGES = [
  { icon: "7", name: "7 days above 80", unlocked: true, color: ORANGE },
  { icon: "0", name: "Zero speeding", unlocked: true, color: GREEN },
  { icon: "↑", name: "Most improved", unlocked: true, color: BLUE },
  { icon: "★", name: "1st place weekly", unlocked: true, color: ORANGE },
  { icon: "30", name: "30-day streak", unlocked: true, color: GREEN },
  { icon: "90", name: "Score above 90", unlocked: false },
  { icon: "⚡", name: "Zero hard brakes", unlocked: false },
  { icon: "3", name: "Top 3 monthly", unlocked: false },
  { icon: "∞", name: "100-day streak", unlocked: false },
];

const DRIVE_EVENTS = [
  { type: "bad", text: "Hard braking detected", pts: -30, time: 3 },
  { type: "warn", text: "Following distance too close", pts: -20, time: 8 },
  { type: "good", text: "Smooth acceleration", pts: 0, time: 13 },
  { type: "near", text: "Near miss: 49 km/h in 50 zone", pts: 0, time: 18 },
  { type: "bad", text: "Speeding: 58 in 50 zone", pts: -25, time: 24 },
  { type: "good", text: "Safe lane change", pts: 0, time: 29 },
  { type: "near", text: "Near miss: braking 0.38g (limit 0.4g)", pts: 0, time: 35 },
  { type: "warn", text: "Sharp turn detected", pts: -15, time: 40 },
  { type: "good", text: "Maintained safe distance", pts: 0, time: 46 },
];

const LANGS = { en: "English", zh_hant: "繁體中文", zh_hans: "简体中文" };

const TEXTS = {
  en: {
    home: "Home", drive: "Drive", rank: "Rank", rewards: "Rewards", me: "Me",
    thisWeek: "This week's safety points", startedWith: "Started with 500",
    todayLoss: "Points lost today", todayKeep: "Points kept today",
    safetyScore: "Safety score", trend: "30-day safety score trend",
    tapTip: "Tap any point for details",
    tapMetricTip: "Tap a metric to see its individual score",
    streak: "day safe driving streak", keepGoing: "Keep it going!",
    challenge: "Weekly challenge", challengeDesc: "Zero hard braking all week",
    challengeReward: "+100 bonus points", progress: "Progress",
    startTrip: "Start trip", endTrip: "End trip", monitoring: "Monitoring",
    ptsLeft: "Points remaining", liveEvents: "Live events",
    waitDrive: "Monitoring your driving...",
    tripDone: "Trip summary", duration: "Duration", dist: "Distance",
    ptsLost: "Points lost", ptsKept: "Points kept", safeEv: "Safe events",
    dangerEv: "Danger events", nearEv: "Near misses", goBack: "Done",
    chat: "Chat with AI Coach",
    board: "Leaderboard", weekly: "Weekly", monthly: "Monthly",
    rankBy: "Ranked by points kept out of 500", pts: "pts",
    availPts: "Available points", lifetime: "Lifetime earned", redeem: "Redeem points",
    redeemed: "Redeemed", almost: "Almost there!", moreFor: "more for",
    profile: "Profile", safetyPts: "Points", fleetRank: "Fleet rank",
    lifetimePts: "Lifetime pts", daysActive: "Days active", badges: "Badges",
    sos: "Emergency SOS", achievements: "Achievements", unlocked: "unlocked",
    emergency: "Emergency", needHelp: "Need help?", emer: "Emergency", police: "Police",
    operator: "Operator hotline",
    settings: "Settings", language: "Language", notifs: "Notifications",
    display: "Display style", about: "About SafeDrive",
    showLoss: "Show points lost", showKeep: "Show points kept",
    aiCoach: "AI Coach", askMe: "Ask me anything...",
    coachHi: "Hi! I'm your AI driving coach. Ask me about routes, driving tips, or your safety performance.",
    braking: "Braking", speed: "Speed", distance: "Distance",
    of: "of", score: "Score",
    calling: "Calling...", connected: "Connected", mute: "Mute",
    keypad: "Keypad", speaker: "Speaker", endCall: "End",
    overall: "Overall",
  },
  zh_hant: {
    home: "主頁", drive: "駕駛", rank: "排名", rewards: "獎賞", me: "我的",
    thisWeek: "本週安全積分", startedWith: "起始 500 分",
    todayLoss: "今日扣分明細", todayKeep: "今日保留積分",
    safetyScore: "安全評分", trend: "30天安全評分趨勢",
    tapTip: "點擊數據點查看詳情",
    tapMetricTip: "點擊維度查看單項分數",
    streak: "天安全駕駛連續", keepGoing: "繼續保持！",
    challenge: "每週挑戰", challengeDesc: "全週零急煞車",
    challengeReward: "+100 獎勵積分", progress: "進度",
    startTrip: "開始行程", endTrip: "結束行程", monitoring: "監測中",
    ptsLeft: "剩餘積分", liveEvents: "實時事件",
    waitDrive: "正在監測駕駛...",
    tripDone: "行程總結", duration: "時長", dist: "距離",
    ptsLost: "扣除積分", ptsKept: "保留積分", safeEv: "安全事件",
    dangerEv: "危險事件", nearEv: "險情次數", goBack: "完成",
    chat: "與 AI 教練對話",
    board: "排行榜", weekly: "週榜", monthly: "月榜",
    rankBy: "以 500 分中保留積分排名", pts: "分",
    availPts: "可用積分", lifetime: "累計獲得", redeem: "兌換獎賞",
    redeemed: "已兌換", almost: "快達到了！", moreFor: "分即可兌換",
    profile: "個人資料", safetyPts: "積分", fleetRank: "車隊排名",
    lifetimePts: "累計積分", daysActive: "活躍天數", badges: "徽章",
    sos: "緊急求助", achievements: "成就", unlocked: "已解鎖",
    emergency: "緊急求助", needHelp: "需要幫助？", emer: "緊急電話", police: "警察",
    operator: "營運商熱線",
    settings: "設定", language: "語言", notifs: "通知",
    display: "展示方式", about: "關於 SafeDrive",
    showLoss: "顯示扣分", showKeep: "顯示保留分",
    aiCoach: "AI 教練", askMe: "問我任何問題...",
    coachHi: "你好！我是你的 AI 駕駛教練。可以問我路線建議、駕駛技巧或安全表現。",
    braking: "煞車", speed: "車速", distance: "車距",
    of: "之", score: "分數",
    calling: "正在撥打...", connected: "通話中", mute: "靜音",
    keypad: "鍵盤", speaker: "揚聲器", endCall: "結束",
    overall: "總分",
  },
  zh_hans: {
    home: "主页", drive: "驾驶", rank: "排名", rewards: "奖励", me: "我的",
    thisWeek: "本周安全积分", startedWith: "起始 500 分",
    todayLoss: "今日扣分明细", todayKeep: "今日保留积分",
    safetyScore: "安全评分", trend: "30天安全评分趋势",
    tapTip: "点击数据点查看详情",
    tapMetricTip: "点击维度查看单项分数",
    streak: "天安全驾驶连续", keepGoing: "继续保持！",
    challenge: "每周挑战", challengeDesc: "全周零急刹车",
    challengeReward: "+100 奖励积分", progress: "进度",
    startTrip: "开始行程", endTrip: "结束行程", monitoring: "监测中",
    ptsLeft: "剩余积分", liveEvents: "实时事件",
    waitDrive: "正在监测驾驶...",
    tripDone: "行程总结", duration: "时长", dist: "距离",
    ptsLost: "扣除积分", ptsKept: "保留积分", safeEv: "安全事件",
    dangerEv: "危险事件", nearEv: "险情次数", goBack: "完成",
    chat: "与 AI 教练对话",
    board: "排行榜", weekly: "周榜", monthly: "月榜",
    rankBy: "以 500 分中保留积分排名", pts: "分",
    availPts: "可用积分", lifetime: "累计获得", redeem: "兑换奖励",
    redeemed: "已兑换", almost: "快达到了！", moreFor: "分即可兑换",
    profile: "个人资料", safetyPts: "积分", fleetRank: "车队排名",
    lifetimePts: "累计积分", daysActive: "活跃天数", badges: "徽章",
    sos: "紧急求助", achievements: "成就", unlocked: "已解锁",
    emergency: "紧急求助", needHelp: "需要帮助？", emer: "紧急电话", police: "警察",
    operator: "运营商热线",
    settings: "设定", language: "语言", notifs: "通知",
    display: "展示方式", about: "关于 SafeDrive",
    showLoss: "显示扣分", showKeep: "显示保留分",
    aiCoach: "AI 教练", askMe: "问我任何问题...",
    coachHi: "你好！我是你的 AI 驾驶教练。可以问我路线建议、驾驶技巧或安全表现。",
    braking: "刹车", speed: "车速", distance: "车距",
    of: "之", score: "分数",
    calling: "正在拨打...", connected: "通话中", mute: "静音",
    keypad: "键盘", speaker: "扬声器", endCall: "结束",
    overall: "总分",
  },
};

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px 4px", fontSize: 13, fontWeight: 600, color: "#333" }}>
      <span>9:41</span>
      <span style={{ fontSize: 12, color: GRAY }}>5G ●●●</span>
    </div>
  );
}

function TabBar({ active, setTab, t }) {
  const tabs = [
    { key: "home", icon: "🏠", label: t.home },
    { key: "drive", icon: "🚐", label: t.drive },
    { key: "rank", icon: "🏅", label: t.rank },
    { key: "rewards", icon: "🎁", label: t.rewards },
    { key: "me", icon: "👤", label: t.me },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 76, background: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 12, zIndex: 100 }}>
      {tabs.map((tab) => (
        <div key={tab.key} onClick={() => setTab(tab.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", flex: 1, padding: "6px 0" }}>
          <span style={{ fontSize: 20, opacity: active === tab.key ? 1 : 0.35 }}>{tab.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: active === tab.key ? ORANGE : "#ccc" }}>{tab.label}</span>
        </div>
      ))}
    </div>
  );
}

function InteractiveTrend({ t }) {
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);
  const W = 340, H = 120, P = 20;
  const vals = TREND_DATA.map(d => d.v);
  const maxV = Math.max(...vals);
  const minV = Math.min(...vals);

  const getXY = (i) => ({
    x: P + (i / (TREND_DATA.length - 1)) * (W - P * 2),
    y: P + ((maxV - TREND_DATA[i].v) / (maxV - minV || 1)) * (H - P * 2),
  });

  const pointsStr = TREND_DATA.map((_, i) => {
    const p = getXY(i);
    return p.x + "," + p.y;
  }).join(" ");

  const lastXY = getXY(TREND_DATA.length - 1);
  const areaStr = pointsStr + " " + lastXY.x + "," + (H - 5) + " " + P + "," + (H - 5);

  const handleMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const x = ((cx - rect.left) / rect.width) * W;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < TREND_DATA.length; i++) {
      const d = Math.abs(x - getXY(i).x);
      if (d < minDist) { minDist = d; closest = i; }
    }
    setHover(closest);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 12, border: "1px solid " + BORDER, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 2 }}>{t.trend}</div>
      <div style={{ fontSize: 11, color: GRAY, marginBottom: 8 }}>{t.tapTip}</div>
      <svg ref={svgRef} viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: 120, cursor: "crosshair", touchAction: "none" }} onMouseMove={handleMove} onTouchMove={handleMove} onMouseLeave={() => setHover(null)} onTouchEnd={() => setHover(null)} onClick={handleMove}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.15" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[minV, Math.round((minV + maxV) / 2), maxV].map((v) => {
          const y = P + ((maxV - v) / (maxV - minV || 1)) * (H - P * 2);
          return (
            <g key={v}>
              <line x1={P} y1={y} x2={W - P} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={P - 4} y={y + 4} fontSize="9" fill={GRAY} textAnchor="end">{v}</text>
            </g>
          );
        })}
        <polygon points={areaStr} fill="url(#trendFill)" />
        <polyline points={pointsStr} fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {hover !== null && (
          <g>
            <line x1={getXY(hover).x} y1={P} x2={getXY(hover).x} y2={H - 5} stroke={ORANGE} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
            <circle cx={getXY(hover).x} cy={getXY(hover).y} r="5" fill={ORANGE} stroke="#fff" strokeWidth="2" />
            <rect x={getXY(hover).x - 38} y={getXY(hover).y - 34} width="76" height="24" rx="6" fill="#333" />
            <text x={getXY(hover).x} y={getXY(hover).y - 18} fontSize="11" fill="#fff" textAnchor="middle" fontWeight="600">
              {TREND_DATA[hover].d}: {TREND_DATA[hover].v}
            </text>
          </g>
        )}
        <text x={P} y={H} fontSize="9" fill={GRAY}>{TREND_DATA[0].d}</text>
        <text x={W - P} y={H} fontSize="9" fill={GRAY} textAnchor="end">{TREND_DATA[TREND_DATA.length - 1].d}</text>
      </svg>
    </div>
  );
}

// Interactive safety score with hover-aware center circle
function SafetyScoreCard({ t }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const displayMetric = activeIdx !== null ? METRICS[activeIdx] : null;
  const displayVal = displayMetric ? displayMetric.val : 82;
  const displayColor = displayMetric ? displayMetric.color : ORANGE;
  const displayLabel = displayMetric ? displayMetric.name : t.overall;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid " + BORDER, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", border: "6px solid " + displayColor, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexShrink: 0, transition: "border-color 0.3s" }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: displayColor, lineHeight: 1, transition: "color 0.3s" }}>{displayVal}</span>
          <span style={{ fontSize: 9, color: GRAY, marginTop: 2 }}>/ 100</span>
          <span style={{ fontSize: 9, color: GRAY, marginTop: 2, maxWidth: 80, textAlign: "center", lineHeight: 1.1 }}>{displayLabel}</span>
        </div>
        <div style={{ flex: 1 }}>
          {METRICS.map((m, i) => (
            <div
              key={m.name}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 6px", margin: "2px 0",
                borderRadius: 6, cursor: "pointer",
                background: activeIdx === i ? ORANGE_LIGHT : "transparent",
                transition: "background 0.2s",
              }}>
              <span style={{ fontSize: 11, color: activeIdx === i ? ORANGE : "#888", width: 78, flexShrink: 0, fontWeight: activeIdx === i ? 600 : 400 }}>{m.name}</span>
              <div style={{ flex: 1, height: 5, background: "#f0f0f0", borderRadius: 3 }}>
                <div style={{ width: m.val + "%", height: 5, background: m.color, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, color: activeIdx === i ? ORANGE : "#555", width: 24, textAlign: "right", fontWeight: 600 }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 10, color: GRAY, textAlign: "center", marginTop: 8 }}>{t.tapMetricTip}</div>
    </div>
  );
}

// ===== Google Maps style map (idle and live) =====
function GoogleStyleMap({ progress = null, height = 200 }) {
  // Shared map layout. If progress is provided, show animated car. Otherwise static route preview.
  const waypoints = [
    { x: 52, y: 260 }, { x: 88, y: 235 }, { x: 112, y: 210 },
    { x: 138, y: 178 }, { x: 168, y: 152 }, { x: 192, y: 132 },
    { x: 218, y: 110 }, { x: 248, y: 88 }, { x: 280, y: 70 },
    { x: 314, y: 54 },
  ];
  let carX = null, carY = null, angle = 0, pct = 0;
  if (progress !== null) {
    pct = Math.max(0, Math.min(progress, 1));
    const idx = Math.min(Math.floor(pct * (waypoints.length - 1)), waypoints.length - 2);
    const frac = pct * (waypoints.length - 1) - idx;
    const curr = waypoints[idx];
    const next = waypoints[idx + 1];
    carX = curr.x + (next.x - curr.x) * frac;
    carY = curr.y + (next.y - curr.y) * frac;
    angle = Math.atan2(next.y - curr.y, next.x - curr.x) * 180 / Math.PI;
  }

  const pathD = "M 52 260 Q 100 230 138 178 T 218 110 Q 260 85 314 54";
  const totalLen = 420;
  const dashedOffset = progress !== null ? pct * totalLen : 0;

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, height, background: "#EBE3D5", position: "relative", border: "1px solid " + BORDER }}>
      <svg viewBox="0 0 360 300" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
        {/* Base land */}
        <rect width="360" height="300" fill="#F5F1E8" />

        {/* Water - harbour on the left */}
        <path d="M 0 0 L 35 0 Q 30 40 38 80 Q 25 130 30 180 Q 20 230 25 300 L 0 300 Z" fill="#A8D5E8" />
        <path d="M 320 260 Q 340 270 360 275 L 360 300 L 310 300 Z" fill="#A8D5E8" />

        {/* Parks / green areas */}
        <path d="M 200 0 L 260 0 L 265 30 Q 255 50 240 48 L 210 42 Z" fill="#C8E0B8" />
        <path d="M 100 50 Q 130 55 140 70 Q 135 95 115 100 Q 95 95 90 75 Z" fill="#C8E0B8" />
        <path d="M 280 180 Q 310 175 320 195 Q 315 220 295 225 Q 275 220 272 200 Z" fill="#C8E0B8" />

        {/* Blocks (subtle grid tint) */}
        <rect x="45" y="130" width="60" height="28" fill="#EEE7D5" opacity="0.7" />
        <rect x="115" y="105" width="50" height="25" fill="#EEE7D5" opacity="0.7" />
        <rect x="175" y="75" width="50" height="30" fill="#EEE7D5" opacity="0.7" />
        <rect x="235" y="230" width="55" height="30" fill="#EEE7D5" opacity="0.7" />
        <rect x="55" y="220" width="45" height="30" fill="#EEE7D5" opacity="0.7" />

        {/* Main highway (yellow/orange) - Tuen Mun Road */}
        <path d="M 0 210 Q 60 200 120 180 Q 200 150 280 110 Q 330 85 360 70" stroke="#F4C95D" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M 0 210 Q 60 200 120 180 Q 200 150 280 110 Q 330 85 360 70" stroke="#E8A62A" strokeWidth="15" fill="none" strokeLinecap="round" opacity="0.35" />
        <path d="M 0 210 Q 60 200 120 180 Q 200 150 280 110 Q 330 85 360 70" stroke="#FFE8AB" strokeWidth="10" fill="none" strokeLinecap="round" />

        {/* Arterial roads (white with gray border) */}
        <path d="M 40 40 L 90 130 L 150 200 L 220 280" stroke="#D4CCB8" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 40 40 L 90 130 L 150 200 L 220 280" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" />

        <path d="M 340 10 L 310 80 L 265 140 L 230 210 L 200 290" stroke="#D4CCB8" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 340 10 L 310 80 L 265 140 L 230 210 L 200 290" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Local streets (thin white) */}
        <line x1="60" y1="280" x2="300" y2="20" stroke="#E5DDC8" strokeWidth="4" />
        <line x1="60" y1="280" x2="300" y2="20" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="100" y1="290" x2="340" y2="100" stroke="#E5DDC8" strokeWidth="4" />
        <line x1="100" y1="290" x2="340" y2="100" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="20" y1="110" x2="290" y2="260" stroke="#E5DDC8" strokeWidth="3.5" />
        <line x1="20" y1="110" x2="290" y2="260" stroke="#FFFFFF" strokeWidth="2" />

        {/* Route on top of roads */}
        <path d={pathD} stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
        {progress !== null ? (
          <>
            {/* Upcoming (dashed gray-blue) */}
            <path d={pathD} stroke="#7B8FB3" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="9,5" opacity="0.6" />
            {/* Completed (solid blue) */}
            <path d={pathD} stroke="#1E6CD8" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={dashedOffset + " " + totalLen} />
          </>
        ) : (
          <path d={pathD} stroke="#1E6CD8" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="10,5" opacity="0.85" />
        )}

        {/* Start marker */}
        <circle cx="52" cy="260" r="10" fill="#FFFFFF" stroke="#1E6CD8" strokeWidth="3" />
        <circle cx="52" cy="260" r="4" fill="#1E6CD8" />

        {/* End marker (pin) */}
        <g transform="translate(314, 54)">
          <path d="M 0 -20 C -8 -20 -12 -14 -12 -8 C -12 0 0 10 0 10 C 0 10 12 0 12 -8 C 12 -14 8 -20 0 -20 Z" fill="#DB4437" stroke="#fff" strokeWidth="1.5" />
          <circle cx="0" cy="-10" r="4" fill="#fff" />
        </g>

        {/* Place labels */}
        <text x="68" y="275" fontSize="10" fill="#3C3C3C" fontWeight="600" fontFamily="Arial">Tsuen Wan</text>
        <text x="265" y="40" fontSize="10" fill="#3C3C3C" fontWeight="600" fontFamily="Arial">Tuen Mun</text>
        <text x="175" y="170" fontSize="9" fill="#8A6A1F" fontWeight="500" fontStyle="italic">Tuen Mun Rd</text>
        <text x="110" y="80" fontSize="8" fill="#4A7A30" fontStyle="italic">Tai Lam Park</text>
        <text x="8" y="150" fontSize="8" fill="#2E6F8A" fontStyle="italic">Rambler Chan.</text>

        {/* Car marker (only when driving) */}
        {progress !== null && carX !== null && (
          <g transform={"translate(" + carX + ", " + carY + ")"}>
            <circle r="13" fill="#1E6CD8" opacity="0.2" />
            <circle r="9" fill="#1E6CD8" stroke="#fff" strokeWidth="2.5" />
            <g transform={"rotate(" + angle + ")"}>
              <polygon points="-2,-5 5,0 -2,5" fill="#fff" />
            </g>
          </g>
        )}
      </svg>

      {/* Google-style overlay badge */}
      <div style={{ position: "absolute", top: 10, right: 10, background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: "#5F6368", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
        Map
      </div>
      {/* Scale bar */}
      <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 10, color: "#5F6368", background: "rgba(255,255,255,0.9)", padding: "2px 8px", borderRadius: 4 }}>
        <span style={{ borderBottom: "2px solid #5F6368", paddingBottom: 1 }}>2 km</span>
      </div>

      {progress !== null && (
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: "#333", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
            🚐 {(pct * 18.5).toFixed(1)} km
          </div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: "#1E6CD8", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
            ETA {Math.max(0, Math.round((1 - pct) * 25))} min
          </div>
        </div>
      )}
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleOtp = (val, idx) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) refs[idx + 1].current && refs[idx + 1].current.focus();
    if (next.every(d => d !== "")) setTimeout(onLogin, 400);
  };

  if (step === 0) {
    return (
      <div style={{ minHeight: "100%", background: "linear-gradient(160deg, " + ORANGE + " 0%, " + ORANGE2 + " 50%, #FFD19A 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40 }}>
        <div style={{ width: 100, height: 100, borderRadius: 28, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 20 }}>🚐</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 6 }}>SafeDrive</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 40, textAlign: "center", lineHeight: 1.5 }}>
          Smart safety companion for<br />Hong Kong minibus drivers
        </div>
        <button onClick={() => setStep(1)} style={{ background: "#fff", color: ORANGE, border: "none", borderRadius: 28, padding: "16px 56px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Get started
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div style={{ padding: "80px 24px", minHeight: "100%", background: "#fff" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#222", marginBottom: 8 }}>Welcome 👋</div>
        <div style={{ fontSize: 15, color: GRAY, marginBottom: 36 }}>Enter your phone number to sign in</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ background: BG, borderRadius: 14, padding: "15px 16px", fontSize: 16, color: "#555", border: "1.5px solid " + BORDER }}>+852</div>
          <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ flex: 1, border: "1.5px solid " + BORDER, borderRadius: 14, padding: "15px 16px", fontSize: 16, outline: "none", background: BG }} />
        </div>
        <div style={{ fontSize: 13, color: GRAY, marginBottom: 36 }}>We'll send a verification code</div>
        <button onClick={() => setStep(2)} style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 28, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%" }}>
          Send code
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "80px 24px", minHeight: "100%", background: "#fff" }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#222", marginBottom: 8 }}>Enter code 🔐</div>
      <div style={{ fontSize: 15, color: GRAY, marginBottom: 36 }}>Sent to +852 {phone || "XXXX XXXX"}</div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 36 }}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            maxLength={1}
            value={d}
            onChange={(e) => handleOtp(e.target.value, i)}
            style={{ width: 60, height: 68, textAlign: "center", fontSize: 26, fontWeight: 700, border: "2px solid " + (d ? ORANGE : BORDER), borderRadius: 16, outline: "none", background: d ? ORANGE_LIGHT : "#fff" }}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 14, color: GRAY }}>
        Didn't receive? <span style={{ color: ORANGE, fontWeight: 600, cursor: "pointer" }}>Resend</span>
      </div>
    </div>
  );
}

function HomePage({ t, showLoss }) {
  return (
    <div>
      <StatusBar />
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#222", margin: "8px 0 16px" }}>{t.home}</div>

        <div style={{ background: "linear-gradient(135deg, " + ORANGE + ", " + ORANGE2 + ")", borderRadius: 22, padding: 22, color: "#fff", position: "relative", marginBottom: 14 }}>
          <div style={{ position: "absolute", top: 16, right: 18, background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "4px 14px", fontSize: 11 }}>Week 14</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{t.thisWeek}</div>
          <div style={{ fontSize: 46, fontWeight: 800, margin: "4px 0", letterSpacing: -1 }}>420</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>{t.startedWith}</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF9F1C)", borderRadius: 16, padding: "14px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 36 }}>🔥</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>12 {t.streak}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{t.keepGoing}</div>
          </div>
        </div>

        {showLoss ? (
          <div style={{ background: ORANGE_LIGHT, border: "1.5px solid #FDDDD0", borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: RED, fontWeight: 700, marginBottom: 8 }}>📉 {t.todayLoss}</div>
            {[["Hard braking · Tuen Mun Rd", -30], ["Following distance", -20], ["Speeding · Castle Peak Rd", -30]].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 4 }}>
                <span>{item[0]}</span>
                <span style={{ color: RED, fontWeight: 700 }}>{item[1]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#F0FAF0", border: "1.5px solid #C8E6C9", borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: GREEN, fontWeight: 700, marginBottom: 8 }}>📈 {t.todayKeep}</div>
            {[["Smooth acceleration all morning", "+150"], ["No sharp turn events", "+120"], ["Safe following distance", "+80"]].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 4 }}>
                <span>{item[0]}</span>
                <span style={{ color: GREEN, fontWeight: 700 }}>{item[1]}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid " + BORDER, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>🎯 {t.challenge}</div>
            <div style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>{t.challengeReward}</div>
          </div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{t.challengeDesc}</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < 5 ? GREEN : "#f0f0f0" }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: GRAY }}>{t.progress}: 5/7</div>
        </div>

        <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "16px 0 8px" }}>{t.safetyScore}</div>
        <SafetyScoreCard t={t} />

        <InteractiveTrend t={t} />
      </div>
    </div>
  );
}

// ===== VISUAL TIP CARD COMPONENT =====
// Renders AI's JSON response as a visual tip card with SVG illustration

const FALLBACK_CARDS = {
  brake: { title: "Smooth Braking", icon: "🛑", color: "red", visual: "brake", tips: ["Scan 200m ahead", "Lift gas before corners", "Keep 3-second gap"], encouragement: "Small changes, big score boost!" },
  distance: { title: "Safe Distance", icon: "🚗", color: "orange", visual: "distance", tips: ["Count '1-2-3' after front car", "Double gap in rain", "More gap at high speed"], encouragement: "Distance = safety + points saved!" },
  speed: { title: "Speed Control", icon: "🚦", color: "red", visual: "speed", tips: ["Watch speed limit signs", "Use cruise on highway", "Slow before zone changes"], encouragement: "Consistency beats speed every time." },
  score: { title: "Your Score: 82", icon: "📊", color: "orange", visual: "score", tips: ["+5 pts: cut hard brakes to 0", "+3 pts: keep 3-sec gap", "+4 pts: no speeding week"], encouragement: "You can reach 90+ this month!" },
  leaderboard: { title: "Climb Rank", icon: "🏆", color: "orange", visual: "score", tips: ["41 pts to overtake Wong Ho", "Focus on braking & distance", "Stay consistent all week"], encouragement: "Top 3 is within reach!" },
  turn: { title: "Safe Turning", icon: "↪️", color: "orange", visual: "turn", tips: ["Slow before entering turn", "Smooth steering input", "Accelerate gently out"], encouragement: "Smooth turns = happy passengers." },
  scan: { title: "Scan Ahead", icon: "👀", color: "blue", visual: "scan", tips: ["Look 200m forward", "Check mirrors every 5 sec", "Watch for lane changes"], encouragement: "Prediction prevents deductions." },
  tuenmun: { title: "Tuen Mun Rd", icon: "🛣️", color: "orange", visual: "lane", tips: ["Watch Sham Tseng curve", "Early slow on downhill", "Extra gap in tunnels"], encouragement: "Your toughest route — master it!" },
  default: { title: "Drive Safe", icon: "💡", color: "blue", visual: "score", tips: ["Keep safe distance", "Smooth braking", "Stay within speed limit"], encouragement: "You're doing great — keep it up!" },
};

function pickFallbackCard(question) {
  const q = question.toLowerCase();
  if (q.includes("brak") || q.includes("煞") || q.includes("刹")) return FALLBACK_CARDS.brake;
  if (q.includes("distance") || q.includes("follow") || q.includes("車距") || q.includes("车距") || q.includes("跟车") || q.includes("跟車")) return FALLBACK_CARDS.distance;
  if (q.includes("speed") || q.includes("速") || q.includes("快")) return FALLBACK_CARDS.speed;
  if (q.includes("score") || q.includes("分")) return FALLBACK_CARDS.score;
  if (q.includes("leaderboard") || q.includes("rank") || q.includes("排") || q.includes("榜")) return FALLBACK_CARDS.leaderboard;
  if (q.includes("turn") || q.includes("轉") || q.includes("转") || q.includes("彎") || q.includes("弯")) return FALLBACK_CARDS.turn;
  if (q.includes("tuen mun") || q.includes("屯門") || q.includes("屯门")) return FALLBACK_CARDS.tuenmun;
  if (q.includes("scan") || q.includes("ahead") || q.includes("look")) return FALLBACK_CARDS.scan;
  return FALLBACK_CARDS.default;
}

function TipVisual({ type, color }) {
  const mainColor = color === "red" ? "#C0392B" : color === "green" ? "#27AE60" : color === "blue" ? "#3498DB" : "#E8601C";
  const lightColor = color === "red" ? "#FFEBEB" : color === "green" ? "#E8F5E9" : color === "blue" ? "#E3F2FD" : "#FFF5F0";

  if (type === "distance") {
    return (
      <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
        <rect width="280" height="100" fill={lightColor} rx="8" />
        {/* Road */}
        <rect x="10" y="55" width="260" height="30" fill="#D5CFC0" rx="2" />
        <line x1="10" y1="70" x2="270" y2="70" stroke="#fff" strokeWidth="2" strokeDasharray="10,8" />
        {/* Front car */}
        <rect x="200" y="45" width="50" height="28" rx="6" fill="#555" />
        <rect x="208" y="50" width="34" height="14" rx="2" fill="#AEE1FF" />
        <circle cx="210" cy="75" r="5" fill="#222" />
        <circle cx="240" cy="75" r="5" fill="#222" />
        {/* Your car */}
        <rect x="40" y="45" width="50" height="28" rx="6" fill={mainColor} />
        <rect x="48" y="50" width="34" height="14" rx="2" fill="#AEE1FF" />
        <circle cx="50" cy="75" r="5" fill="#222" />
        <circle cx="80" cy="75" r="5" fill="#222" />
        {/* Gap arrow */}
        <line x1="95" y1="40" x2="195" y2="40" stroke={mainColor} strokeWidth="2" markerEnd="url(#ar)" markerStart="url(#ar)" />
        <defs>
          <marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <polygon points="0,0 8,4 0,8" fill={mainColor} />
          </marker>
        </defs>
        <rect x="118" y="26" width="54" height="18" fill="#fff" stroke={mainColor} strokeWidth="1.5" rx="4" />
        <text x="145" y="39" fontSize="11" fill={mainColor} textAnchor="middle" fontWeight="700">3 sec</text>
      </svg>
    );
  }

  if (type === "brake") {
    return (
      <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
        <rect width="280" height="100" fill={lightColor} rx="8" />
        <rect x="10" y="60" width="260" height="25" fill="#D5CFC0" rx="2" />
        {/* Car */}
        <rect x="40" y="48" width="56" height="30" rx="6" fill={mainColor} />
        <rect x="48" y="53" width="40" height="14" rx="2" fill="#AEE1FF" />
        <circle cx="52" cy="80" r="5" fill="#222" />
        <circle cx="86" cy="80" r="5" fill="#222" />
        {/* Smooth deceleration bar */}
        <text x="140" y="30" fontSize="11" fill="#555" fontWeight="600">Smooth braking zone</text>
        <rect x="130" y="40" width="130" height="10" fill="#fff" stroke="#ccc" strokeWidth="1" rx="5" />
        <rect x="130" y="40" width="130" height="10" fill="url(#brakeGrad)" rx="5" />
        <defs>
          <linearGradient id="brakeGrad">
            <stop offset="0%" stopColor="#27AE60" />
            <stop offset="60%" stopColor="#F4A259" />
            <stop offset="100%" stopColor={mainColor} />
          </linearGradient>
        </defs>
        <text x="132" y="62" fontSize="9" fill="#27AE60" fontWeight="600">Lift gas</text>
        <text x="188" y="62" fontSize="9" fill="#F4A259" fontWeight="600">Gentle</text>
        <text x="230" y="62" fontSize="9" fill={mainColor} fontWeight="600">Stop</text>
      </svg>
    );
  }

  if (type === "speed") {
    return (
      <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
        <rect width="280" height="100" fill={lightColor} rx="8" />
        {/* Speed sign */}
        <circle cx="80" cy="50" r="36" fill="#fff" stroke={mainColor} strokeWidth="5" />
        <text x="80" y="58" fontSize="24" fill="#222" textAnchor="middle" fontWeight="800">50</text>
        <text x="80" y="94" fontSize="10" fill="#666" textAnchor="middle">Speed limit</text>
        {/* Gauge */}
        <g transform="translate(180, 50)">
          <path d="M -40 0 A 40 40 0 0 1 40 0" fill="none" stroke="#ddd" strokeWidth="8" />
          <path d="M -40 0 A 40 40 0 0 1 20 -35" fill="none" stroke={mainColor} strokeWidth="8" strokeLinecap="round" />
          <circle r="4" fill="#222" />
          <line x1="0" y1="0" x2="16" y2="-28" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
          <text y="20" fontSize="12" fill="#222" textAnchor="middle" fontWeight="700">48 km/h</text>
          <text y="42" fontSize="9" fill="#27AE60" textAnchor="middle" fontWeight="600">✓ Safe</text>
        </g>
      </svg>
    );
  }

  if (type === "score") {
    return (
      <svg viewBox="0 0 280 110" style={{ width: "100%", height: 100 }}>
        <rect width="280" height="110" fill={lightColor} rx="8" />
        <circle cx="60" cy="48" r="28" fill="none" stroke="#eee" strokeWidth="7" />
        <circle cx="60" cy="48" r="28" fill="none" stroke={mainColor} strokeWidth="7" strokeDasharray="144 176" strokeLinecap="round" transform="rotate(-90 60 48)" />
        <text x="60" y="54" fontSize="20" fill={mainColor} textAnchor="middle" fontWeight="800">82</text>
        <text x="60" y="94" fontSize="10" fill="#666" textAnchor="middle" fontWeight="600">Current</text>
        {/* Arrow */}
        <path d="M 110 48 L 150 48" stroke={mainColor} strokeWidth="2.5" markerEnd="url(#scoreAr)" />
        <defs>
          <marker id="scoreAr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <polygon points="0,0 10,5 0,10" fill={mainColor} />
          </marker>
        </defs>
        {/* Target */}
        <circle cx="200" cy="48" r="28" fill="none" stroke="#eee" strokeWidth="7" />
        <circle cx="200" cy="48" r="28" fill="none" stroke="#27AE60" strokeWidth="7" strokeDasharray="158 176" strokeLinecap="round" transform="rotate(-90 200 48)" />
        <text x="200" y="54" fontSize="20" fill="#27AE60" textAnchor="middle" fontWeight="800">90</text>
        <text x="200" y="94" fontSize="10" fill="#666" textAnchor="middle" fontWeight="600">Target</text>
      </svg>
    );
  }

  if (type === "lane") {
    return (
      <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
        <rect width="280" height="100" fill={lightColor} rx="8" />
        <path d="M 20 90 Q 140 10 270 40" stroke="#D5CFC0" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M 20 90 Q 140 10 270 40" stroke="#fff" strokeWidth="2" strokeDasharray="10,8" fill="none" />
        <rect x="50" y="70" width="36" height="22" rx="4" fill={mainColor} transform="rotate(-15 68 81)" />
        <text x="170" y="28" fontSize="11" fill="#666" fontWeight="600">Sham Tseng curve</text>
        <path d="M 168 35 L 180 45" stroke="#666" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === "turn") {
    return (
      <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
        <rect width="280" height="100" fill={lightColor} rx="8" />
        <path d="M 30 80 L 120 80 Q 160 80 160 40 L 160 15" stroke="#D5CFC0" strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M 30 80 L 120 80 Q 160 80 160 40 L 160 15" stroke="#fff" strokeWidth="2" strokeDasharray="8,6" fill="none" />
        <rect x="50" y="70" width="32" height="20" rx="4" fill={mainColor} />
        {/* Slow sign */}
        <rect x="200" y="35" width="60" height="30" fill="#FFE4B5" stroke={mainColor} strokeWidth="2" rx="4" />
        <text x="230" y="55" fontSize="12" fill={mainColor} textAnchor="middle" fontWeight="700">SLOW</text>
      </svg>
    );
  }

  if (type === "scan") {
    return (
      <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
        <rect width="280" height="100" fill={lightColor} rx="8" />
        <rect x="10" y="60" width="260" height="30" fill="#D5CFC0" rx="2" />
        <line x1="10" y1="75" x2="270" y2="75" stroke="#fff" strokeWidth="2" strokeDasharray="10,8" />
        <rect x="30" y="50" width="46" height="26" rx="5" fill={mainColor} />
        {/* Eyes / vision cone */}
        <path d="M 76 63 L 260 30 L 260 50 Z" fill={mainColor} opacity="0.15" />
        <path d="M 76 63 L 260 30" stroke={mainColor} strokeWidth="1.5" strokeDasharray="4,3" />
        <path d="M 76 63 L 260 50" stroke={mainColor} strokeWidth="1.5" strokeDasharray="4,3" />
        <circle cx="240" cy="35" r="6" fill="#fff" stroke={mainColor} strokeWidth="2" />
        <circle cx="240" cy="35" r="2" fill={mainColor} />
        <text x="170" y="22" fontSize="11" fill={mainColor} textAnchor="middle" fontWeight="700">👁️ 200m ahead</text>
      </svg>
    );
  }

  // Default: generic dashboard
  return (
    <svg viewBox="0 0 280 100" style={{ width: "100%", height: 90 }}>
      <rect width="280" height="100" fill={lightColor} rx="8" />
      <circle cx="140" cy="50" r="28" fill="none" stroke={mainColor} strokeWidth="6" />
      <text x="140" y="56" fontSize="20" fill={mainColor} textAnchor="middle" fontWeight="800">💡</text>
    </svg>
  );
}

function VisualTipCard({ card }) {
  if (!card) return null;
  const colorMap = {
    red: { main: "#C0392B", bg: "#FFEBEB", border: "#FDDDD0" },
    green: { main: "#27AE60", bg: "#E8F5E9", border: "#C8E6C9" },
    blue: { main: "#3498DB", bg: "#E3F2FD", border: "#BBDEFB" },
    orange: { main: "#E8601C", bg: "#FFF5F0", border: "#FDDDD0" },
  };
  const c = colorMap[card.color] || colorMap.orange;

  return (
    <div style={{ maxWidth: "85%", background: "#fff", border: "1.5px solid " + c.border, borderRadius: 18, borderBottomLeftRadius: 4, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div style={{ padding: "10px 14px", background: c.bg, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>{card.icon}</span>
        <div style={{ fontSize: 15, fontWeight: 700, color: c.main }}>{card.title}</div>
      </div>
      {/* Visual */}
      <div style={{ padding: "8px 10px 0" }}>
        <TipVisual type={card.visual} color={card.color} />
      </div>
      {/* Tips */}
      <div style={{ padding: "8px 14px 10px" }}>
        {(card.tips || []).map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0", fontSize: 13, color: "#333", lineHeight: 1.4 }}>
            <span style={{ color: c.main, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
      {/* Encouragement */}
      {card.encouragement && (
        <div style={{ padding: "8px 14px", background: c.bg, borderTop: "1px solid " + c.border, fontSize: 12, color: c.main, fontWeight: 600, textAlign: "center" }}>
          ✨ {card.encouragement}
        </div>
      )}
    </div>
  );
}

function DrivePage({ t, lang }) {
  const [mode, setMode] = useState("idle");
  const [events, setEvents] = useState([]);
  const [pts, setPts] = useState(420);
  const [speed, setSpeed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const intervalRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "assistant", text: t.coachHi }]);
  }, [t]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (mode === "driving") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          setSpeed(32 + Math.floor(Math.random() * 28));
          const ev = DRIVE_EVENTS.find((e) => e.time === next);
          if (ev) {
            setEvents((p) => [ev, ...p]);
            if (ev.pts < 0) setPts((p) => p + ev.pts);
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [mode]);

  const sendChat = async (overrideText) => {
    const raw = overrideText !== undefined ? overrideText : chatInput;
    if (!raw || !raw.trim()) return;
    const msg = raw.trim();
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setChatInput("");
    setChatLoading(true);

    // Build conversation history for context
    const history = messages.filter(m => m.role === "user" || (m.role === "assistant" && m.text)).slice(-6).map(m => ({
      role: m.role,
      content: m.role === "user" ? m.text : (m.text || m.card?.title || ""),
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          system: `You are a friendly AI driving coach for Hong Kong minibus driver Yeung Tai Man. Current safety score: 82/100, lost 80 points this week (mainly from hard braking and following too close). Routes: Tuen Mun Road, Castle Peak Road, Sham Tseng.

You MUST respond with ONLY a JSON object (no markdown fences, no extra text, nothing else).

Decide mode based on THIS user message:

MODE A - VISUAL CARD: ONLY when the user EXPLICITLY asks about a driving technique (how to brake, how to follow, route tips, how to improve score). If in doubt, use MODE B.
{"mode":"card","title":"2-4 words","icon":"emoji","color":"orange|red|green|blue","visual":"distance|speed|brake|turn|score|lane|scan","tips":["tip1 ≤8 words","tip2 ≤8 words","tip3 ≤8 words"],"encouragement":"≤10 words"}

MODE B - PLAIN TEXT: For EVERYTHING else — greetings ("hi","hello","bye"), thanks ("thank you","thanks","good thanks"), compliments ("you are great"), chitchat, questions about app features, rewards, leaderboard info, unclear messages.
{"mode":"text","text":"Your warm natural reply in 1-2 short sentences."}

CRITICAL RULES:
- "hi" / "hello" / "bye" / "thanks" / "good thanks" / "ok" / compliments → ALWAYS MODE B
- Only use MODE A if user clearly asks "how to..." about driving
- Match user's language (English / 繁體中文 / 简体中文)
- Return ONLY the raw JSON object, no code fences, no explanation

Examples:
User: "hi" → {"mode":"text","text":"Hi! How can I help with your driving today?"}
User: "bye" → {"mode":"text","text":"Bye! Drive safe out there! 👋"}
User: "good thanks!" → {"mode":"text","text":"You're welcome! Anytime you need tips, I'm here. 😊"}
User: "how to reduce hard braking?" → {"mode":"card","title":"Smooth Braking","icon":"🛑","color":"red","visual":"brake","tips":["Scan 200m ahead","Lift gas before corners","Keep 3-second gap"],"encouragement":"Small changes, big score boost!"}`,
          messages: [...history, { role: "user", content: msg }],
        }),
      });
      const data = await res.json();

      // Check for API error
      if (data.error) {
        setMessages((p) => [...p, { role: "assistant", text: "AI error: " + (data.error.message || data.error) }]);
        setChatLoading(false);
        return;
      }

      const reply = (data.content && data.content.map((c) => c.text || "").join("")) || "";
      // Try to extract JSON (handle possible code fences)
      let cleanReply = reply.trim();
      cleanReply = cleanReply.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const jsonMatch = cleanReply.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.mode === "text" && parsed.text) {
            setMessages((p) => [...p, { role: "assistant", text: parsed.text }]);
          } else if (parsed.mode === "card" && parsed.tips) {
            setMessages((p) => [...p, { role: "assistant", card: parsed }]);
          } else if (parsed.text) {
            setMessages((p) => [...p, { role: "assistant", text: parsed.text }]);
          } else if (parsed.tips) {
            setMessages((p) => [...p, { role: "assistant", card: parsed }]);
          } else {
            // Unexpected structure - just show raw reply as text
            setMessages((p) => [...p, { role: "assistant", text: reply }]);
          }
        } catch {
          // Parse failed - show raw reply as text
          setMessages((p) => [...p, { role: "assistant", text: reply }]);
        }
      } else {
        // No JSON - show as plain text
        setMessages((p) => [...p, { role: "assistant", text: reply || "Sorry, I didn't get that. Try again." }]);
      }
    } catch (err) {
      setMessages((p) => [...p, { role: "assistant", text: "Connection error. Please check your network and try again." }]);
    }
    setChatLoading(false);
  };
      } else {
        // No JSON found — treat as plain text reply
        if (reply) {
          setMessages((p) => [...p, { role: "assistant", text: reply }]);
        } else if (fallback) {
          setMessages((p) => [...p, { role: "assistant", card: fallback }]);
        } else {
          setMessages((p) => [...p, { role: "assistant", text: "Sorry, try again." }]);
        }
      }
    } catch (err) {
      // API unreachable
      if (fallback) {
        setMessages((p) => [...p, { role: "assistant", card: fallback }]);
      } else {
        setMessages((p) => [...p, { role: "assistant", text: "I'm having trouble connecting. Please try again." }]);
      }
    }
    setChatLoading(false);
  };

  if (mode === "chat") {
    const quickQuestions = [
      { icon: "📊", text: "How's my score?" },
      { icon: "🛣️", text: "Tuen Mun Rd tips" },
      { icon: "🛑", text: "Reduce hard braking" },
      { icon: "🚗", text: "Following distance" },
      { icon: "🏆", text: "Climb leaderboard" },
    ];

    const startVoice = () => {
      // If already recording, stop it (toggle behavior)
      if (voiceActive && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
        setVoiceActive(false);
        return;
      }

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        alert("Voice input not supported on this browser. Please use Chrome, Edge, or Safari.");
        return;
      }

      // Clean up any old instance
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
        recognitionRef.current = null;
      }

      let rec;
      try {
        rec = new SR();
      } catch (err) {
        alert("Could not initialize voice: " + err.message);
        return;
      }

      rec.lang = lang === "zh_hant" ? "zh-HK" : lang === "zh_hans" ? "zh-CN" : "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;

      let finalText = "";

      rec.onstart = () => {
        setVoiceActive(true);
        setChatInput("");
      };

      rec.onresult = (e) => {
        let interim = "";
        finalText = "";
        for (let i = 0; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            finalText += transcript;
          } else {
            interim += transcript;
          }
        }
        setChatInput(finalText + interim);
      };

      rec.onerror = (e) => {
        setVoiceActive(false);
        recognitionRef.current = null;
        if (e.error === "no-speech") {
          // user didn't speak, silently dismiss
          return;
        }
        if (e.error === "aborted") {
          // user cancelled, no alert
          return;
        }
        let msg = "Voice input error";
        if (e.error === "not-allowed" || e.error === "permission-denied" || e.error === "service-not-allowed") {
          msg = "Microphone access denied. Click the 🔒 icon in your browser's address bar to allow microphone.";
        } else if (e.error === "audio-capture") {
          msg = "No microphone found. Please check your device.";
        } else if (e.error === "network") {
          msg = "Network error. Voice recognition needs internet connection.";
        } else {
          msg = "Voice error: " + e.error;
        }
        alert(msg);
      };

      rec.onend = () => {
        setVoiceActive(false);
        recognitionRef.current = null;
        if (finalText.trim()) {
          const textToSend = finalText.trim();
          setTimeout(() => {
            sendChat(textToSend);
          }, 150);
        }
      };

      recognitionRef.current = rec;

      try {
        rec.start();
      } catch (err) {
        setVoiceActive(false);
        recognitionRef.current = null;
        alert("Could not start voice: " + err.message + " — try clicking mic button again.");
      }
    };

    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 76, display: "flex", flexDirection: "column", background: "#fff", zIndex: 90 }}>
        <StatusBar />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 20px 12px", background: "#fff", borderBottom: "1px solid " + BORDER, flexShrink: 0 }}>
          <div onClick={() => setMode("idle")} style={{ fontSize: 22, cursor: "pointer", color: ORANGE, fontWeight: 700 }}>‹</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{t.aiCoach}</div>
            <div style={{ fontSize: 11, color: GREEN, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, display: "inline-block" }} />
              Online · Visual tips
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 8px", minHeight: 0 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12, alignItems: "flex-end", gap: 6 }}>
              {m.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: ORANGE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
              )}
              {m.role === "user" ? (
                <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: 18, fontSize: 14, background: ORANGE, color: "#fff", borderBottomRightRadius: 4 }}>{m.text}</div>
              ) : m.card ? (
                <VisualTipCard card={m.card} />
              ) : (
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 18, fontSize: 14, lineHeight: 1.5, background: BG, color: "#333", borderBottomLeftRadius: 4, whiteSpace: "pre-wrap" }}>{m.text}</div>
              )}
            </div>
          ))}
          {chatLoading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: ORANGE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
              <div style={{ padding: "12px 16px", borderRadius: 18, background: BG, color: GRAY, borderBottomLeftRadius: 4 }}>
                <span style={{ display: "inline-block", animation: "typingDot 1.4s infinite" }}>●</span>
                <span style={{ display: "inline-block", animation: "typingDot 1.4s infinite 0.2s", marginLeft: 2 }}>●</span>
                <span style={{ display: "inline-block", animation: "typingDot 1.4s infinite 0.4s", marginLeft: 2 }}>●</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick chips */}
        <div style={{ padding: "6px 12px", borderTop: "1px solid " + BORDER, background: "#fff", flexShrink: 0, overflowX: "auto", whiteSpace: "nowrap" }}>
          {quickQuestions.map((q, i) => (
            <div key={i} onClick={() => sendChat(q.text)} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: ORANGE_LIGHT, border: "1px solid #FDDDD0", borderRadius: 16, padding: "6px 12px", fontSize: 12, color: ORANGE, cursor: "pointer", fontWeight: 500, marginRight: 6, whiteSpace: "nowrap" }}>
              <span>{q.icon}</span>
              <span>{q.text}</span>
            </div>
          ))}
        </div>

        {/* Input bar with mic */}
        <div style={{ background: "#fff", borderTop: "1px solid " + BORDER, padding: "10px 14px 12px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={startVoice} style={{ background: voiceActive ? RED : BG, color: voiceActive ? "#fff" : "#555", border: "1.5px solid " + (voiceActive ? RED : BORDER), borderRadius: "50%", width: 40, height: 40, fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: voiceActive ? "pulseRing 1.2s infinite" : "none" }} title="Voice input">
            🎤
          </button>
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder={voiceActive ? "Listening..." : t.askMe} style={{ flex: 1, border: "1.5px solid " + BORDER, borderRadius: 22, padding: "10px 14px", fontSize: 14, outline: "none", background: BG, minWidth: 0 }} />
          <button onClick={() => sendChat()} disabled={!chatInput.trim()} style={{ background: chatInput.trim() ? ORANGE : "#ddd", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, fontSize: 18, cursor: chatInput.trim() ? "pointer" : "default", flexShrink: 0 }}>↑</button>
        </div>

        <style>{`
          @keyframes typingDot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
          @keyframes pulseRing {
            0% { box-shadow: 0 0 0 0 rgba(192,57,43,0.5); }
            70% { box-shadow: 0 0 0 10px rgba(192,57,43,0); }
            100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); }
          }
        `}</style>
      </div>
    );
  }

  if (mode === "done") {
    const totalLost = 420 - pts;
    const badCount = events.filter((e) => e.pts < 0).length;
    const goodCount = events.filter((e) => e.type === "good").length;
    const nearCount = events.filter((e) => e.type === "near").length;
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#222", margin: "8px 0 20px" }}>🏁 {t.tripDone}</div>
          <div style={{ background: "linear-gradient(135deg, " + ORANGE + ", " + ORANGE2 + ")", borderRadius: 22, padding: 22, color: "#fff", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 14, opacity: 0.85 }}>{t.ptsKept}</div>
            <div style={{ fontSize: 52, fontWeight: 800, margin: "4px 0" }}>{pts}</div>
            <div style={{ fontSize: 14, opacity: 0.75 }}>{t.of} 420</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              [t.duration, Math.floor(elapsed / 60) + ":" + (elapsed % 60).toString().padStart(2, "0"), "#333"],
              [t.dist, (elapsed * 0.012).toFixed(1) + " km", "#333"],
              [t.ptsLost, "-" + totalLost, RED],
              [t.safeEv, goodCount, GREEN],
              [t.dangerEv, badCount, RED],
              [t.nearEv, nearCount, "#B45309"],
            ].map((s) => (
              <div key={s[0]} style={{ background: BG, borderRadius: 14, padding: 14, border: "1px solid " + BORDER, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s[2] }}>{s[1]}</div>
                <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{s[0]}</div>
              </div>
            ))}
          </div>
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid " + BORDER }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.type === "bad" ? RED : e.type === "warn" ? ORANGE : e.type === "near" ? "#B45309" : GREEN }} />
              <div style={{ flex: 1, fontSize: 13, color: "#555" }}>{e.text}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: e.pts < 0 ? RED : e.type === "near" ? "#B45309" : GREEN }}>
                {e.pts < 0 ? e.pts : e.type === "near" ? "close!" : "safe"}
              </div>
            </div>
          ))}
          <button onClick={() => { setMode("idle"); setEvents([]); setElapsed(0); setPts(420); setSpeed(0); }} style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 28, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 16 }}>
            {t.goBack}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "driving") {
    const progress = Math.min(elapsed / 55, 1);
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <GoogleStyleMap progress={progress} height={240} />

          <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: GREEN, marginRight: 6, verticalAlign: "middle" }} />
            <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>
              {t.monitoring} · {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: 12, background: "#fff", border: "1px solid " + BORDER, borderRadius: 16, padding: "12px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#222", lineHeight: 1 }}>{speed}</div>
              <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>km/h</div>
            </div>
            <div style={{ width: 1, height: 40, background: BORDER }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: ORANGE, lineHeight: 1 }}>{pts}</div>
              <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{t.ptsLeft}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { label: t.braking, ok: !events.some((e) => e.type === "bad" && e.text.indexOf("brak") >= 0 && (elapsed - e.time) < 5) },
              { label: t.speed, ok: speed < 55 },
              { label: t.distance, ok: !events.some((e) => e.text.indexOf("distance") >= 0 && (elapsed - e.time) < 5) },
            ].map((ind) => (
              <div key={ind.label} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: 12, textAlign: "center", border: "1px solid " + BORDER }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: ind.ok ? GREEN : ORANGE }}>{ind.ok ? "✓" : "!"}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{ind.label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{t.liveEvents}</div>
          {events.length === 0 && (
            <div style={{ fontSize: 14, color: GRAY, textAlign: "center", padding: 24 }}>{t.waitDrive}</div>
          )}
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid " + BORDER }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.type === "bad" ? RED : e.type === "warn" ? ORANGE : e.type === "near" ? "#B45309" : GREEN }} />
              <div style={{ flex: 1, fontSize: 13, color: "#555" }}>{e.text}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: e.pts < 0 ? RED : e.type === "near" ? "#B45309" : GREEN }}>
                {e.pts < 0 ? e.pts : e.type === "near" ? "close!" : "safe"}
              </div>
            </div>
          ))}
          <button onClick={() => setMode("done")} style={{ background: RED, color: "#fff", border: "none", borderRadius: 28, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 16 }}>
            {t.endTrip}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StatusBar />
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#222", margin: "8px 0 16px" }}>{t.drive}</div>

        <GoogleStyleMap progress={null} height={220} />

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, background: BG, borderRadius: 16, padding: 16, textAlign: "center", border: "1px solid " + BORDER }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: ORANGE }}>420</div>
            <div style={{ fontSize: 11, color: GRAY }}>{t.safetyPts}</div>
          </div>
          <div style={{ flex: 1, background: BG, borderRadius: 16, padding: 16, textAlign: "center", border: "1px solid " + BORDER }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#222" }}>82</div>
            <div style={{ fontSize: 11, color: GRAY }}>{t.score}</div>
          </div>
        </div>

        <button onClick={() => { setMode("driving"); setEvents([]); setElapsed(0); setPts(420); setSpeed(0); }} style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 28, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", marginBottom: 12 }}>
          {t.startTrip}
        </button>
        <button onClick={() => setMode("chat")} style={{ background: "#fff", color: ORANGE, border: "2px solid " + ORANGE, borderRadius: 28, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span>💬</span> {t.chat}
        </button>
      </div>
    </div>
  );
}

function RankPage({ t }) {
  const [period, setPeriod] = useState("weekly");
  const list = period === "weekly" ? DRIVERS_WEEKLY : DRIVERS_MONTHLY;
  const myIdx = list.findIndex((d) => d.me);
  const myRank = myIdx + 1;

  const MedalIcon = ({ type }) => {
    // type: 'gold' 'silver' 'bronze'
    const colors = {
      gold: { ribbon: "#E8601C", ribbon2: "#F4A259", medal: "#FFD700", medalDark: "#B8860B", border: "#DAA520" },
      silver: { ribbon: "#5AC8FA", ribbon2: "#87CEEB", medal: "#E5E5E5", medalDark: "#A8A8A8", border: "#C0C0C0" },
      bronze: { ribbon: "#A0522D", ribbon2: "#D2691E", medal: "#CD7F32", medalDark: "#8B4513", border: "#8B4513" },
    };
    const c = colors[type];
    return (
      <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
        {/* Ribbon */}
        <path d="M8 0 L6 12 L11 10 L16 14 L21 10 L26 12 L24 0 Z" fill={c.ribbon} />
        <path d="M8 0 L11 10 L16 14 L21 10 L24 0 L20 0 L16 10 L12 0 Z" fill={c.ribbon2} opacity="0.5" />
        {/* Medal circle */}
        <circle cx="16" cy="24" r="10" fill={c.medal} stroke={c.border} strokeWidth="1.5" />
        <circle cx="16" cy="24" r="7" fill="none" stroke={c.medalDark} strokeWidth="0.5" opacity="0.5" />
        {/* Number or star */}
        <text x="16" y="28" fontSize="10" fontWeight="800" fill={c.medalDark} textAnchor="middle">
          {type === "gold" ? "1" : type === "silver" ? "2" : "3"}
        </text>
      </svg>
    );
  };

  const getMedal = (i) => {
    if (i === 0) return "gold";
    if (i === 1) return "silver";
    if (i === 2) return "bronze";
    return null;
  };

  return (
    <div>
      <StatusBar />
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#222", margin: "8px 0 16px" }}>{t.board}</div>

        {/* Toggle */}
        <div style={{ display: "flex", background: "#f5f5f5", borderRadius: 14, padding: 3, marginBottom: 14 }}>
          {[["weekly", t.weekly], ["monthly", t.monthly]].map((p) => (
            <div key={p[0]} onClick={() => setPeriod(p[0])} style={{ flex: 1, padding: 10, borderRadius: 11, textAlign: "center", fontSize: 14, fontWeight: 600, cursor: "pointer", background: period === p[0] ? ORANGE : "transparent", color: period === p[0] ? "#fff" : GRAY, transition: "all 0.2s" }}>
              {p[1]}
            </div>
          ))}
        </div>

        {/* User rank banner */}
        <div style={{ background: "linear-gradient(135deg, " + ORANGE + ", " + ORANGE2 + ")", borderRadius: 18, padding: "14px 18px", color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ fontSize: 10, opacity: 0.85, lineHeight: 1 }}>#</div>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>{myRank}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{period === "weekly" ? t.weekly : t.monthly}</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {period === "weekly" ? `You're #${myRank} this week` : `You're #${myRank} this month`}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
              {list[myIdx].pts.toLocaleString()} {t.pts}
              {myIdx > 0 && ` · ${(list[myIdx - 1].pts - list[myIdx].pts)} ${t.pts} to #${myIdx}`}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: GRAY, textAlign: "center", marginBottom: 10 }}>{t.rankBy}</div>

        {list.map((d, i) => {
          const medal = getMedal(i);
          return (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 10px", marginBottom: 6, borderRadius: 14, background: d.me ? ORANGE_LIGHT : "transparent", border: d.me ? "1.5px solid #FDDDD0" : "1.5px solid transparent" }}>
              <div style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {medal ? (
                  <MedalIcon type={medal} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#bbb", width: 32, textAlign: "center" }}>{i + 1}</div>
                )}
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: d.me ? ORANGE : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: d.me ? "#fff" : GRAY, flexShrink: 0 }}>{d.ini}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: d.me ? 700 : 500, color: d.me ? ORANGE : "#333" }}>{d.me ? "You" : d.name}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: ORANGE }}>
                {d.pts.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 400, color: GRAY }}>{t.pts}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RewardsPage({ t }) {
  const [balance, setBalance] = useState(1840);
  const [redeemed, setRedeemed] = useState([]);
  const redeem = (r) => {
    if (balance >= r.cost && !redeemed.includes(r.id)) {
      setBalance((b) => b - r.cost);
      setRedeemed((p) => [...p, r.id]);
    }
  };
  const next = REWARDS_LIST.find((r) => r.cost > balance && !redeemed.includes(r.id));

  return (
    <div>
      <StatusBar />
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#222", margin: "8px 0 16px" }}>{t.rewards}</div>
        <div style={{ background: "linear-gradient(135deg, " + ORANGE + ", " + ORANGE2 + ")", borderRadius: 22, padding: 22, color: "#fff", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{t.availPts}</div>
            <div style={{ fontSize: 40, fontWeight: 800 }}>{balance.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{t.lifetime}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>6,200</div>
          </div>
        </div>

        {next && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid " + BORDER, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: next.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{next.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: ORANGE }}>{t.almost}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{next.cost - balance} {t.moreFor} {next.name}</div>
              </div>
            </div>
            <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4 }}>
              <div style={{ width: Math.round((balance / next.cost) * 100) + "%", height: 8, background: ORANGE, borderRadius: 4 }} />
            </div>
          </div>
        )}

        <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "12px 0 8px" }}>{t.redeem}</div>
        {REWARDS_LIST.map((r) => {
          const done = redeemed.includes(r.id);
          const canAfford = balance >= r.cost;
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: done ? "#f9f9f9" : "#fff", borderRadius: 18, marginBottom: 8, border: "1px solid " + BORDER }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: done ? GRAY : "#333" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{r.desc}</div>
              </div>
              {done ? (
                <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>{t.redeemed} ✓</div>
              ) : (
                <button onClick={() => redeem(r)} style={{ background: canAfford ? ORANGE : "#eee", color: canAfford ? "#fff" : GRAY, border: "none", borderRadius: 22, padding: "8px 18px", fontSize: 14, fontWeight: 700, cursor: canAfford ? "pointer" : "default" }}>
                  {r.cost.toLocaleString()}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Call screen overlay
function CallScreen({ contact, number, color, onEnd, t }) {
  const [state, setState] = useState("calling");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const audioCtxRef = useRef(null);
  const ringTimerRef = useRef(null);
  const dialTimerRef = useRef(null);

  // Play a classic dial tone using Web Audio API (ring-ring pattern)
  useEffect(() => {
    let isMounted = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      audioCtxRef.current = ctx;

      const playTone = () => {
        if (!isMounted || ctx.state === "closed") return;
        // Two quick beeps, like Hong Kong ring tone
        const now = ctx.currentTime;
        const beep = (start, dur, freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0, now + start);
          gain.gain.linearRampToValueAtTime(0.15, now + start + 0.02);
          gain.gain.setValueAtTime(0.15, now + start + dur - 0.05);
          gain.gain.linearRampToValueAtTime(0, now + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + start);
          osc.stop(now + start + dur);
        };
        beep(0, 0.4, 440);
        beep(0.5, 0.4, 480);
      };

      // First ring immediately (after slight delay for user gesture)
      dialTimerRef.current = setTimeout(() => {
        playTone();
        // Then ring every 2.5s
        ringTimerRef.current = setInterval(playTone, 2500);
      }, 300);
    } catch (e) {
      // silent fail if audio blocked
    }

    return () => {
      isMounted = false;
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
      if (dialTimerRef.current) clearTimeout(dialTimerRef.current);
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  // After 3 seconds, switch to "connected" and stop ringing
  useEffect(() => {
    const t1 = setTimeout(() => {
      setState("connected");
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
      if (dialTimerRef.current) clearTimeout(dialTimerRef.current);
    }, 3000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (state === "connected") {
      const id = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(id);
    }
  }, [state]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  // SVG phone icon (regular)
  const PhoneIcon = ({ size = 48, color = "#fff", rotate = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.09a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color} />
    </svg>
  );

  // SVG icons for action buttons
  const MuteIcon = ({ active }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={active ? "#fff" : "none"} />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {active && <line x1="4" y1="4" x2="20" y2="20" stroke="#E74C3C" strokeWidth="2.5" strokeLinecap="round" />}
    </svg>
  );

  const KeypadIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      {[0, 1, 2].map((row) => [0, 1, 2].map((col) => (
        <circle key={`${row}${col}`} cx={6 + col * 6} cy={6 + row * 6} r="1.6" fill="#fff" />
      )))}
      <circle cx="12" cy="22" r="1.6" fill="#fff" />
    </svg>
  );

  const SpeakerIcon = ({ active }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={active ? "#fff" : "none"} />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, #2C3E50 0%, #1a252f 100%)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 30px 30px" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4, letterSpacing: 0.5 }}>
        {state === "calling" ? t.calling : t.connected}
      </div>
      <div style={{ fontSize: 28, fontWeight: 300, color: "#fff", marginBottom: 4, textAlign: "center" }}>{contact}</div>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)" }}>{number}</div>
      {state === "connected" && (
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{mm}:{ss}</div>
      )}

      {/* Avatar circle with pulse */}
      <div style={{ position: "relative", margin: "40px 0 30px" }}>
        {state === "calling" && (
          <>
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", animation: "callPulse 2s infinite" }} />
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", animation: "callPulse 2s infinite 0.5s" }} />
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", animation: "callPulse 2s infinite 1s" }} />
          </>
        )}
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", position: "relative" }}>
          <PhoneIcon size={50} color="#fff" />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30, marginBottom: 36 }}>
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setMuted(!muted)}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: muted ? "#fff" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", border: "1.5px solid rgba(255,255,255,0.25)", transition: "all 0.2s" }}>
            <MuteIcon active={muted} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{t.mute}</div>
        </div>
        <div style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", border: "1.5px solid rgba(255,255,255,0.25)" }}>
            <KeypadIcon />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{t.keypad}</div>
        </div>
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setSpeaker(!speaker)}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: speaker ? "#fff" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", border: "1.5px solid rgba(255,255,255,0.25)", transition: "all 0.2s" }}>
            <SpeakerIcon active={speaker} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{t.speaker}</div>
        </div>
      </div>

      {/* End call button */}
      <div onClick={onEnd} style={{ width: 66, height: 66, borderRadius: "50%", background: "#E74C3C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 6px 24px rgba(231,76,60,0.5)" }}>
        <PhoneIcon size={32} color="#fff" rotate={135} />
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>{t.endCall}</div>

      <style>{`
        @keyframes callPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function MePage({ t, lang, setLang, notif, setNotif, showLoss, setShowLoss }) {
  const [sub, setSub] = useState(null);
  const [call, setCall] = useState(null); // { contact, number, color }

  if (sub === "sos") {
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
            <div onClick={() => setSub(null)} style={{ fontSize: 22, cursor: "pointer", color: ORANGE, fontWeight: 700 }}>‹</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.emergency}</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FFEBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 12px" }}>🆘</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: RED }}>{t.needHelp}</div>
            <div style={{ fontSize: 13, color: GRAY, marginTop: 6 }}>Tap to call</div>
          </div>
          {[
            { label: t.emer + " (999)", number: "999", color: RED },
            { label: t.police + " (999)", number: "999", color: "#333" },
            { label: t.operator, number: "+852 2XXX XXXX", color: ORANGE },
          ].map((c, i) => (
            <div key={i} onClick={() => setCall({ contact: c.label, number: c.number, color: c.color })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: BG, borderRadius: 16, marginBottom: 8, border: "1px solid " + BORDER, cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{c.label}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{c.number}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.09a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#fff" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        {call && <CallScreen contact={call.contact} number={call.number} color={call.color} onEnd={() => setCall(null)} t={t} />}
      </div>
    );
  }

  if (sub === "badges") {
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
            <div onClick={() => setSub(null)} style={{ fontSize: 22, cursor: "pointer", color: ORANGE, fontWeight: 700 }}>‹</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.achievements}</div>
          </div>
          <div style={{ fontSize: 14, color: GRAY, marginBottom: 16 }}>5 {t.of} 9 {t.unlocked}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{ textAlign: "center", padding: 16, borderRadius: 16, background: b.unlocked ? "#fff" : "#f9f9f9", border: "1px solid " + (b.unlocked ? BORDER : "#eee"), opacity: b.unlocked ? 1 : 0.4 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, background: b.unlocked ? (b.color + "18") : "#f0f0f0", color: b.unlocked ? b.color : GRAY }}>{b.icon}</div>
                <div style={{ fontSize: 11, color: b.unlocked ? "#555" : GRAY, lineHeight: 1.3 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (sub === "lang") {
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
            <div onClick={() => setSub(null)} style={{ fontSize: 22, cursor: "pointer", color: ORANGE, fontWeight: 700 }}>‹</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.language}</div>
          </div>
          {Object.keys(LANGS).map((k) => (
            <div key={k} onClick={() => { setLang(k); setSub(null); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: lang === k ? ORANGE_LIGHT : BG, borderRadius: 16, marginBottom: 8, border: "1.5px solid " + (lang === k ? "#FDDDD0" : BORDER), cursor: "pointer" }}>
              <span style={{ fontSize: 15, fontWeight: lang === k ? 700 : 400, color: lang === k ? ORANGE : "#333" }}>{LANGS[k]}</span>
              {lang === k && <span style={{ color: ORANGE, fontSize: 18 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "notif") {
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
            <div onClick={() => setSub(null)} style={{ fontSize: 22, cursor: "pointer", color: ORANGE, fontWeight: 700 }}>‹</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.notifs}</div>
          </div>
          {["Trip alerts", "Weekly report", "Leaderboard updates", "Reward reminders"].map((item) => {
            const isOn = notif[item] !== false;
            return (
              <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: BG, borderRadius: 16, marginBottom: 8, border: "1px solid " + BORDER }}>
                <span style={{ fontSize: 15, color: "#333" }}>{item}</span>
                <div onClick={() => setNotif((n) => ({ ...n, [item]: !isOn }))} style={{ width: 48, height: 28, borderRadius: 14, background: isOn ? ORANGE : "#ddd", padding: 2, cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", transform: isOn ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (sub === "disp") {
    return (
      <div>
        <StatusBar />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
            <div onClick={() => setSub(null)} style={{ fontSize: 22, cursor: "pointer", color: ORANGE, fontWeight: 700 }}>‹</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.display}</div>
          </div>
          {[
            [true, t.showLoss, "📉", "See which events cost you points. Research shows this motivates most people to drive safer."],
            [false, t.showKeep, "📈", "See what you earned from safe driving. A positive reinforcement approach."],
          ].map((opt) => (
            <div key={String(opt[0])} onClick={() => { setShowLoss(opt[0]); setSub(null); }} style={{ padding: 18, background: showLoss === opt[0] ? ORANGE_LIGHT : BG, borderRadius: 16, marginBottom: 10, border: "1.5px solid " + (showLoss === opt[0] ? "#FDDDD0" : BORDER), cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{opt[2]}</span>
                <span style={{ fontSize: 15, fontWeight: showLoss === opt[0] ? 700 : 500, color: showLoss === opt[0] ? ORANGE : "#333" }}>{opt[1]}</span>
                {showLoss === opt[0] && <span style={{ marginLeft: "auto", color: ORANGE, fontSize: 18 }}>✓</span>}
              </div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{opt[3]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const notifStatus = Object.values(notif).some((v) => v === false) ? "Custom" : "On";

  return (
    <div>
      <StatusBar />
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#222", margin: "8px 0 16px" }}>{t.profile}</div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: ORANGE, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>YT</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#222" }}>Yeung Tai Man</div>
          <div style={{ fontSize: 14, color: GRAY }}>LB 3827</div>
          <div style={{ display: "inline-block", background: ORANGE_LIGHT, color: ORANGE, fontSize: 13, padding: "5px 16px", borderRadius: 14, fontWeight: 600, marginTop: 8 }}>🛡️ Cautious driver</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          {[["1,840", t.safetyPts], ["82", t.safetyScore], ["#4", t.fleetRank]].map((s) => (
            <div key={s[1]} style={{ background: BG, borderRadius: 16, padding: 14, textAlign: "center", border: "1px solid " + BORDER }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ORANGE }}>{s[0]}</div>
              <div style={{ fontSize: 10, color: GRAY, marginTop: 2 }}>{s[1]}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[["6,200", t.lifetimePts], ["126", t.daysActive], ["5", t.badges]].map((s) => (
            <div key={s[1]} style={{ background: BG, borderRadius: 16, padding: 14, textAlign: "center", border: "1px solid " + BORDER }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#333" }}>{s[0]}</div>
              <div style={{ fontSize: 10, color: GRAY, marginTop: 2 }}>{s[1]}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div onClick={() => setSub("sos")} style={{ background: "#FFEBEB", borderRadius: 18, padding: 18, textAlign: "center", cursor: "pointer", border: "1.5px solid #FDDDD0" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🆘</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: RED }}>{t.sos}</div>
          </div>
          <div onClick={() => setSub("badges")} style={{ background: BG, borderRadius: 18, padding: 18, textAlign: "center", cursor: "pointer", border: "1.5px solid " + BORDER }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🏆</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{t.achievements}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "12px 0 8px" }}>{t.settings}</div>
        {[
          { label: t.language, val: LANGS[lang], action: () => setSub("lang") },
          { label: t.notifs, val: notifStatus, action: () => setSub("notif") },
          { label: t.display, val: showLoss ? t.showLoss : t.showKeep, action: () => setSub("disp") },
          { label: t.about, val: "v1.0", action: () => {} },
        ].map((s) => (
          <div key={s.label} onClick={s.action} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid " + BORDER, cursor: "pointer" }}>
            <span style={{ fontSize: 15, color: "#333" }}>{s.label}</span>
            <span style={{ fontSize: 14, color: GRAY }}>{s.val} ›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("en");
  const [notif, setNotif] = useState({});
  const [showLoss, setShowLoss] = useState(true);

  const t = TEXTS[lang] || TEXTS.en;

  // Set body background to dark so the phone frame stands out
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)";
    document.body.style.minHeight = "100vh";
    document.documentElement.style.background = "#1a1a2e";
  }, []);

  const outerShell = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
  };

  // Phone frame with 8.2:16.15 aspect ratio
  const phoneFrame = {
    width: "min(430px, calc((100vh - 40px) * 8.2 / 16.15))",
    aspectRatio: "8.2 / 16.15",
    background: "#1a1a1a",
    borderRadius: 48,
    padding: 12,
    boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 2px #333",
    position: "relative",
  };

  const phoneScreen = {
    width: "100%",
    height: "100%",
    background: "#fff",
    borderRadius: 36,
    overflow: "hidden",
    position: "relative",
    fontFamily: "'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif",
  };

  const scrollArea = {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    background: "#fff",
  };

  // Dynamic island / notch at top, spaced ~5mm from frame edge
  const notch = {
    position: "absolute",
    top: 24,
    left: "50%",
    transform: "translateX(-50%)",
    width: 110,
    height: 28,
    background: "#000",
    borderRadius: 20,
    zIndex: 200,
  };

  if (!loggedIn) {
    return (
      <div style={outerShell}>
        <div style={phoneFrame}>
          <div style={notch} />
          <div style={phoneScreen}>
            <div style={scrollArea}>
              <LoginPage onLogin={() => setLoggedIn(true)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={outerShell}>
      <div style={phoneFrame}>
        <div style={notch} />
        <div style={phoneScreen}>
          <div style={scrollArea}>
            {tab === "home" && <HomePage t={t} showLoss={showLoss} />}
            {tab === "drive" && <DrivePage t={t} lang={lang} />}
            {tab === "rank" && <RankPage t={t} />}
            {tab === "rewards" && <RewardsPage t={t} />}
            {tab === "me" && (
              <MePage t={t} lang={lang} setLang={setLang} notif={notif} setNotif={setNotif} showLoss={showLoss} setShowLoss={setShowLoss} />
            )}
          </div>
          <TabBar active={tab} setTab={setTab} t={t} />
        </div>
      </div>
    </div>
  );
}
