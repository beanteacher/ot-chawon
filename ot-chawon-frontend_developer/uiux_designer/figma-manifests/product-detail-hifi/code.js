figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "ProductDetail-PC", width: 1440, height: 1800, category: "page" },
  { name: "ProductDetail-Mobile", width: 375, height: 2200, category: "page" }
];

var CATEGORY_COLOR = {
  page: { r: 0.067, g: 0.067, b: 0.067 },
  product: { r: 0.200, g: 0.200, b: 0.200 }
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
  brandBlue: { r: 0.620, g: 0.620, b: 0.620 },
  success: { r: 0.741, g: 0.741, b: 0.741 },
  warning: { r: 0.620, g: 0.620, b: 0.620 },
  error: { r: 0.741, g: 0.741, b: 0.741 },
  white: { r: 1, g: 1, b: 1 }
};

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
  text.characters = content;
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
  text.characters = content;
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
    createText(frame, spec.width - 240, 72, "상품  피팅  장바구니  로그인", 14, PALETTE.textSecondary, fontName, false);
  }
}

function drawProductDetail(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var y = 130;

  // Breadcrumb
  createText(frame, pad, y, "홈 > 상품 > 티셔츠", 12, PALETTE.textMuted, fontName, false);
  y += 28;

  if (isMobile) {
    // Mobile: stacked layout
    createRect(frame, 0, y, spec.width, 375, PALETTE.bgSurface);
    y += 391;
    // Thumbnails
    for (var t = 0; t < 4; t += 1) {
      createRect(frame, pad + t * 80, y, 68, 68, PALETTE.bgElevated, 6);
    }
    y += 84;
    createText(frame, pad, y, "브랜드명", 13, PALETTE.textMuted, fontName, false);
    y += 22;
    createText(frame, pad, y, "슬림핏 코튼 티셔츠", 22, PALETTE.textPrimary, fontName, true);
    y += 36;
    createText(frame, pad, y, "★★★★☆  (128개 리뷰)", 13, PALETTE.accent, fontName, false);
    y += 30;
    createText(frame, pad, y, "39,000원", 24, PALETTE.accent, fontName, true);
    y += 40;
    // Size selector
    createText(frame, pad, y, "사이즈", 14, PALETTE.textSecondary, fontName, false);
    y += 24;
    var mSizes = ["XS", "S", "M", "L", "XL"];
    for (var i = 0; i < mSizes.length; i += 1) {
      createRect(frame, pad + i * 56, y, 48, 40, i === 2 ? PALETTE.accent : PALETTE.bgElevated, 6);
      createText(frame, pad + i * 56 + 14, y + 12, mSizes[i], 13, i === 2 ? PALETTE.bgBase : PALETTE.textSecondary, fontName, false);
    }
    y += 56;
    // AI Fitting button
    createRect(frame, pad, y, spec.width - pad * 2, 48, PALETTE.brandBlue, 8);
    createText(frame, pad + 50, y + 14, "AI 피팅으로 사이즈 추천받기", 14, PALETTE.white, fontName, true);
    y += 64;
    // Add to cart / Buy
    var halfW = (spec.width - pad * 2 - 12) / 2;
    createRect(frame, pad, y, halfW, 52, PALETTE.bgElevated, 8);
    createText(frame, pad + 20, y + 16, "장바구니 담기", 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, pad + halfW + 12, y, halfW, 52, PALETTE.accent, 8);
    createButtonText(frame, pad + halfW + 12, y, halfW, 52, "바로 구매하기", 13, PALETTE.bgBase, fontName, true);
    y += 72;
    // Product description
    createText(frame, pad, y, "상품 설명", 18, PALETTE.textPrimary, fontName, true);
    y += 32;
    createRect(frame, pad, y, spec.width - pad * 2, 160, PALETTE.bgSurface, 6);
    y += 176;
    // Reviews
    createText(frame, pad, y, "리뷰 (128)", 18, PALETTE.textPrimary, fontName, true);
    y += 40;
    for (var r = 0; r < 3; r += 1) {
      createRect(frame, pad, y + r * 120, spec.width - pad * 2, 108, PALETTE.bgSurface, 6);
      createText(frame, pad + 16, y + r * 120 + 16, "사용자" + (r + 1), 13, PALETTE.textSecondary, fontName, true);
      createText(frame, pad + 16, y + r * 120 + 38, "★★★★★", 12, PALETTE.accent, fontName, false);
      createText(frame, pad + 16, y + r * 120 + 60, "정말 마음에 듭니다. 사이즈도 딱 맞아요!", 13, PALETTE.textPrimary, fontName, false);
    }
  } else {
    // PC: side-by-side layout
    var imgW = 560;
    var infoX = pad + imgW + 80;
    var infoW = spec.width - infoX - pad;
    // Main image
    createRect(frame, pad, y, imgW, 560, PALETTE.bgSurface, 8);
    // Thumbnails below image
    for (var th = 0; th < 5; th += 1) {
      createRect(frame, pad + th * 104, y + 576, 96, 96, PALETTE.bgElevated, 6);
    }
    // Product info
    createText(frame, infoX, y, "브랜드명", 14, PALETTE.textMuted, fontName, false);
    createText(frame, infoX, y + 28, "슬림핏 코튼 티셔츠", 32, PALETTE.textPrimary, fontName, true);
    createText(frame, infoX, y + 80, "★★★★☆  (128개 리뷰)", 14, PALETTE.accent, fontName, false);
    createText(frame, infoX, y + 112, "39,000원", 32, PALETTE.accent, fontName, true);
    // Size selector
    createText(frame, infoX, y + 168, "사이즈 선택", 15, PALETTE.textSecondary, fontName, false);
    var pcSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    for (var s = 0; s < pcSizes.length; s += 1) {
      createRect(frame, infoX + s * 68, y + 196, 60, 48, s === 2 ? PALETTE.accent : PALETTE.bgElevated, 6);
      createText(frame, infoX + s * 68 + 18, y + 210, pcSizes[s], 13, s === 2 ? PALETTE.bgBase : PALETTE.textSecondary, fontName, false);
    }
    // AI Fitting button
    createRect(frame, infoX, y + 264, infoW, 52, PALETTE.brandBlue, 8);
    createText(frame, infoX + infoW / 2 - 100, y + 280, "AI 피팅으로 사이즈 추천받기", 15, PALETTE.white, fontName, true);
    // Cart / Buy buttons
    var pcHalfW = (infoW - 16) / 2;
    createRect(frame, infoX, y + 332, pcHalfW, 56, PALETTE.bgElevated, 8);
    createText(frame, infoX + 40, y + 348, "장바구니 담기", 14, PALETTE.textSecondary, fontName, false);
    createRect(frame, infoX + pcHalfW + 16, y + 332, pcHalfW, 56, PALETTE.accent, 8);
    createButtonText(frame, infoX + pcHalfW + 16, y + 332, pcHalfW, 56, "바로 구매하기", 14, PALETTE.bgBase, fontName, true);

    var y2 = y + 700;
    // Description
    createText(frame, pad, y2, "상품 설명", 22, PALETTE.textPrimary, fontName, true);
    createRect(frame, pad, y2 + 40, spec.width - pad * 2, 240, PALETTE.bgSurface, 8);
    y2 += 300;
    // Reviews
    createText(frame, pad, y2, "리뷰 (128)", 22, PALETTE.textPrimary, fontName, true);
    y2 += 48;
    var reviewHalfW = (spec.width - pad * 2 - 24) / 2;
    for (var rv = 0; rv < 3; rv += 1) {
      var rx = pad + (rv % 2) * (reviewHalfW + 24);
      var ry = y2 + Math.floor(rv / 2) * 160;
      createRect(frame, rx, ry, reviewHalfW, 140, PALETTE.bgSurface, 8);
      createText(frame, rx + 20, ry + 20, "사용자" + (rv + 1), 14, PALETTE.textSecondary, fontName, true);
      createText(frame, rx + 20, ry + 46, "★★★★★", 13, PALETTE.accent, fontName, false);
      createText(frame, rx + 20, ry + 70, "정말 마음에 듭니다. 사이즈도 딱 맞아요!", 13, PALETTE.textPrimary, fontName, false);
    }
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
    drawProductDetail(frame, spec, fontFamily);
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
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
