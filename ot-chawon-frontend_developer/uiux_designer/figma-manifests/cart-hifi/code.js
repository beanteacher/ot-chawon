figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "Cart-PC", width: 1440, height: 1000, category: "cart" },
  { name: "Cart-Mobile", width: 375, height: 1400, category: "cart" },
  { name: "Cart-Empty-PC", width: 1440, height: 600, category: "cart" },
  { name: "Cart-Empty-Mobile", width: 375, height: 600, category: "cart" }
];

var CATEGORY_COLOR = {
  cart: { r: 0.200, g: 0.200, b: 0.200 },
  page: { r: 0.067, g: 0.067, b: 0.067 }
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

function drawCartEmpty(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var cx = spec.width / 2;
  createText(frame, cx - 80, 200, "장바구니가 비어있습니다", 22, PALETTE.textPrimary, fontName, true);
  createText(frame, cx - 120, 240, "마음에 드는 상품을 장바구니에 담아보세요.", 14, PALETTE.textSecondary, fontName, false);
  createRect(frame, cx - 100, 290, 200, 52, PALETTE.accent, 8);
  createButtonText(frame, cx - 100, 290, 200, 52, "쇼핑 계속하기", 14, PALETTE.bgBase, fontName, true);
}

function drawCart(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var y = 140;

  createText(frame, pad, y, "장바구니 (3)", isMobile ? 22 : 30, PALETTE.textPrimary, fontName, true);
  y += isMobile ? 36 : 52;

  // Cart items list
  var items = [
    { name: "슬림핏 코튼 티셔츠", size: "M", price: "39,000원", qty: "1" },
    { name: "와이드 데님 팬츠", size: "L", price: "65,000원", qty: "2" },
    { name: "오버핏 후드 집업", size: "M", price: "89,000원", qty: "1" }
  ];

  var listW = isMobile ? spec.width - pad * 2 : spec.width - pad * 2 - 360;

  for (var i = 0; i < items.length; i += 1) {
    var item = items[i];
    var iy = y + i * (isMobile ? 120 : 100);
    createRect(frame, pad, iy, listW, isMobile ? 108 : 88, PALETTE.bgSurface, 8);
    // Thumbnail
    createRect(frame, pad + 12, iy + 12, isMobile ? 72 : 64, isMobile ? 84 : 64, PALETTE.bgElevated, 6);
    // Item info
    var infoX = pad + 12 + (isMobile ? 84 : 76);
    createText(frame, infoX, iy + 14, item.name, isMobile ? 14 : 15, PALETTE.textPrimary, fontName, true);
    createText(frame, infoX, iy + 36, "사이즈: " + item.size, 12, PALETTE.textMuted, fontName, false);
    createText(frame, infoX, iy + 54, item.price, 15, PALETTE.accent, fontName, true);
    // Qty controls
    var qx = pad + listW - (isMobile ? 96 : 110);
    createRect(frame, qx, iy + (isMobile ? 60 : 28), isMobile ? 84 : 96, 32, PALETTE.bgElevated, 6);
    createText(frame, qx + 8, iy + (isMobile ? 68 : 36), "-  " + item.qty + "  +", 13, PALETTE.textSecondary, fontName, false);
  }

  y += items.length * (isMobile ? 120 : 100) + 24;

  // Order summary (PC sidebar or bottom)
  if (isMobile) {
    createRect(frame, pad, y, listW, 200, PALETTE.bgSurface, 10);
    createText(frame, pad + 16, y + 20, "주문 요약", 16, PALETTE.textPrimary, fontName, true);
    createText(frame, pad + 16, y + 52, "상품 금액", 14, PALETTE.textSecondary, fontName, false);
    createText(frame, pad + listW - 100, y + 52, "193,000원", 14, PALETTE.textPrimary, fontName, false);
    createText(frame, pad + 16, y + 80, "배송비", 14, PALETTE.textSecondary, fontName, false);
    createText(frame, pad + listW - 60, y + 80, "무료", 14, PALETTE.success, fontName, true);
    createRect(frame, pad + 16, y + 108, listW - 32, 1, PALETTE.border);
    createText(frame, pad + 16, y + 124, "총 결제 금액", 15, PALETTE.textPrimary, fontName, true);
    createText(frame, pad + listW - 120, y + 124, "193,000원", 18, PALETTE.accent, fontName, true);
    createRect(frame, pad, y + 152, listW, 48, PALETTE.accent, 8);
    createButtonText(frame, pad, y + 152, listW, 48, "주문하기", 16, PALETTE.bgBase, fontName, true);
  } else {
    var sumX = spec.width - pad - 320;
    var sumY = 192;
    createRect(frame, sumX, sumY, 320, 280, PALETTE.bgSurface, 10);
    createText(frame, sumX + 20, sumY + 24, "주문 요약", 18, PALETTE.textPrimary, fontName, true);
    createText(frame, sumX + 20, sumY + 64, "상품 금액", 14, PALETTE.textSecondary, fontName, false);
    createText(frame, sumX + 220, sumY + 64, "193,000원", 14, PALETTE.textPrimary, fontName, false);
    createText(frame, sumX + 20, sumY + 96, "배송비", 14, PALETTE.textSecondary, fontName, false);
    createText(frame, sumX + 260, sumY + 96, "무료", 14, PALETTE.success, fontName, true);
    createRect(frame, sumX + 20, sumY + 128, 280, 1, PALETTE.border);
    createText(frame, sumX + 20, sumY + 144, "총 결제 금액", 15, PALETTE.textPrimary, fontName, true);
    createText(frame, sumX + 160, sumY + 144, "193,000원", 20, PALETTE.accent, fontName, true);
    createRect(frame, sumX + 20, sumY + 192, 280, 52, PALETTE.accent, 8);
    createButtonText(frame, sumX + 20, sumY + 192, 280, 52, "주문하기", 16, PALETTE.bgBase, fontName, true);
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
    if (spec.name.indexOf("Empty") !== -1) {
      drawCartEmpty(frame, spec, fontFamily);
    } else {
      drawCart(frame, spec, fontFamily);
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
    } else if (msg.type === "cart") {
      await buildFramesByCategory("cart");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
