figma.showUI(__html__, { width: 360, height: 540 });

var FRAME_SPECS = [
  { name: "OrderForm-PC", width: 1440, height: 1600, category: "order" },
  { name: "OrderForm-Mobile", width: 375, height: 2000, category: "order" },
  { name: "OrderComplete-PC", width: 1440, height: 700, category: "order-complete" },
  { name: "OrderComplete-Mobile", width: 375, height: 700, category: "order-complete" },
  { name: "OrderFail-PC", width: 1440, height: 600, category: "order-fail" },
  { name: "OrderFail-Mobile", width: 375, height: 600, category: "order-fail" }
];

var CATEGORY_COLOR = {
  order: { r: 0.200, g: 0.200, b: 0.200 },
  "order-complete": { r: 0.741, g: 0.741, b: 0.741 },
  "order-fail": { r: 0.620, g: 0.620, b: 0.620 },
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
  purple: { r: 0.620, g: 0.620, b: 0.620 },
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

function drawOrderForm(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var formW = isMobile ? spec.width - pad * 2 : 720;
  var formX = pad;
  var y = 140;

  createText(frame, formX, y, "주문서 작성", isMobile ? 22 : 30, PALETTE.textPrimary, fontName, true);
  y += isMobile ? 36 : 52;

  // Steps
  var steps = ["장바구니", "주문서 작성", "주문 완료"];
  for (var si = 0; si < steps.length; si += 1) {
    var sx = formX + si * (formW / 3);
    var stepColor = si === 1 ? PALETTE.purple : si < 1 ? PALETTE.success : PALETTE.bgElevated;
    createRect(frame, sx, y, formW / 3 - 8, 4, stepColor, 2);
    createText(frame, sx, y + 12, "" + (si + 1) + ". " + steps[si], 11, si === 1 ? PALETTE.purple : PALETTE.textMuted, fontName, si === 1);
  }
  y += 40;

  // Delivery info section
  createRect(frame, formX, y, formW, 48, PALETTE.bgSurface, 8);
  createText(frame, formX + 16, y + 14, "배송 정보", 15, PALETTE.textPrimary, fontName, true);
  y += 56;
  var delivFields = [
    { label: "수령인", ph: "홍길동" },
    { label: "연락처", ph: "010-1234-5678" },
    { label: "배송지 주소", ph: "서울특별시 강남구..." },
    { label: "배송 메모", ph: "문 앞에 놓아주세요" }
  ];
  for (var di = 0; di < delivFields.length; di += 1) {
    var fy = y + di * 76;
    createText(frame, formX, fy, delivFields[di].label, 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, formX, fy + 20, formW, 48, PALETTE.bgSurface, 6);
    createRect(frame, formX, fy + 66, formW, 2, PALETTE.border);
    createText(frame, formX + 12, fy + 34, delivFields[di].ph, 14, PALETTE.textMuted, fontName, false);
  }
  y += delivFields.length * 76 + 24;

  // Payment section
  createRect(frame, formX, y, formW, 48, PALETTE.bgSurface, 8);
  createText(frame, formX + 16, y + 14, "결제 수단", 15, PALETTE.textPrimary, fontName, true);
  y += 56;
  var methods = ["신용카드", "카카오페이", "네이버페이", "무통장입금"];
  for (var mi = 0; mi < methods.length; mi += 1) {
    var mx = formX + mi * (isMobile ? (formW + 8) / 2 : (formW + 8) / 4);
    var my = y + (isMobile ? Math.floor(mi / 2) * 56 : 0);
    var mw = isMobile ? (formW - 8) / 2 : (formW - 24) / 4;
    createRect(frame, mx, my, mw, 44, mi === 0 ? PALETTE.purple : PALETTE.bgSurface, 6);
    createText(frame, mx + 8, my + 14, methods[mi], 13, mi === 0 ? PALETTE.white : PALETTE.textSecondary, fontName, mi === 0);
  }
  y += (isMobile ? 120 : 56) + 32;

  // Order summary sidebar (PC) or bottom (Mobile)
  if (!isMobile) {
    var sumX = pad + 760;
    var sumY = 192;
    createRect(frame, sumX, sumY, 320, 400, PALETTE.bgSurface, 10);
    createText(frame, sumX + 20, sumY + 24, "주문 상품", 16, PALETTE.textPrimary, fontName, true);
    createRect(frame, sumX + 20, sumY + 56, 64, 64, PALETTE.bgElevated, 6);
    createText(frame, sumX + 96, sumY + 64, "슬림핏 코튼 티셔츠 / M", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, sumX + 96, sumY + 84, "39,000원", 15, PALETTE.accent, fontName, true);
    createRect(frame, sumX + 20, sumY + 136, 280, 1, PALETTE.border);
    createText(frame, sumX + 20, sumY + 152, "상품 금액", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, sumX + 220, sumY + 152, "39,000원", 13, PALETTE.textPrimary, fontName, false);
    createText(frame, sumX + 20, sumY + 180, "배송비", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, sumX + 262, sumY + 180, "무료", 13, PALETTE.success, fontName, true);
    createRect(frame, sumX + 20, sumY + 208, 280, 1, PALETTE.border);
    createText(frame, sumX + 20, sumY + 224, "최종 결제 금액", 15, PALETTE.textPrimary, fontName, true);
    createText(frame, sumX + 180, sumY + 224, "39,000원", 20, PALETTE.accent, fontName, true);
    createRect(frame, sumX + 20, sumY + 272, 280, 52, PALETTE.accent, 8);
    createButtonText(frame, sumX + 20, sumY + 272, 280, 52, "결제하기", 16, PALETTE.bgBase, fontName, true);
    createText(frame, sumX + 60, sumY + 344, "결제 시 개인정보 처리방침에 동의합니다.", 11, PALETTE.textMuted, fontName, false);
  } else {
    // Mobile: summary at bottom
    createRect(frame, formX, y, formW, 220, PALETTE.bgSurface, 10);
    createText(frame, formX + 16, y + 16, "결제 금액", 16, PALETTE.textPrimary, fontName, true);
    createText(frame, formX + 16, y + 48, "상품 금액", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, formX + formW - 100, y + 48, "39,000원", 13, PALETTE.textPrimary, fontName, false);
    createText(frame, formX + 16, y + 76, "배송비", 13, PALETTE.textSecondary, fontName, false);
    createText(frame, formX + formW - 52, y + 76, "무료", 13, PALETTE.success, fontName, true);
    createRect(frame, formX + 16, y + 104, formW - 32, 1, PALETTE.border);
    createText(frame, formX + 16, y + 120, "최종 결제 금액", 15, PALETTE.textPrimary, fontName, true);
    createText(frame, formX + formW - 120, y + 120, "39,000원", 18, PALETTE.accent, fontName, true);
    createRect(frame, formX, y + 156, formW, 48, PALETTE.accent, 8);
    createButtonText(frame, formX, y + 156, formW, 48, "결제하기", 15, PALETTE.bgBase, fontName, true);
  }
}

function drawOrderComplete(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var cx = spec.width / 2;

  // Success icon area
  createRect(frame, cx - 40, 160, 80, 80, PALETTE.success, 40);
  createText(frame, cx - 12, 190, "✓", 32, PALETTE.white, fontName, true);

  createText(frame, cx - (isMobile ? 100 : 140), 264, "주문이 완료되었습니다!", isMobile ? 22 : 32, PALETTE.textPrimary, fontName, true);
  createText(frame, cx - (isMobile ? 120 : 180), 308, "주문번호: OC-20260326-00123", isMobile ? 13 : 16, PALETTE.textMuted, fontName, false);

  // Order summary box
  var bw = isMobile ? spec.width - 48 : 480;
  var bx = (spec.width - bw) / 2;
  createRect(frame, bx, 350, bw, 160, PALETTE.bgSurface, 10);
  createText(frame, bx + 20, 374, "슬림핏 코튼 티셔츠 / M × 1", 14, PALETTE.textSecondary, fontName, false);
  createText(frame, bx + 20, 400, "배송지: 서울특별시 강남구 테헤란로 123", 13, PALETTE.textMuted, fontName, false);
  createText(frame, bx + 20, 424, "결제 금액: 39,000원", 15, PALETTE.accent, fontName, true);
  createText(frame, bx + 20, 456, "결제 수단: 신용카드", 13, PALETTE.textMuted, fontName, false);

  // CTA buttons
  var btnW = isMobile ? (spec.width - 48 - 12) / 2 : 200;
  createRect(frame, bx, 540, btnW, 48, PALETTE.accent, 8);
  createButtonText(frame, bx, 540, btnW, 48, "주문 내역 보기", 13, PALETTE.bgBase, fontName, true);
  createRect(frame, bx + btnW + 12, 540, btnW, 48, PALETTE.bgSurface, 8);
  createText(frame, bx + btnW + 12 + btnW / 2 - 40, 556, "쇼핑 계속하기", 13, PALETTE.textSecondary, fontName, false);
}

function drawOrderFail(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var cx = spec.width / 2;

  createRect(frame, cx - 40, 150, 80, 80, PALETTE.border, 40);
  createButtonText(frame, cx - 40, 150, 80, 80, "✕", 28, PALETTE.textPrimary, fontName, true);

  createText(frame, cx - (isMobile ? 90 : 120), 250, "결제에 실패했습니다.", isMobile ? 22 : 30, PALETTE.textPrimary, fontName, true);
  createText(frame, cx - (isMobile ? 120 : 180), 292, "결제 정보를 확인하고 다시 시도해 주세요.", isMobile ? 13 : 15, PALETTE.textSecondary, fontName, false);

  var bw = isMobile ? spec.width - 48 : 400;
  var bx = (spec.width - bw) / 2;
  createRect(frame, bx, 340, bw, 80, PALETTE.bgSurface, 10);
  createText(frame, bx + 20, 360, "오류 사유: 카드 한도 초과", 13, PALETTE.textSecondary, fontName, false);
  createText(frame, bx + 20, 384, "고객센터: 1588-0000", 13, PALETTE.textMuted, fontName, false);

  createRect(frame, bx, 448, bw, 48, PALETTE.accent, 8);
  createButtonText(frame, bx, 448, bw, 48, "다시 결제하기", 14, PALETTE.bgBase, fontName, true);
  createRect(frame, bx, 508, bw, 48, PALETTE.bgSurface, 8);
  createText(frame, bx + bw / 2 - 40, 524, "장바구니로 돌아가기", 13, PALETTE.textSecondary, fontName, false);
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
    if (spec.category === "order") {
      drawOrderForm(frame, spec, fontFamily);
    } else if (spec.category === "order-complete") {
      drawOrderComplete(frame, spec, fontFamily);
    } else if (spec.category === "order-fail") {
      drawOrderFail(frame, spec, fontFamily);
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
    } else if (msg.type === "order") {
      await buildFramesByCategory("order");
    } else if (msg.type === "order-complete") {
      await buildFramesByCategory("order-complete");
    } else if (msg.type === "order-fail") {
      await buildFramesByCategory("order-fail");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
