figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "ProductList-PC", width: 1440, height: 1200, category: "page" },
  { name: "ProductList-Mobile", width: 375, height: 1400, category: "page" }
];

var CATEGORY_COLOR = {
  page: { r: 0.067, g: 0.067, b: 0.067 },
  product: { r: 0.200, g: 0.200, b: 0.200 },
  main: { r: 0.380, g: 0.380, b: 0.380 }
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

function drawProductList(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var y = 130;

  // Page Title + Filter Bar
  createText(frame, pad, y, "전체 상품", isMobile ? 20 : 28, PALETTE.textPrimary, fontName, true);
  y += isMobile ? 36 : 48;
  var filterW = spec.width - pad * 2;
  createRect(frame, pad, y, filterW, 48, PALETTE.bgSurface, 6);
  createText(frame, pad + 16, y + 14, "카테고리  |  사이즈  |  가격  |  정렬", 13, PALETTE.textMuted, fontName, false);
  y += 64;

  // Product Grid
  var cols = isMobile ? 2 : 4;
  var gap = isMobile ? 12 : 24;
  var cardW = (filterW - gap * (cols - 1)) / cols;
  var cardH = cardW * 1.3;
  var rows = 2;
  for (var r = 0; r < rows; r += 1) {
    for (var c = 0; c < cols; c += 1) {
      var cx = pad + c * (cardW + gap);
      var cy = y + r * (cardH + 80);
      createRect(frame, cx, cy, cardW, cardH, PALETTE.bgSurface, 8);
      createRect(frame, cx, cy + cardH + 8, cardW * 0.8, 14, PALETTE.bgElevated, 3);
      createRect(frame, cx, cy + cardH + 28, cardW * 0.5, 11, PALETTE.bgElevated, 3);
      createRect(frame, cx, cy + cardH + 46, cardW * 0.4, 14, PALETTE.accent, 3);
      createRect(frame, cx + cardW - 60, cy + 8, 52, 22, PALETTE.brandBlue, 4);
      createText(frame, cx + cardW - 52, cy + 13, "AI피팅", 10, PALETTE.white, fontName, true);
    }
  }
  y += rows * (cardH + 80) + 20;

  // Pagination
  createRect(frame, pad + filterW / 2 - 100, y, 200, 40, PALETTE.bgSurface, 6);
  createText(frame, pad + filterW / 2 - 30, y + 12, "< 1 2 3 >", 14, PALETTE.textSecondary, fontName, false);
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
    drawProductList(frame, spec, fontFamily);
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
