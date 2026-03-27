figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "FittingInput-PC", width: 1440, height: 1000, category: "page" },
  { name: "FittingInput-Mobile", width: 375, height: 1200, category: "page" }
];

var CATEGORY_COLOR = {
  page: { r: 0.067, g: 0.067, b: 0.067 },
  fitting: { r: 0.200, g: 0.200, b: 0.200 }
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

function drawFittingInput(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var formW = isMobile ? spec.width - pad * 2 : 600;
  var formX = isMobile ? pad : (spec.width - formW) / 2;
  var y = 140;

  // Page title
  createText(frame, formX, y, "AI 피팅 — 체형 정보 입력", isMobile ? 22 : 32, PALETTE.textPrimary, fontName, true);
  y += isMobile ? 36 : 52;
  createText(frame, formX, y, "정확한 사이즈 추천을 위해 체형 정보를 입력해 주세요.", isMobile ? 13 : 16, PALETTE.textSecondary, fontName, false);
  y += isMobile ? 32 : 48;

  // Step indicator
  var steps = ["체형 정보", "선호 스타일", "AI 추천"];
  for (var si = 0; si < steps.length; si += 1) {
    var sx = formX + si * (formW / 3);
    createRect(frame, sx, y, formW / 3 - 8, 4, si === 0 ? PALETTE.accent : PALETTE.bgElevated, 2);
    createText(frame, sx, y + 12, "" + (si + 1) + ". " + steps[si], 12, si === 0 ? PALETTE.accent : PALETTE.textMuted, fontName, si === 0);
  }
  y += 40;

  // Form fields
  var fields = [
    { label: "키 (cm)", placeholder: "예: 170" },
    { label: "몸무게 (kg)", placeholder: "예: 65" },
    { label: "어깨 너비 (cm)", placeholder: "예: 44" },
    { label: "가슴 둘레 (cm)", placeholder: "예: 96" },
    { label: "허리 둘레 (cm)", placeholder: "예: 78" },
    { label: "엉덩이 둘레 (cm)", placeholder: "예: 96" }
  ];
  var colCount = isMobile ? 1 : 2;
  var fieldW = isMobile ? formW : (formW - 24) / 2;
  for (var fi = 0; fi < fields.length; fi += 1) {
    var col = fi % colCount;
    var row = Math.floor(fi / colCount);
    var fx = formX + col * (fieldW + 24);
    var fy = y + row * 88;
    createText(frame, fx, fy, fields[fi].label, 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, fx, fy + 20, fieldW, 48, PALETTE.bgSurface, 6);
    createRect(frame, fx, fy + 66, fieldW, 2, PALETTE.border);
    createText(frame, fx + 12, fy + 34, fields[fi].placeholder, 14, PALETTE.textMuted, fontName, false);
  }
  var rowCount = Math.ceil(fields.length / colCount);
  y += rowCount * 88 + 24;

  // Submit button
  createRect(frame, formX, y, formW, 56, PALETTE.accent, 8);
  createButtonText(frame, formX, y, formW, 56, "AI 피팅 시작하기", 16, PALETTE.bgBase, fontName, true);
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
    drawFittingInput(frame, spec, fontFamily);
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
