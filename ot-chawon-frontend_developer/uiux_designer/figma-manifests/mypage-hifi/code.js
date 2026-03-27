figma.showUI(__html__, { width: 360, height: 580 });

var FRAME_SPECS = [
  { name: "MyPage-PC", width: 1440, height: 1800, category: "mypage" },
  { name: "MyPage-Mobile", width: 375, height: 2200, category: "mypage" },
  { name: "MyPage-ProfileEdit-PC", width: 1440, height: 1200, category: "profile-edit" },
  { name: "MyPage-OrderHistory-PC", width: 1440, height: 1200, category: "order-history" },
  { name: "MyPage-FittingGallery-PC", width: 1440, height: 1200, category: "fitting-gallery" },
  { name: "MyPage-Address-PC", width: 1440, height: 900, category: "address" }
];

var CATEGORY_COLOR = {
  "mypage": { r: 0.200, g: 0.200, b: 0.200 },
  "profile-edit": { r: 0.200, g: 0.200, b: 0.200 },
  "order-history": { r: 0.200, g: 0.200, b: 0.200 },
  "fitting-gallery": { r: 0.200, g: 0.200, b: 0.200 },
  "address": { r: 0.200, g: 0.200, b: 0.200 },
  "page": { r: 0.067, g: 0.067, b: 0.067 }
};

var PALETTE = {
  bgBase:        { r: 0.067, g: 0.067, b: 0.067 },
  bgSurface:     { r: 0.129, g: 0.129, b: 0.129 },
  bgElevated:    { r: 0.200, g: 0.200, b: 0.200 },
  border:        { r: 0.380, g: 0.380, b: 0.380 },
  textPrimary:   { r: 0.976, g: 0.976, b: 0.976 },
  textSecondary: { r: 0.741, g: 0.741, b: 0.741 },
  textMuted:     { r: 0.620, g: 0.620, b: 0.620 },
  accent:        { r: 0.976, g: 0.976, b: 0.976 },
  brandOrange:   { r: 0.976, g: 0.976, b: 0.976 },
  brandBlue:     { r: 0.620, g: 0.620, b: 0.620 },
  success:       { r: 0.741, g: 0.741, b: 0.741 },
  warning:       { r: 0.620, g: 0.620, b: 0.620 },
  error:         { r: 0.741, g: 0.741, b: 0.741 },
  white:         { r: 1, g: 1, b: 1 }
};

// Mock data
var MOCK_PROFILE = {
  name: "김민지",
  age: 25,
  email: "minji.kim@example.com",
  phone: "010-9876-5432",
  height: "165cm",
  weight: "55kg",
  topSize: "M",
  bottomSize: "27",
  shoeSize: "240mm",
  bodyType: "직사각형",
  joinDate: "2025.08.12"
};

var MOCK_ORDERS = [
  { id: "OC-20260320-00891", product: "오버사이즈 코튼 티셔츠 M", price: "39,000원", status: "배송완료", date: "2026.03.20", thumb: true },
  { id: "OC-20260315-00742", product: "슬림 데님 팬츠 30", price: "58,000원", status: "배송중", date: "2026.03.15", thumb: true },
  { id: "OC-20260310-00631", product: "울 블렌드 니트 카디건 L", price: "89,000원", status: "배송완료", date: "2026.03.10", thumb: true },
  { id: "OC-20260301-00512", product: "코듀로이 와이드 팬츠 32", price: "67,000원", status: "배송완료", date: "2026.03.01", thumb: true }
];

var MOCK_FITTINGS = [
  { label: "오버사이즈 체크 셔츠 L", date: "2026.03.22", fit: "98% 적합", note: "어깨 여유 +2cm 권장" },
  { label: "슬림 데님 팬츠 30", date: "2026.03.18", fit: "95% 적합", note: "허리 사이즈 정확히 맞음" },
  { label: "울 블렌드 코트 M", date: "2026.03.14", fit: "91% 적합", note: "소매 길이 -1cm 권장" },
  { label: "리넨 와이드 팬츠 S", date: "2026.03.09", fit: "87% 적합", note: "힙 라인 약간 여유있음" },
  { label: "크롭 후드 집업 M", date: "2026.03.04", fit: "99% 적합", note: "완벽한 핏" },
  { label: "테일러드 블레이저 M", date: "2026.02.28", fit: "93% 적합", note: "등 너비 정확함" }
];

var MOCK_ADDRESSES = [
  { label: "집", name: "김민지", phone: "010-9876-5432", addr: "서울특별시 강남구 테헤란로 123", detail: "OO아파트 101동 504호", zip: "06123", isDefault: true },
  { label: "회사", name: "김민지", phone: "010-9876-5432", addr: "서울특별시 서초구 강남대로 456", detail: "OO빌딩 8층", zip: "06543", isDefault: false }
];

async function loadFontSafe() {
  var families = ["Inter", "Roboto"];
  for (var i = 0; i < families.length; i += 1) {
    try {
      await figma.loadFontAsync({ family: families[i], style: "Regular" });
      await figma.loadFontAsync({ family: families[i], style: "Bold" });
      return families[i];
    } catch (error) {
      // try next family
    }
  }
  throw new Error("사용 가능한 폰트를 로드하지 못했습니다.");
}

function createRect(parent, x, y, w, h, color, radius) {
  var rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(w, h);
  rect.fills = [{ type: "SOLID", color: color }];
  if (typeof radius === "number") {
    rect.cornerRadius = radius;
  }
  parent.appendChild(rect);
  return rect;
}

function createText(parent, x, y, content, size, color, fontFamily, bold) {
  var text = figma.createText();
  var style = bold ? "Bold" : "Regular";
  text.fontName = { family: fontFamily || "Inter", style: style };
  text.fontSize = size;
  var safeContent = (content !== undefined && content !== null && content !== "") ? String(content) : " ";
  text.characters = safeContent;
  text.fills = [{ type: "SOLID", color: color }];
  text.x = x;
  text.y = y;
  parent.appendChild(text);
  return text;
}

function createButtonText(parent, btnX, btnY, btnW, btnH, content, size, color, fontFamily, bold) {
  var text = figma.createText();
  var style = bold ? "Bold" : "Regular";
  text.fontName = { family: fontFamily || "Inter", style: style };
  text.fontSize = size;
  var safeContent = (content !== undefined && content !== null && content !== "") ? String(content) : " ";
  text.characters = safeContent;
  text.fills = [{ type: "SOLID", color: color }];
  text.x = btnX;
  text.y = btnY;
  text.resize(btnW, btnH);
  text.textAlignHorizontal = "CENTER";
  text.textAlignVertical = "CENTER";
  parent.appendChild(text);
  return text;
}

function drawHeader(frame, spec, fontName) {
  var catColor = CATEGORY_COLOR[spec.category] || PALETTE.bgSurface;
  createRect(frame, 0, 0, spec.width, 48, catColor);
  createText(frame, 24, 12, spec.name, 18, PALETTE.white, fontName, true);
  createText(frame, 24, 34, spec.category + " · " + spec.width + "×" + spec.height, 11, PALETTE.white, fontName, false);
}

function drawNavbar(frame, spec, fontName) {
  createRect(frame, 0, 48, spec.width, 64, PALETTE.bgSurface);
  createText(frame, 24, 68, "옷차원", 20, PALETTE.accent, fontName, true);
  if (spec.width > 400) {
    createText(frame, spec.width - 280, 72, "상품  피팅  장바구니  마이페이지", 14, PALETTE.textSecondary, fontName, false);
  }
}

// ─────────────────────────────────────────────
// FRAME 1 & 2: MyPage Dashboard (PC + Mobile)
// ─────────────────────────────────────────────
function drawMyPage(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var contentW = spec.width - pad * 2;
  var y = 136;

  // ── Section: 페이지 제목
  createText(frame, pad, y, "마이페이지", isMobile ? 24 : 32, PALETTE.textPrimary, fontName, true);
  y += isMobile ? 40 : 52;

  if (!isMobile) {
    // PC: 2-column layout — sidebar (left 260px) + main (right)
    var sideW = 240;
    var sideX = pad;
    var mainX = pad + sideW + 32;
    var mainW = contentW - sideW - 32;

    // ── Sidebar: 프로필 카드
    createRect(frame, sideX, y, sideW, 320, PALETTE.bgSurface, 12);
    // Avatar circle
    createRect(frame, sideX + 80, y + 24, 80, 80, PALETTE.bgElevated, 40);
    createText(frame, sideX + 104, y + 52, "MJ", 24, PALETTE.textSecondary, fontName, true);
    createText(frame, sideX + 60, y + 120, MOCK_PROFILE.name, 18, PALETTE.textPrimary, fontName, true);
    createText(frame, sideX + 48, y + 146, MOCK_PROFILE.email, 11, PALETTE.textMuted, fontName, false);
    createRect(frame, sideX + 20, y + 170, sideW - 40, 1, PALETTE.border);
    // Stats row
    createText(frame, sideX + 20, y + 186, "주문", 11, PALETTE.textMuted, fontName, false);
    createText(frame, sideX + 20, y + 202, "12건", 16, PALETTE.textPrimary, fontName, true);
    createText(frame, sideX + 100, y + 186, "피팅", 11, PALETTE.textMuted, fontName, false);
    createText(frame, sideX + 100, y + 202, "28회", 16, PALETTE.textPrimary, fontName, true);
    createText(frame, sideX + 180, y + 186, "포인트", 11, PALETTE.textMuted, fontName, false);
    createText(frame, sideX + 180, y + 202, "3,200P", 16, PALETTE.brandOrange, fontName, true);
    createRect(frame, sideX + 20, y + 230, sideW - 40, 1, PALETTE.border);
    // Nav links
    var navItems = ["프로필 수정", "체형 정보 관리", "주문 내역", "피팅 이력", "배송지 관리", "로그아웃"];
    for (var ni = 0; ni < navItems.length; ni += 1) {
      var ny = y + 246 + ni * 32;
      var isActive = ni === 0;
      if (isActive) {
        createRect(frame, sideX, ny - 4, sideW, 28, PALETTE.bgElevated, 4);
      }
      createText(frame, sideX + 20, ny, navItems[ni], 13,
        ni === 5 ? PALETTE.textMuted : (isActive ? PALETTE.textPrimary : PALETTE.textSecondary),
        fontName, isActive);
    }

    // ── Main area: 최근 주문 내역
    var secY = y;
    createText(frame, mainX, secY, "최근 주문 내역", 20, PALETTE.textPrimary, fontName, true);
    createText(frame, mainX + mainW - 80, secY + 4, "전체보기 →", 13, PALETTE.textMuted, fontName, false);
    secY += 40;

    for (var oi = 0; oi < 3; oi += 1) {
      var order = MOCK_ORDERS[oi];
      var oy = secY + oi * 92;
      createRect(frame, mainX, oy, mainW, 80, PALETTE.bgSurface, 8);
      // Thumbnail placeholder
      createRect(frame, mainX + 16, oy + 8, 64, 64, PALETTE.bgElevated, 6);
      createText(frame, mainX + 100, oy + 12, order.product, 14, PALETTE.textPrimary, fontName, false);
      createText(frame, mainX + 100, oy + 34, order.date + "  |  " + order.id, 11, PALETTE.textMuted, fontName, false);
      createText(frame, mainX + 100, oy + 54, order.price, 15, PALETTE.accent, fontName, true);
      // Status badge
      var badgeColor = order.status === "배송완료" ? PALETTE.bgElevated : PALETTE.brandBlue;
      createRect(frame, mainX + mainW - 88, oy + 28, 72, 24, badgeColor, 12);
      createButtonText(frame, mainX + mainW - 88, oy + 28, 72, 24, order.status, 11, PALETTE.textPrimary, fontName, false);
    }
    secY += 3 * 92 + 24;

    // ── Main area: 최근 피팅 이력
    createText(frame, mainX, secY, "최근 피팅 이력", 20, PALETTE.textPrimary, fontName, true);
    createText(frame, mainX + mainW - 80, secY + 4, "전체보기 →", 13, PALETTE.textMuted, fontName, false);
    secY += 40;

    var gallCols = 3;
    var gallW = Math.floor((mainW - (gallCols - 1) * 16) / gallCols);
    for (var fi = 0; fi < gallCols; fi += 1) {
      var fitting = MOCK_FITTINGS[fi];
      var fx = mainX + fi * (gallW + 16);
      var fy = secY;
      createRect(frame, fx, fy, gallW, 140, PALETTE.bgSurface, 8);
      // 3D fitting preview placeholder
      createRect(frame, fx + 12, fy + 12, gallW - 24, 80, PALETTE.bgElevated, 6);
      createText(frame, fx + gallW / 2 - 16, fy + 44, "3D 피팅", 12, PALETTE.textMuted, fontName, false);
      createText(frame, fx + 12, fy + 102, fitting.label, 12, PALETTE.textSecondary, fontName, false);
      createText(frame, fx + 12, fy + 120, fitting.fit, 13, PALETTE.brandOrange, fontName, true);
    }
    secY += 140 + 24;

    // ── Main area: 체형 정보 요약
    createText(frame, mainX, secY, "내 체형 정보", 20, PALETTE.textPrimary, fontName, true);
    secY += 40;
    createRect(frame, mainX, secY, mainW, 120, PALETTE.bgSurface, 10);
    var bodyFields = [
      { label: "키", value: MOCK_PROFILE.height },
      { label: "체중", value: MOCK_PROFILE.weight },
      { label: "상의 사이즈", value: MOCK_PROFILE.topSize },
      { label: "하의 사이즈", value: MOCK_PROFILE.bottomSize },
      { label: "신발 사이즈", value: MOCK_PROFILE.shoeSize },
      { label: "체형 유형", value: MOCK_PROFILE.bodyType }
    ];
    var colW = Math.floor(mainW / 6);
    for (var bi = 0; bi < bodyFields.length; bi += 1) {
      var bx = mainX + bi * colW + 16;
      createText(frame, bx, secY + 24, bodyFields[bi].label, 11, PALETTE.textMuted, fontName, false);
      createText(frame, bx, secY + 44, bodyFields[bi].value, 16, PALETTE.textPrimary, fontName, true);
    }
    createRect(frame, mainX + 16, secY + 80, mainW - 32, 28, PALETTE.bgElevated, 6);
    createButtonText(frame, mainX + 16, secY + 80, mainW - 32, 28, "체형 정보 수정하기", 12, PALETTE.textSecondary, fontName, false);

  } else {
    // ── Mobile layout: stacked sections

    // Profile card
    createRect(frame, pad, y, contentW, 160, PALETTE.bgSurface, 12);
    createRect(frame, pad + 16, y + 24, 64, 64, PALETTE.bgElevated, 32);
    createText(frame, pad + 32, y + 44, "MJ", 18, PALETTE.textSecondary, fontName, true);
    createText(frame, pad + 96, y + 28, MOCK_PROFILE.name, 18, PALETTE.textPrimary, fontName, true);
    createText(frame, pad + 96, y + 52, MOCK_PROFILE.email, 11, PALETTE.textMuted, fontName, false);
    createText(frame, pad + 96, y + 72, "가입일 " + MOCK_PROFILE.joinDate, 11, PALETTE.textMuted, fontName, false);
    createRect(frame, pad + 16, y + 104, contentW - 32, 1, PALETTE.border);
    createText(frame, pad + 16, y + 116, "주문 12건", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, pad + contentW / 2 - 20, y + 116, "피팅 28회", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, pad + contentW - 76, y + 116, "3,200P", 13, PALETTE.brandOrange, fontName, true);
    y += 172;

    // Quick nav grid
    var qnavItems = ["주문 내역", "피팅 이력", "배송지", "체형정보"];
    var qW = Math.floor((contentW - 12) / 2);
    for (var qi = 0; qi < qnavItems.length; qi += 1) {
      var qCol = qi % 2;
      var qRow = Math.floor(qi / 2);
      var qx = pad + qCol * (qW + 12);
      var qy = y + qRow * 60;
      createRect(frame, qx, qy, qW, 48, PALETTE.bgSurface, 8);
      createText(frame, qx + 16, qy + 15, qnavItems[qi], 14, PALETTE.textSecondary, fontName, false);
    }
    y += 2 * 60 + 16;

    // Recent orders
    createText(frame, pad, y, "최근 주문", 18, PALETTE.textPrimary, fontName, true);
    createText(frame, pad + contentW - 56, y + 3, "전체보기", 12, PALETTE.textMuted, fontName, false);
    y += 36;
    for (var moi = 0; moi < 3; moi += 1) {
      var morder = MOCK_ORDERS[moi];
      createRect(frame, pad, y, contentW, 80, PALETTE.bgSurface, 8);
      createRect(frame, pad + 12, y + 8, 56, 56, PALETTE.bgElevated, 6);
      createText(frame, pad + 80, y + 12, morder.product, 13, PALETTE.textPrimary, fontName, false);
      createText(frame, pad + 80, y + 32, morder.date, 11, PALETTE.textMuted, fontName, false);
      createText(frame, pad + 80, y + 52, morder.price, 14, PALETTE.accent, fontName, true);
      createRect(frame, pad + contentW - 72, y + 28, 60, 22, PALETTE.bgElevated, 11);
      createButtonText(frame, pad + contentW - 72, y + 28, 60, 22, morder.status, 10, PALETTE.textSecondary, fontName, false);
      y += 92;
    }
    y += 8;

    // Recent fittings
    createText(frame, pad, y, "최근 피팅 이력", 18, PALETTE.textPrimary, fontName, true);
    createText(frame, pad + contentW - 56, y + 3, "전체보기", 12, PALETTE.textMuted, fontName, false);
    y += 36;
    var mfitW = Math.floor((contentW - 12) / 2);
    for (var mfi = 0; mfi < 4; mfi += 1) {
      var mfit = MOCK_FITTINGS[mfi];
      var mfCol = mfi % 2;
      var mfRow = Math.floor(mfi / 2);
      var mfx = pad + mfCol * (mfitW + 12);
      var mfy = y + mfRow * 148;
      createRect(frame, mfx, mfy, mfitW, 136, PALETTE.bgSurface, 8);
      createRect(frame, mfx + 8, mfy + 8, mfitW - 16, 80, PALETTE.bgElevated, 6);
      createText(frame, mfx + 8, mfy + 96, mfit.label, 11, PALETTE.textSecondary, fontName, false);
      createText(frame, mfx + 8, mfy + 114, mfit.fit, 12, PALETTE.brandOrange, fontName, true);
    }
    y += 2 * 148 + 16;

    // Body info
    createText(frame, pad, y, "내 체형 정보", 18, PALETTE.textPrimary, fontName, true);
    y += 36;
    createRect(frame, pad, y, contentW, 110, PALETTE.bgSurface, 10);
    var mbFields = [
      { label: "키", value: MOCK_PROFILE.height },
      { label: "체중", value: MOCK_PROFILE.weight },
      { label: "상의", value: MOCK_PROFILE.topSize },
      { label: "하의", value: MOCK_PROFILE.bottomSize }
    ];
    var mbColW = Math.floor(contentW / 4);
    for (var mbi = 0; mbi < mbFields.length; mbi += 1) {
      var mbx = pad + mbi * mbColW + 8;
      createText(frame, mbx, y + 20, mbFields[mbi].label, 10, PALETTE.textMuted, fontName, false);
      createText(frame, mbx, y + 38, mbFields[mbi].value, 15, PALETTE.textPrimary, fontName, true);
    }
    createRect(frame, pad + 12, y + 72, contentW - 24, 28, PALETTE.bgElevated, 6);
    createButtonText(frame, pad + 12, y + 72, contentW - 24, 28, "체형 정보 수정", 12, PALETTE.textSecondary, fontName, false);
  }
}

// ─────────────────────────────────────────────
// FRAME 3: ProfileEdit-PC
// ─────────────────────────────────────────────
function drawProfileEdit(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var formW = 640;
  var formX = pad + 272;
  var y = 136;

  // Sidebar nav (reuse pattern)
  var sideW = 240;
  createRect(frame, pad, y, sideW, 320, PALETTE.bgSurface, 12);
  createRect(frame, pad + 80, y + 24, 80, 80, PALETTE.bgElevated, 40);
  createText(frame, pad + 104, y + 52, "MJ", 24, PALETTE.textSecondary, fontName, true);
  createText(frame, pad + 60, y + 120, MOCK_PROFILE.name, 18, PALETTE.textPrimary, fontName, true);
  createText(frame, pad + 48, y + 146, MOCK_PROFILE.email, 11, PALETTE.textMuted, fontName, false);
  var sideNavItems = ["프로필 수정", "체형 정보 관리", "주문 내역", "피팅 이력", "배송지 관리", "로그아웃"];
  for (var sni = 0; sni < sideNavItems.length; sni += 1) {
    var sny = y + 178 + sni * 32;
    var isActive = sni === 0 || sni === 1;
    createText(frame, pad + 20, sny, sideNavItems[sni], 13,
      sni === 5 ? PALETTE.textMuted : (isActive ? PALETTE.textPrimary : PALETTE.textSecondary),
      fontName, isActive);
  }

  // ── Main: 프로필 수정 폼
  createText(frame, formX, y, "프로필 수정", 28, PALETTE.textPrimary, fontName, true);
  y += 48;

  // Avatar edit area
  createRect(frame, formX, y, 96, 96, PALETTE.bgElevated, 48);
  createText(frame, formX + 20, y + 36, "MJ", 28, PALETTE.textSecondary, fontName, true);
  createRect(frame, formX + 64, y + 64, 28, 28, PALETTE.bgSurface, 14);
  createText(frame, formX + 71, y + 71, "+", 14, PALETTE.textSecondary, fontName, true);
  createText(frame, formX + 112, y + 16, "프로필 사진 변경", 14, PALETTE.textSecondary, fontName, false);
  createText(frame, formX + 112, y + 36, "JPG, PNG (최대 5MB)", 11, PALETTE.textMuted, fontName, false);
  createRect(frame, formX + 112, y + 56, 120, 32, PALETTE.bgSurface, 6);
  createButtonText(frame, formX + 112, y + 56, 120, 32, "사진 업로드", 12, PALETTE.textSecondary, fontName, false);
  y += 120;

  // Basic info fields
  createText(frame, formX, y, "기본 정보", 18, PALETTE.textPrimary, fontName, true);
  y += 32;
  var profileFields = [
    { label: "이름", value: MOCK_PROFILE.name },
    { label: "이메일", value: MOCK_PROFILE.email },
    { label: "전화번호", value: MOCK_PROFILE.phone },
    { label: "생년월일", value: "2001.03.15" }
  ];
  for (var pfi = 0; pfi < profileFields.length; pfi += 1) {
    var pfy = y + pfi * 76;
    createText(frame, formX, pfy, profileFields[pfi].label, 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, formX, pfy + 20, formW, 48, PALETTE.bgSurface, 6);
    createRect(frame, formX, pfy + 66, formW, 2, PALETTE.border);
    createText(frame, formX + 16, pfy + 34, profileFields[pfi].value, 14, PALETTE.textPrimary, fontName, false);
  }
  y += profileFields.length * 76 + 16;

  // Body info section
  createText(frame, formX, y, "체형 정보", 18, PALETTE.textPrimary, fontName, true);
  y += 32;
  var bodyRows = [
    [{ label: "키", value: MOCK_PROFILE.height }, { label: "체중", value: MOCK_PROFILE.weight }],
    [{ label: "상의 사이즈", value: MOCK_PROFILE.topSize }, { label: "하의 사이즈", value: MOCK_PROFILE.bottomSize }],
    [{ label: "신발 사이즈", value: MOCK_PROFILE.shoeSize }, { label: "체형 유형", value: MOCK_PROFILE.bodyType }]
  ];
  for (var bri = 0; bri < bodyRows.length; bri += 1) {
    var row = bodyRows[bri];
    for (var bci = 0; bci < row.length; bci += 1) {
      var bfy = y + bri * 76;
      var bfx = formX + bci * (formW / 2 + 8);
      var bfw = formW / 2 - 8;
      createText(frame, bfx, bfy, row[bci].label, 13, PALETTE.textSecondary, fontName, false);
      createRect(frame, bfx, bfy + 20, bfw, 48, PALETTE.bgSurface, 6);
      createRect(frame, bfx, bfy + 66, bfw, 2, PALETTE.border);
      createText(frame, bfx + 16, bfy + 34, row[bci].value, 14, PALETTE.textPrimary, fontName, false);
    }
  }
  y += bodyRows.length * 76 + 32;

  // Save / Cancel buttons
  createRect(frame, formX, y, 200, 52, PALETTE.accent, 8);
  createButtonText(frame, formX, y, 200, 52, "변경 사항 저장", 15, PALETTE.bgBase, fontName, true);
  createRect(frame, formX + 216, y, 140, 52, PALETTE.bgSurface, 8);
  createButtonText(frame, formX + 216, y, 140, 52, "취소", 15, PALETTE.textSecondary, fontName, false);
}

// ─────────────────────────────────────────────
// FRAME 4: OrderHistory-PC
// ─────────────────────────────────────────────
function drawOrderHistory(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var sideW = 240;
  var mainX = pad + sideW + 32;
  var mainW = spec.width - pad - mainX;
  var y = 136;

  // Sidebar
  createRect(frame, pad, y, sideW, 280, PALETTE.bgSurface, 12);
  createRect(frame, pad + 80, y + 24, 80, 80, PALETTE.bgElevated, 40);
  createText(frame, pad + 104, y + 52, "MJ", 24, PALETTE.textSecondary, fontName, true);
  createText(frame, pad + 60, y + 120, MOCK_PROFILE.name, 18, PALETTE.textPrimary, fontName, true);
  var ohNavItems = ["프로필 수정", "체형 정보 관리", "주문 내역", "피팅 이력", "배송지 관리", "로그아웃"];
  for (var ohni = 0; ohni < ohNavItems.length; ohni += 1) {
    var ohny = y + 148 + ohni * 32;
    var ohActive = ohni === 2;
    if (ohActive) {
      createRect(frame, pad, ohny - 4, sideW, 28, PALETTE.bgElevated, 4);
    }
    createText(frame, pad + 20, ohny, ohNavItems[ohni], 13,
      ohni === 5 ? PALETTE.textMuted : (ohActive ? PALETTE.textPrimary : PALETTE.textSecondary),
      fontName, ohActive);
  }

  // Main: 주문 내역
  createText(frame, mainX, y, "주문 내역", 28, PALETTE.textPrimary, fontName, true);
  y += 48;

  // Filter tabs
  var filters = ["전체 (12)", "배송중 (1)", "배송완료 (10)", "반품/취소 (1)"];
  var tabX = mainX;
  for (var ti = 0; ti < filters.length; ti += 1) {
    var tabW = ti === 0 ? 88 : ti === 2 ? 112 : 88;
    createRect(frame, tabX, y, tabW, 36, ti === 0 ? PALETTE.accent : PALETTE.bgSurface, 18);
    createButtonText(frame, tabX, y, tabW, 36, filters[ti], 12,
      ti === 0 ? PALETTE.bgBase : PALETTE.textSecondary, fontName, ti === 0);
    tabX += tabW + 8;
  }
  y += 52;

  // Order rows
  for (var ori = 0; ori < 4; ori += 1) {
    var ord = MOCK_ORDERS[ori];
    createRect(frame, mainX, y, mainW, 100, PALETTE.bgSurface, 10);
    // Thumb
    createRect(frame, mainX + 16, y + 16, 68, 68, PALETTE.bgElevated, 6);
    // Info
    createText(frame, mainX + 100, y + 16, ord.product, 15, PALETTE.textPrimary, fontName, true);
    createText(frame, mainX + 100, y + 40, "주문일: " + ord.date, 12, PALETTE.textMuted, fontName, false);
    createText(frame, mainX + 100, y + 60, "주문번호: " + ord.id, 11, PALETTE.textMuted, fontName, false);
    createText(frame, mainX + 100, y + 78, ord.price, 16, PALETTE.accent, fontName, true);
    // Status + buttons
    var badgeW = 80;
    var badgeColor2 = ord.status === "배송완료" ? PALETTE.bgElevated : PALETTE.brandBlue;
    createRect(frame, mainX + mainW - badgeW - 16, y + 16, badgeW, 28, badgeColor2, 14);
    createButtonText(frame, mainX + mainW - badgeW - 16, y + 16, badgeW, 28, ord.status, 12, PALETTE.textPrimary, fontName, false);
    createRect(frame, mainX + mainW - 164, y + 56, 72, 28, PALETTE.bgSurface, 6);
    createButtonText(frame, mainX + mainW - 164, y + 56, 72, 28, "상세보기", 11, PALETTE.textSecondary, fontName, false);
    createRect(frame, mainX + mainW - 84, y + 56, 68, 28, PALETTE.bgSurface, 6);
    createButtonText(frame, mainX + mainW - 84, y + 56, 68, 28, "재구매", 11, PALETTE.textSecondary, fontName, false);
    y += 116;
  }

  // Pagination
  y += 16;
  var pageNums = ["1", "2", "3"];
  var pageX = mainX + mainW / 2 - 60;
  for (var pi = 0; pi < pageNums.length; pi += 1) {
    var isActivePage = pi === 0;
    createRect(frame, pageX + pi * 40, y, 32, 32, isActivePage ? PALETTE.accent : PALETTE.bgSurface, 4);
    createButtonText(frame, pageX + pi * 40, y, 32, 32, pageNums[pi], 13,
      isActivePage ? PALETTE.bgBase : PALETTE.textSecondary, fontName, isActivePage);
  }
}

// ─────────────────────────────────────────────
// FRAME 5: FittingGallery-PC
// ─────────────────────────────────────────────
function drawFittingGallery(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var sideW = 240;
  var mainX = pad + sideW + 32;
  var mainW = spec.width - pad - mainX;
  var y = 136;

  // Sidebar
  createRect(frame, pad, y, sideW, 280, PALETTE.bgSurface, 12);
  createRect(frame, pad + 80, y + 24, 80, 80, PALETTE.bgElevated, 40);
  createText(frame, pad + 104, y + 52, "MJ", 24, PALETTE.textSecondary, fontName, true);
  createText(frame, pad + 60, y + 120, MOCK_PROFILE.name, 18, PALETTE.textPrimary, fontName, true);
  var fgNavItems = ["프로필 수정", "체형 정보 관리", "주문 내역", "피팅 이력", "배송지 관리", "로그아웃"];
  for (var fgni = 0; fgni < fgNavItems.length; fgni += 1) {
    var fgny = y + 148 + fgni * 32;
    var fgActive = fgni === 3;
    if (fgActive) {
      createRect(frame, pad, fgny - 4, sideW, 28, PALETTE.bgElevated, 4);
    }
    createText(frame, pad + 20, fgny, fgNavItems[fgni], 13,
      fgni === 5 ? PALETTE.textMuted : (fgActive ? PALETTE.textPrimary : PALETTE.textSecondary),
      fontName, fgActive);
  }

  // Main: 피팅 이력 갤러리
  createText(frame, mainX, y, "피팅 이력 갤러리", 28, PALETTE.textPrimary, fontName, true);
  createText(frame, mainX + mainW - 180, y + 8, "총 28개의 피팅 기록", 13, PALETTE.textMuted, fontName, false);
  y += 52;

  // Sort / Filter bar
  createRect(frame, mainX, y, mainW, 44, PALETTE.bgSurface, 8);
  createText(frame, mainX + 16, y + 13, "정렬: 최신순 ▾", 13, PALETTE.textSecondary, fontName, false);
  createText(frame, mainX + 160, y + 13, "기간: 전체 ▾", 13, PALETTE.textSecondary, fontName, false);
  createText(frame, mainX + 296, y + 13, "카테고리: 전체 ▾", 13, PALETTE.textSecondary, fontName, false);
  y += 60;

  // Gallery grid: 3 columns
  var cols = 3;
  var gap = 16;
  var cardW = Math.floor((mainW - gap * (cols - 1)) / cols);
  var cardH = 240;

  for (var gi = 0; gi < 6; gi += 1) {
    var gCol = gi % cols;
    var gRow = Math.floor(gi / cols);
    var gx = mainX + gCol * (cardW + gap);
    var gy = y + gRow * (cardH + gap);
    var gfit = MOCK_FITTINGS[gi];

    createRect(frame, gx, gy, cardW, cardH, PALETTE.bgSurface, 10);
    // 3D model preview area
    createRect(frame, gx + 12, gy + 12, cardW - 24, 148, PALETTE.bgElevated, 8);
    createText(frame, gx + cardW / 2 - 24, gy + 76, "3D 피팅", 14, PALETTE.textMuted, fontName, false);
    // Fit score badge
    createRect(frame, gx + cardW - 72, gy + 16, 60, 24, PALETTE.brandOrange, 12);
    createButtonText(frame, gx + cardW - 72, gy + 16, 60, 24, gfit.fit, 10, PALETTE.white, fontName, true);
    // Info
    createText(frame, gx + 12, gy + 172, gfit.label, 13, PALETTE.textPrimary, fontName, true);
    createText(frame, gx + 12, gy + 192, gfit.date, 11, PALETTE.textMuted, fontName, false);
    createText(frame, gx + 12, gy + 212, gfit.note, 11, PALETTE.textSecondary, fontName, false);
  }
}

// ─────────────────────────────────────────────
// FRAME 6: Address-PC
// ─────────────────────────────────────────────
function drawAddress(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var sideW = 240;
  var mainX = pad + sideW + 32;
  var mainW = spec.width - pad - mainX;
  var y = 136;

  // Sidebar
  createRect(frame, pad, y, sideW, 280, PALETTE.bgSurface, 12);
  createRect(frame, pad + 80, y + 24, 80, 80, PALETTE.bgElevated, 40);
  createText(frame, pad + 104, y + 52, "MJ", 24, PALETTE.textSecondary, fontName, true);
  createText(frame, pad + 60, y + 120, MOCK_PROFILE.name, 18, PALETTE.textPrimary, fontName, true);
  var adNavItems = ["프로필 수정", "체형 정보 관리", "주문 내역", "피팅 이력", "배송지 관리", "로그아웃"];
  for (var adni = 0; adni < adNavItems.length; adni += 1) {
    var adny = y + 148 + adni * 32;
    var adActive = adni === 4;
    if (adActive) {
      createRect(frame, pad, adny - 4, sideW, 28, PALETTE.bgElevated, 4);
    }
    createText(frame, pad + 20, adny, adNavItems[adni], 13,
      adni === 5 ? PALETTE.textMuted : (adActive ? PALETTE.textPrimary : PALETTE.textSecondary),
      fontName, adActive);
  }

  // Main: 배송지 관리
  createText(frame, mainX, y, "배송지 관리", 28, PALETTE.textPrimary, fontName, true);
  y += 52;

  // Add new address button
  createRect(frame, mainX, y, mainW, 56, PALETTE.bgSurface, 10);
  createRect(frame, mainX + 20, y + 14, 28, 28, PALETTE.bgElevated, 14);
  createText(frame, mainX + 29, y + 19, "+", 16, PALETTE.textSecondary, fontName, true);
  createText(frame, mainX + 60, y + 19, "새 배송지 추가", 15, PALETTE.textSecondary, fontName, false);
  y += 72;

  // Address cards
  for (var ai = 0; ai < MOCK_ADDRESSES.length; ai += 1) {
    var addr = MOCK_ADDRESSES[ai];
    createRect(frame, mainX, y, mainW, 160, PALETTE.bgSurface, 10);
    if (addr.isDefault) {
      createRect(frame, mainX + 16, y + 16, 52, 24, PALETTE.brandOrange, 12);
      createButtonText(frame, mainX + 16, y + 16, 52, 24, "기본", 11, PALETTE.white, fontName, true);
    }
    createText(frame, mainX + (addr.isDefault ? 80 : 16), y + 20, addr.label, 16, PALETTE.textPrimary, fontName, true);
    createText(frame, mainX + 16, y + 56, addr.name + "  |  " + addr.phone, 14, PALETTE.textSecondary, fontName, false);
    createText(frame, mainX + 16, y + 80, addr.addr, 14, PALETTE.textPrimary, fontName, false);
    createText(frame, mainX + 16, y + 100, addr.detail + "  (" + addr.zip + ")", 13, PALETTE.textMuted, fontName, false);
    // Action buttons
    createRect(frame, mainX + mainW - 220, y + 116, 96, 32, PALETTE.bgElevated, 6);
    createButtonText(frame, mainX + mainW - 220, y + 116, 96, 32, "수정", 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, mainX + mainW - 116, y + 116, 96, 32, PALETTE.bgElevated, 6);
    createButtonText(frame, mainX + mainW - 116, y + 116, 96, 32, "삭제", 13, PALETTE.textSecondary, fontName, false);
    if (!addr.isDefault) {
      createRect(frame, mainX + 16, y + 116, 120, 32, PALETTE.bgSurface, 6);
      createButtonText(frame, mainX + 16, y + 116, 120, 32, "기본 배송지 설정", 12, PALETTE.textSecondary, fontName, false);
    }
    y += 176;
  }

  // Address form (add new)
  createText(frame, mainX, y, "새 배송지 입력", 20, PALETTE.textPrimary, fontName, true);
  y += 36;
  var formW = mainW;
  var addrFields = [
    { label: "수령인", value: "" },
    { label: "연락처", value: "" },
    { label: "우편번호", value: "" },
    { label: "주소", value: "" },
    { label: "상세 주소", value: "" },
    { label: "배송지 별칭", value: "" }
  ];
  for (var adf = 0; adf < addrFields.length; adf += 1) {
    var adfy = y + adf * 72;
    createText(frame, mainX, adfy, addrFields[adf].label, 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, mainX, adfy + 20, formW, 44, PALETTE.bgSurface, 6);
    createRect(frame, mainX, adfy + 62, formW, 2, PALETTE.border);
    createText(frame, mainX + 16, adfy + 32, addrFields[adf].value || "입력해 주세요", 14,
      PALETTE.textMuted, fontName, false);
  }
  y += addrFields.length * 72 + 24;
  createRect(frame, mainX, y, 200, 52, PALETTE.accent, 8);
  createButtonText(frame, mainX, y, 200, 52, "배송지 저장", 15, PALETTE.bgBase, fontName, true);
  createRect(frame, mainX + 216, y, 120, 52, PALETTE.bgSurface, 8);
  createButtonText(frame, mainX + 216, y, 120, 52, "취소", 15, PALETTE.textSecondary, fontName, false);
}

// ─────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────
async function buildFramesByCategory(targetCategory) {
  var fontFamily = await loadFontSafe();
  var specs = [];
  if (targetCategory === "all") {
    specs = FRAME_SPECS;
  } else {
    for (var i = 0; i < FRAME_SPECS.length; i += 1) {
      if (FRAME_SPECS[i].category === targetCategory) {
        specs.push(FRAME_SPECS[i]);
      }
    }
  }
  var offsetX = 0;
  for (var j = 0; j < specs.length; j += 1) {
    var spec = specs[j];
    var frame = figma.createFrame();
    frame.name = spec.name;
    frame.resize(spec.width, spec.height);
    frame.x = offsetX;
    frame.fills = [{ type: "SOLID", color: PALETTE.bgBase }];
    if (spec.category === "mypage") {
      drawMyPage(frame, spec, fontFamily);
    } else if (spec.category === "profile-edit") {
      drawProfileEdit(frame, spec, fontFamily);
    } else if (spec.category === "order-history") {
      drawOrderHistory(frame, spec, fontFamily);
    } else if (spec.category === "fitting-gallery") {
      drawFittingGallery(frame, spec, fontFamily);
    } else if (spec.category === "address") {
      drawAddress(frame, spec, fontFamily);
    }
    figma.viewport.scrollAndZoomIntoView([frame]);
    offsetX += spec.width + 80;
  }
  figma.notify("" + specs.length + "개 프레임 생성 완료");
}

figma.ui.onmessage = async function(msg) {
  try {
    if (!msg || !msg.type) { return; }
    if (msg.type === "all") {
      await buildFramesByCategory("all");
    } else if (msg.type === "mypage") {
      await buildFramesByCategory("mypage");
    } else if (msg.type === "profile-edit") {
      await buildFramesByCategory("profile-edit");
    } else if (msg.type === "order-history") {
      await buildFramesByCategory("order-history");
    } else if (msg.type === "fitting-gallery") {
      await buildFramesByCategory("fitting-gallery");
    } else if (msg.type === "address") {
      await buildFramesByCategory("address");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
