figma.showUI(__html__, { width: 360, height: 560 });

var FRAME_SPECS = [
  { name: "Search-PC", width: 1440, height: 1200, category: "page" },
  { name: "Search-Mobile", width: 375, height: 1400, category: "page" },
  { name: "Search-NoResult", width: 1440, height: 800, category: "component" },
  { name: "Search-RecentKeywords", width: 1440, height: 800, category: "component" }
];

var CATEGORY_COLOR = {
  page: { r: 0.067, g: 0.067, b: 0.067 },
  component: { r: 0.200, g: 0.200, b: 0.200 }
};

var PALETTE = {
  bgBase: { r: 0.067, g: 0.067, b: 0.067 },
  bgSurface: { r: 0.129, g: 0.129, b: 0.129 },
  bgElevated: { r: 0.200, g: 0.200, b: 0.200 },
  border: { r: 0.380, g: 0.380, b: 0.380 },
  textPrimary: { r: 0.976, g: 0.976, b: 0.976 },
  textSecondary: { r: 0.741, g: 0.741, b: 0.741 },
  textMuted: { r: 0.620, g: 0.620, b: 0.620 },
  accent: { r: 0.976, g: 0.976, b: 0.976 },
  brandOrange: { r: 0.976, g: 0.976, b: 0.976 },
  brandBlue: { r: 0.620, g: 0.620, b: 0.620 },
  success: { r: 0.741, g: 0.741, b: 0.741 },
  white: { r: 1, g: 1, b: 1 }
};

var MOCK_SUGGESTIONS = [
  "오버사이즈 코트",
  "데님 팬츠",
  "나이키 스니커즈",
  "울 니트 스웨터",
  "가죽 재킷"
];

var MOCK_RECENT = [
  "오버사이즈 코트",
  "청바지 추천",
  "나이키 에어맥스",
  "패딩 점퍼",
  "린넨 셔츠"
];

var MOCK_POPULAR = [
  "봄 자켓",
  "와이드 팬츠",
  "크롭 티셔츠",
  "아디다스 운동화",
  "스트라이프 셔츠",
  "데님 미니스커트",
  "후드 집업",
  "슬링백 힐"
];

var MOCK_CATEGORIES = ["전체", "상의", "하의", "아우터", "신발", "가방", "액세서리"];
var MOCK_BRANDS = ["나이키", "아디다스", "자라", "H&M", "유니클로", "무신사"];
var MOCK_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

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
  createText(frame, 24, 12, spec.name, 18, PALETTE.textPrimary, fontName, true);
  createText(frame, 24, 34, spec.category + " · " + spec.width + "×" + spec.height, 11, PALETTE.textSecondary, fontName, false);
}

function drawNavbar(frame, spec, fontName) {
  createRect(frame, 0, 48, spec.width, 64, PALETTE.bgSurface);
  createText(frame, 24, 68, "옷차원", 20, PALETTE.accent, fontName, true);
  if (spec.width > 400) {
    createText(frame, spec.width - 300, 72, "상품  피팅  장바구니  로그인", 14, PALETTE.textSecondary, fontName, false);
  }
}

function drawSearchBar(frame, x, y, w, fontName, showCursor) {
  // Search bar background
  createRect(frame, x, y, w, 52, PALETTE.bgSurface, 8);
  // Border highlight
  createRect(frame, x, y + 50, w, 2, PALETTE.brandOrange);
  // Search icon placeholder
  createRect(frame, x + 16, y + 16, 20, 20, PALETTE.textMuted, 4);
  createText(frame, x + 19, y + 18, "S", 12, PALETTE.bgSurface, fontName, true);
  // Placeholder text
  if (showCursor) {
    createText(frame, x + 48, y + 16, "검색어를 입력하세요...", 16, PALETTE.textMuted, fontName, false);
    // Cursor indicator
    createRect(frame, x + 48, y + 14, 2, 24, PALETTE.brandOrange);
  } else {
    createText(frame, x + 48, y + 16, "오버사이즈 코트", 16, PALETTE.textPrimary, fontName, false);
  }
  // Clear button
  createRect(frame, x + w - 48, y + 14, 24, 24, PALETTE.bgElevated, 12);
  createText(frame, x + w - 42, y + 17, "✕", 12, PALETTE.textMuted, fontName, false);
  // Search button
  createRect(frame, x + w - 120, y + 8, 68, 36, PALETTE.brandOrange, 6);
  createButtonText(frame, x + w - 120, y + 8, 68, 36, "검색", 14, PALETTE.white, fontName, true);
}

function drawAutocomplete(frame, x, y, w, fontName) {
  // Autocomplete dropdown panel
  createRect(frame, x, y, w, 188, PALETTE.bgSurface, 8);
  createRect(frame, x, y, w, 1, PALETTE.border);
  createText(frame, x + 16, y + 10, "추천 검색어", 11, PALETTE.textMuted, fontName, false);
  for (var i = 0; i < MOCK_SUGGESTIONS.length; i += 1) {
    var itemY = y + 30 + i * 30;
    // Highlight first item
    if (i === 0) {
      createRect(frame, x, itemY - 4, w, 30, PALETTE.bgElevated);
      createText(frame, x + 48, itemY + 4, MOCK_SUGGESTIONS[i], 14, PALETTE.brandOrange, fontName, true);
    } else {
      createText(frame, x + 48, itemY + 4, MOCK_SUGGESTIONS[i], 14, PALETTE.textSecondary, fontName, false);
    }
    // Search icon prefix
    createRect(frame, x + 16, itemY + 2, 16, 16, PALETTE.bgElevated, 3);
  }
}

function drawFilterPanel(frame, x, y, w, fontName) {
  var panelH = 380;
  createRect(frame, x, y, w, panelH, PALETTE.bgSurface, 10);
  createRect(frame, x, y, w, 1, PALETTE.border);

  var col = 0;
  var colW = (w - 48) / 4;
  var colX = x + 16;

  // Category filter
  createText(frame, colX + col * (colW + 16), y + 16, "카테고리", 13, PALETTE.textSecondary, fontName, true);
  for (var ci = 0; ci < MOCK_CATEGORIES.length; ci += 1) {
    var cy = y + 40 + ci * 28;
    var isSelected = ci === 0;
    if (isSelected) {
      createRect(frame, colX + col * (colW + 16) - 8, cy - 2, colW + 8, 24, PALETTE.bgElevated, 4);
      createText(frame, colX + col * (colW + 16), cy + 2, MOCK_CATEGORIES[ci], 13, PALETTE.brandOrange, fontName, true);
    } else {
      createText(frame, colX + col * (colW + 16), cy + 2, MOCK_CATEGORIES[ci], 13, PALETTE.textSecondary, fontName, false);
    }
  }
  col += 1;

  // Price range filter
  createText(frame, colX + col * (colW + 16), y + 16, "가격대", 13, PALETTE.textSecondary, fontName, true);
  var priceRanges = ["전체", "~5만원", "5~10만원", "10~20만원", "20만원~"];
  for (var pi = 0; pi < priceRanges.length; pi += 1) {
    var py = y + 40 + pi * 28;
    createText(frame, colX + col * (colW + 16), py + 2, priceRanges[pi], 13, PALETTE.textSecondary, fontName, false);
  }
  // Price range slider bar
  var sliderY = y + 185;
  createRect(frame, colX + col * (colW + 16), sliderY, colW, 4, PALETTE.border, 2);
  createRect(frame, colX + col * (colW + 16), sliderY, colW * 0.6, 4, PALETTE.brandOrange, 2);
  createRect(frame, colX + col * (colW + 16) - 6, sliderY - 6, 16, 16, PALETTE.brandOrange, 8);
  createRect(frame, colX + col * (colW + 16) + colW * 0.6 - 6, sliderY - 6, 16, 16, PALETTE.brandOrange, 8);
  col += 1;

  // Brand filter
  createText(frame, colX + col * (colW + 16), y + 16, "브랜드", 13, PALETTE.textSecondary, fontName, true);
  for (var bi = 0; bi < MOCK_BRANDS.length; bi += 1) {
    var biy = y + 40 + bi * 28;
    var bSelected = bi === 0 || bi === 2;
    // Checkbox
    createRect(frame, colX + col * (colW + 16), biy + 2, 14, 14, bSelected ? PALETTE.brandOrange : PALETTE.bgElevated, 3);
    if (bSelected) {
      createText(frame, colX + col * (colW + 16) + 2, biy + 2, "v", 10, PALETTE.white, fontName, true);
    }
    createText(frame, colX + col * (colW + 16) + 22, biy + 2, MOCK_BRANDS[bi], 13, bSelected ? PALETTE.textPrimary : PALETTE.textSecondary, fontName, bSelected);
  }
  col += 1;

  // Size filter
  createText(frame, colX + col * (colW + 16), y + 16, "사이즈", 13, PALETTE.textSecondary, fontName, true);
  for (var si = 0; si < MOCK_SIZES.length; si += 1) {
    var sRow = Math.floor(si / 3);
    var sCol = si % 3;
    var sx = colX + col * (colW + 16) + sCol * 44;
    var sy = y + 40 + sRow * 44;
    var sSelected = si === 2;
    createRect(frame, sx, sy, 36, 32, sSelected ? PALETTE.brandOrange : PALETTE.bgElevated, 6);
    createButtonText(frame, sx, sy, 36, 32, MOCK_SIZES[si], 12, sSelected ? PALETTE.white : PALETTE.textSecondary, fontName, sSelected);
  }

  // Apply / Reset buttons at bottom of panel
  createRect(frame, x + 16, y + panelH - 56, 120, 40, PALETTE.bgElevated, 6);
  createButtonText(frame, x + 16, y + panelH - 56, 120, 40, "초기화", 13, PALETTE.textSecondary, fontName, false);
  createRect(frame, x + w - 136, y + panelH - 56, 120, 40, PALETTE.brandOrange, 6);
  createButtonText(frame, x + w - 136, y + panelH - 56, 120, 40, "필터 적용", 13, PALETTE.white, fontName, true);
}

function drawSearchResults(frame, x, y, w, cols, fontName) {
  var gap = 24;
  var cardW = (w - gap * (cols - 1)) / cols;
  var cardH = cardW * 1.3;
  var items = [
    { name: "오버사이즈 울 코트", brand: "무신사 스탠다드", price: "89,000원", tag: "베스트" },
    { name: "캐시미어 롱 코트", brand: "자라", price: "129,000원", tag: "신상" },
    { name: "더블 브레스트 코트", brand: "H&M", price: "69,000원", tag: "" },
    { name: "체크 패턴 코트", brand: "유니클로", price: "59,000원", tag: "할인" }
  ];
  var count = cols === 2 ? 2 : 4;
  for (var i = 0; i < count; i += 1) {
    var item = items[i % items.length];
    var cx = x + (i % cols) * (cardW + gap);
    var cy = y + Math.floor(i / cols) * (cardH + 80);
    // Card background
    createRect(frame, cx, cy, cardW, cardH, PALETTE.bgSurface, 8);
    // Tag badge
    if (item.tag !== "") {
      createRect(frame, cx + 8, cy + 8, 36, 20, PALETTE.brandOrange, 4);
      createText(frame, cx + 10, cy + 11, item.tag, 10, PALETTE.white, fontName, true);
    }
    // AI fitting button
    createRect(frame, cx + cardW - 60, cy + 8, 52, 22, PALETTE.brandBlue, 4);
    createText(frame, cx + cardW - 54, cy + 13, "AI피팅", 10, PALETTE.white, fontName, true);
    // Product info
    createRect(frame, cx, cy + cardH + 8, cardW * 0.85, 14, PALETTE.bgElevated, 3);
    createText(frame, cx, cy + cardH + 8, item.name, 13, PALETTE.textPrimary, fontName, false);
    createRect(frame, cx, cy + cardH + 28, cardW * 0.55, 11, PALETTE.bgElevated, 3);
    createText(frame, cx, cy + cardH + 28, item.brand, 11, PALETTE.textMuted, fontName, false);
    createText(frame, cx, cy + cardH + 48, item.price, 15, PALETTE.accent, fontName, true);
  }
}

function drawSearchPC(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var contentW = spec.width - pad * 2;
  var y = 136;

  // Page title
  createText(frame, pad, y, "검색", 28, PALETTE.textPrimary, fontName, true);
  y += 44;

  // Search bar
  drawSearchBar(frame, pad, y, contentW, fontName, false);
  y += 68;

  // Autocomplete dropdown
  drawAutocomplete(frame, pad, y, contentW, fontName);
  y += 204;

  // Active filter chips row
  createText(frame, pad, y, "적용된 필터:", 13, PALETTE.textMuted, fontName, false);
  var chipLabels = ["카테고리: 아우터", "브랜드: 나이키", "사이즈: M"];
  for (var ci = 0; ci < chipLabels.length; ci += 1) {
    var chipX = pad + 100 + ci * 140;
    createRect(frame, chipX, y - 2, 128, 26, PALETTE.bgElevated, 13);
    createText(frame, chipX + 10, y + 2, chipLabels[ci], 11, PALETTE.textSecondary, fontName, false);
    createText(frame, chipX + 110, y + 2, "✕", 11, PALETTE.textMuted, fontName, false);
  }
  y += 36;

  // Filter panel
  drawFilterPanel(frame, pad, y, contentW, fontName);
  y += 396;

  // Result count + sort
  createText(frame, pad, y, "검색 결과 248개", 15, PALETTE.textPrimary, fontName, true);
  createRect(frame, contentW + pad - 140, y - 4, 140, 32, PALETTE.bgSurface, 6);
  createText(frame, contentW + pad - 132, y + 4, "인기순  ▾", 13, PALETTE.textSecondary, fontName, false);
  y += 44;

  // Product grid (4 columns)
  drawSearchResults(frame, pad, y, contentW, 4, fontName);
}

function drawSearchMobile(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 16;
  var contentW = spec.width - pad * 2;
  var y = 136;

  // Page title
  createText(frame, pad, y, "검색", 22, PALETTE.textPrimary, fontName, true);
  y += 36;

  // Search bar (mobile, no inline search button — full width)
  createRect(frame, pad, y, contentW, 52, PALETTE.bgSurface, 8);
  createRect(frame, pad, y + 50, contentW, 2, PALETTE.brandOrange);
  createRect(frame, pad + 14, y + 16, 20, 20, PALETTE.textMuted, 4);
  createText(frame, pad + 17, y + 18, "S", 12, PALETTE.bgSurface, fontName, true);
  createText(frame, pad + 44, y + 16, "오버사이즈 코트", 15, PALETTE.textPrimary, fontName, false);
  createRect(frame, pad + contentW - 36, y + 14, 24, 24, PALETTE.bgElevated, 12);
  createText(frame, pad + contentW - 30, y + 17, "✕", 12, PALETTE.textMuted, fontName, false);
  y += 68;

  // Mobile autocomplete (compact)
  createRect(frame, pad, y, contentW, 160, PALETTE.bgSurface, 8);
  createText(frame, pad + 14, y + 10, "추천 검색어", 11, PALETTE.textMuted, fontName, false);
  for (var ai = 0; ai < 4; ai += 1) {
    var aiy = y + 28 + ai * 30;
    if (ai === 0) {
      createRect(frame, pad, aiy - 4, contentW, 30, PALETTE.bgElevated);
      createText(frame, pad + 40, aiy + 4, MOCK_SUGGESTIONS[ai], 13, PALETTE.brandOrange, fontName, true);
    } else {
      createText(frame, pad + 40, aiy + 4, MOCK_SUGGESTIONS[ai], 13, PALETTE.textSecondary, fontName, false);
    }
    createRect(frame, pad + 14, aiy + 2, 14, 14, PALETTE.bgElevated, 3);
  }
  y += 176;

  // Filter chips row (horizontal scroll)
  var filterChips = ["카테고리", "가격대", "브랜드", "사이즈"];
  for (var fi = 0; fi < filterChips.length; fi += 1) {
    var chipX = pad + fi * 80;
    var isActive = fi === 0;
    createRect(frame, chipX, y, 72, 30, isActive ? PALETTE.brandOrange : PALETTE.bgSurface, 15);
    createButtonText(frame, chipX, y, 72, 30, filterChips[fi], 12, isActive ? PALETTE.white : PALETTE.textSecondary, fontName, isActive);
  }
  y += 44;

  // Result count
  createText(frame, pad, y, "검색 결과 248개", 14, PALETTE.textPrimary, fontName, true);
  y += 32;

  // Product grid (2 columns, mobile)
  drawSearchResults(frame, pad, y, contentW, 2, fontName);
}

function drawNoResult(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var contentW = spec.width - pad * 2;
  var y = 136;

  // Search bar (with no result query)
  createRect(frame, pad, y, contentW, 52, PALETTE.bgSurface, 8);
  createRect(frame, pad, y + 50, contentW, 2, PALETTE.border);
  createRect(frame, pad + 16, y + 16, 20, 20, PALETTE.textMuted, 4);
  createText(frame, pad + 19, y + 18, "S", 12, PALETTE.bgSurface, fontName, true);
  createText(frame, pad + 48, y + 16, "블루베리 드레스", 16, PALETTE.textPrimary, fontName, false);
  createRect(frame, pad + contentW - 120, y + 8, 68, 36, PALETTE.brandOrange, 6);
  createButtonText(frame, pad + contentW - 120, y + 8, 68, 36, "검색", 14, PALETTE.white, fontName, true);
  y += 72;

  // Empty state illustration area
  var cx = spec.width / 2;
  createRect(frame, cx - 60, y + 20, 120, 120, PALETTE.bgSurface, 60);
  createButtonText(frame, cx - 60, y + 20, 120, 120, "?", 48, PALETTE.border, fontName, true);
  y += 164;

  // No result message
  createText(frame, cx - 180, y, "'블루베리 드레스' 검색 결과가 없습니다.", 22, PALETTE.textPrimary, fontName, true);
  y += 40;
  createText(frame, cx - 200, y, "다른 검색어를 사용하거나 필터를 변경해 보세요.", 15, PALETTE.textSecondary, fontName, false);
  y += 56;

  // Suggestions box
  createRect(frame, pad, y, contentW, 100, PALETTE.bgSurface, 10);
  createText(frame, pad + 24, y + 16, "검색 제안", 14, PALETTE.textSecondary, fontName, true);
  var suggestions = ["블루베리 컬러 원피스", "플로럴 드레스", "미디 원피스"];
  for (var sui = 0; sui < suggestions.length; sui += 1) {
    createText(frame, pad + 24 + sui * 240, y + 48, suggestions[sui], 14, PALETTE.brandOrange, fontName, false);
    createRect(frame, pad + 24 + sui * 240 - 2, y + 66, 160, 1, PALETTE.brandOrange);
  }
  y += 120;

  // Popular searches section
  createText(frame, pad, y, "인기 검색어", 18, PALETTE.textPrimary, fontName, true);
  y += 32;
  for (var pi = 0; pi < 4; pi += 1) {
    var px = pad + pi * 240;
    createRect(frame, px, y, 216, 40, PALETTE.bgSurface, 8);
    createText(frame, px + 12, y + 12, "" + (pi + 1) + ".  " + MOCK_POPULAR[pi], 14, PALETTE.textSecondary, fontName, false);
  }
  y += 60;

  // Trending categories
  createText(frame, pad, y, "추천 카테고리", 18, PALETTE.textPrimary, fontName, true);
  y += 32;
  var trendCats = ["아우터", "원피스", "니트", "스니커즈"];
  for (var ti = 0; ti < trendCats.length; ti += 1) {
    var tx = pad + ti * 180;
    createRect(frame, tx, y, 160, 48, PALETTE.bgElevated, 8);
    createButtonText(frame, tx, y, 160, 48, trendCats[ti], 14, PALETTE.textPrimary, fontName, false);
  }
}

function drawRecentKeywords(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);

  var pad = 80;
  var contentW = spec.width - pad * 2;
  var y = 136;

  // Search bar (focused, cursor visible, empty)
  drawSearchBar(frame, pad, y, contentW, fontName, true);
  y += 68;

  // Two-column layout: recent | popular
  var colW = (contentW - 48) / 2;
  var leftX = pad;
  var rightX = pad + colW + 48;

  // --- Recent keywords column ---
  createRect(frame, leftX, y, colW, 360, PALETTE.bgSurface, 10);
  createText(frame, leftX + 20, y + 20, "최근 검색어", 16, PALETTE.textPrimary, fontName, true);
  createText(frame, leftX + colW - 70, y + 22, "전체 삭제", 13, PALETTE.textMuted, fontName, false);
  createRect(frame, leftX + 20, y + 48, colW - 40, 1, PALETTE.border);

  for (var ri = 0; ri < MOCK_RECENT.length; ri += 1) {
    var ry = y + 60 + ri * 52;
    createRect(frame, leftX + 20, ry, colW - 40, 44, PALETTE.bgElevated, 6);
    // Clock icon
    createRect(frame, leftX + 32, ry + 14, 16, 16, PALETTE.border, 8);
    createText(frame, leftX + 35, ry + 16, "C", 10, PALETTE.textMuted, fontName, false);
    createText(frame, leftX + 60, ry + 14, MOCK_RECENT[ri], 14, PALETTE.textSecondary, fontName, false);
    // Delete chip
    createText(frame, leftX + colW - 44, ry + 14, "✕", 12, PALETTE.textMuted, fontName, false);
  }

  // --- Popular keywords column ---
  createRect(frame, rightX, y, colW, 360, PALETTE.bgSurface, 10);
  createText(frame, rightX + 20, y + 20, "인기 검색어", 16, PALETTE.textPrimary, fontName, true);
  createText(frame, rightX + colW - 80, y + 22, "기준: 실시간", 11, PALETTE.textMuted, fontName, false);
  createRect(frame, rightX + 20, y + 48, colW - 40, 1, PALETTE.border);

  for (var pki = 0; pki < MOCK_POPULAR.length; pki += 1) {
    var pky = y + 60 + pki * 36;
    var rankColor = pki < 3 ? PALETTE.brandOrange : PALETTE.textMuted;
    createText(frame, rightX + 20, pky + 8, "" + (pki + 1), 14, rankColor, fontName, true);
    createText(frame, rightX + 48, pky + 8, MOCK_POPULAR[pki], 14, PALETTE.textSecondary, fontName, false);
    // Trend indicator
    if (pki < 3) {
      createText(frame, rightX + colW - 60, pky + 8, "▲ 상승", 11, PALETTE.success, fontName, false);
    } else if (pki === 3) {
      createText(frame, rightX + colW - 56, pky + 8, "— 유지", 11, PALETTE.textMuted, fontName, false);
    } else {
      createText(frame, rightX + colW - 60, pky + 8, "▼ 하락", 11, PALETTE.brandBlue, fontName, false);
    }
  }
  y += 376;

  // Quick category shortcuts
  createText(frame, pad, y, "카테고리 바로가기", 18, PALETTE.textPrimary, fontName, true);
  y += 36;
  for (var qci = 0; qci < MOCK_CATEGORIES.length; qci += 1) {
    var qcx = pad + qci * 180;
    var isFirst = qci === 0;
    createRect(frame, qcx, y, 160, 48, isFirst ? PALETTE.brandOrange : PALETTE.bgSurface, 8);
    createButtonText(frame, qcx, y, 160, 48, MOCK_CATEGORIES[qci], 14, isFirst ? PALETTE.white : PALETTE.textSecondary, fontName, isFirst);
  }
}

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
    if (spec.name === "Search-Mobile") {
      drawSearchMobile(frame, spec, fontFamily);
    } else if (spec.name === "Search-PC") {
      drawSearchPC(frame, spec, fontFamily);
    } else if (spec.name === "Search-NoResult") {
      drawNoResult(frame, spec, fontFamily);
    } else if (spec.name === "Search-RecentKeywords") {
      drawRecentKeywords(frame, spec, fontFamily);
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
    } else if (msg.type === "page") {
      await buildFramesByCategory("page");
    } else if (msg.type === "component") {
      await buildFramesByCategory("component");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
