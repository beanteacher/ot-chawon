figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "MainPage-PC", width: 1440, height: 4200, category: "main" },
  { name: "MainPage-Mobile", width: 375, height: 5200, category: "main" }
];

var CATEGORY_COLOR = {
  main: { r: 0.380, g: 0.380, b: 0.380 },
  page: { r: 0.067, g: 0.067, b: 0.067 },
  hero: { r: 0.380, g: 0.380, b: 0.380 }
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
  createText(frame, 24, 12, spec.name, 18, PALETTE.white, fontName, true);
  createText(frame, 24, 34, spec.category + " · " + spec.width + "×" + spec.height, 11, PALETTE.white, fontName, false);
}

function drawNavbar(frame, spec, fontName) {
  createRect(frame, 0, 48, spec.width, 64, PALETTE.bgSurface);
  createText(frame, 24, 68, "옷차원", 20, PALETTE.accent, fontName, true);
  if (spec.width > 400) {
    createText(frame, spec.width - 240, 72, "상품  피팅  장바구니  로그인", 14, PALETTE.textSecondary, fontName, false);
  }
}

function drawMainPage(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 24 : 80;
  var y = 130;

  // Hero Section
  createRect(frame, 0, y, spec.width, isMobile ? 480 : 600, PALETTE.bgSurface);
  createText(frame, pad, y + 60, "AI가 추천하는", isMobile ? 28 : 48, PALETTE.textSecondary, fontName, false);
  createText(frame, pad, y + (isMobile ? 100 : 120), "나만의 완벽한 핏", isMobile ? 36 : 64, PALETTE.accent, fontName, true);
  createText(frame, pad, y + (isMobile ? 150 : 210), "체형을 분석하고 나에게 맞는 옷을 추천해드립니다.", isMobile ? 14 : 18, PALETTE.textSecondary, fontName, false);
  createRect(frame, pad, y + (isMobile ? 220 : 300), isMobile ? 180 : 220, 52, PALETTE.accent, 8);
  createButtonText(frame, pad, y + (isMobile ? 220 : 300), isMobile ? 180 : 220, 52, "피팅 시작하기", isMobile ? 14 : 16, PALETTE.bgBase, fontName, true);
  y += isMobile ? 500 : 640;

  // Featured Products Section
  createText(frame, pad, y, "추천 상품", isMobile ? 22 : 32, PALETTE.textPrimary, fontName, true);
  y += 48;
  var cols = isMobile ? 2 : 4;
  var cardW = isMobile ? (spec.width - pad * 2 - 16) / 2 : (spec.width - pad * 2 - 24 * 3) / 4;
  for (var i = 0; i < cols; i += 1) {
    var cx = pad + i * (cardW + 24);
    createRect(frame, cx, y, cardW, cardW, PALETTE.bgSurface, 8);
    createRect(frame, cx, y + cardW + 8, cardW, 16, PALETTE.bgElevated, 4);
    createRect(frame, cx, y + cardW + 32, cardW * 0.6, 12, PALETTE.bgElevated, 4);
    createRect(frame, cx, y + cardW + 52, cardW * 0.4, 12, PALETTE.accent, 4);
  }
  y += cardW + 90;

  // Fitting CTA Section
  createRect(frame, 0, y, spec.width, isMobile ? 300 : 360, { r: 0.1, g: 0.12, b: 0.18 });
  createText(frame, pad, y + 60, "AI 피팅 서비스", isMobile ? 22 : 36, PALETTE.textPrimary, fontName, true);
  createText(frame, pad, y + (isMobile ? 100 : 120), "체형 정보를 입력하면 AI가 최적의 사이즈를 추천합니다.", isMobile ? 13 : 16, PALETTE.textSecondary, fontName, false);
  createRect(frame, pad, y + (isMobile ? 160 : 200), isMobile ? 160 : 200, 48, PALETTE.brandBlue, 8);
  createText(frame, pad + 16, y + (isMobile ? 176 : 216), "지금 시도하기", 14, PALETTE.white, fontName, true);
  y += isMobile ? 320 : 400;

  // New Arrivals Section
  createText(frame, pad, y, "신상품", isMobile ? 22 : 32, PALETTE.textPrimary, fontName, true);
  y += 48;
  var cols2 = isMobile ? 2 : 4;
  for (var j = 0; j < cols2; j += 1) {
    var cx2 = pad + j * (cardW + 24);
    createRect(frame, cx2, y, cardW, cardW * 1.2, PALETTE.bgElevated, 8);
    createRect(frame, cx2, y + cardW * 1.2 + 8, cardW, 16, PALETTE.bgSurface, 4);
    createRect(frame, cx2, y + cardW * 1.2 + 32, cardW * 0.5, 12, PALETTE.bgSurface, 4);
  }
  y += cardW * 1.2 + 80;

  // Footer
  createRect(frame, 0, y, spec.width, isMobile ? 200 : 160, PALETTE.bgSurface);
  createText(frame, pad, y + 40, "옷차원", 18, PALETTE.accent, fontName, true);
  createText(frame, pad, y + 72, "© 2026 옷차원. All rights reserved.", 12, PALETTE.textMuted, fontName, false);
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
    drawMainPage(frame, spec, fontFamily);
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
    } else if (msg.type === "main") {
      await buildFramesByCategory("main");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
