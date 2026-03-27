figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "FittingLoading-PC", width: 1440, height: 800, category: "page" },
  { name: "FittingResult-PC", width: 1440, height: 1200, category: "page" },
  { name: "FittingResult-Mobile", width: 375, height: 1600, category: "page" }
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

function drawFittingLoading(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var cx = spec.width / 2;
  var cy = spec.height / 2;

  // Spinner circle
  var ellipse = figma.createEllipse();
  ellipse.x = cx - 48;
  ellipse.y = cy - 120;
  ellipse.resize(96, 96);
  ellipse.strokes = [{ type: "SOLID", color: PALETTE.accent }];
  ellipse.strokeWeight = 6;
  ellipse.fills = [];
  frame.appendChild(ellipse);

  createText(frame, cx - 120, cy + 0, "AI가 체형을 분석하고 있습니다...", 20, PALETTE.textPrimary, fontName, true);
  createText(frame, cx - 140, cy + 36, "잠시만 기다려 주세요. 최적의 사이즈를 찾고 있습니다.", 14, PALETTE.textSecondary, fontName, false);

  // Progress bar
  createRect(frame, cx - 200, cy + 90, 400, 8, PALETTE.bgElevated, 4);
  createRect(frame, cx - 200, cy + 90, 280, 8, PALETTE.accent, 4);
  createText(frame, cx - 20, cy + 108, "70%", 13, PALETTE.accent, fontName, true);
}

function drawFittingResult(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var y = 140;

  // Result title
  createText(frame, pad, y, "AI 피팅 결과", isMobile ? 24 : 36, PALETTE.textPrimary, fontName, true);
  y += isMobile ? 40 : 56;

  // Recommended size badge
  createRect(frame, pad, y, isMobile ? 160 : 200, isMobile ? 56 : 72, PALETTE.bgSurface, 10);
  createText(frame, pad + 16, y + 8, "추천 사이즈", 12, PALETTE.textMuted, fontName, false);
  createText(frame, pad + 16, y + (isMobile ? 26 : 30), "M", isMobile ? 26 : 36, PALETTE.accent, fontName, true);
  y += isMobile ? 76 : 96;

  // Size comparison table
  createText(frame, pad, y, "사이즈 비교", isMobile ? 16 : 20, PALETTE.textSecondary, fontName, false);
  y += 28;
  var tableW = isMobile ? spec.width - pad * 2 : 700;
  createRect(frame, pad, y, tableW, 48, PALETTE.bgElevated, 6);
  var headers = ["사이즈", "어깨", "가슴", "허리", "엉덩이", "추천"];
  var colW = tableW / headers.length;
  for (var hi = 0; hi < headers.length; hi += 1) {
    createText(frame, pad + hi * colW + 8, y + 14, headers[hi], 12, PALETTE.textMuted, fontName, true);
  }
  y += 48;
  var rows = [
    ["S", "42", "92", "74", "92", ""],
    ["M", "44", "96", "78", "96", "★"],
    ["L", "46", "100", "82", "100", ""]
  ];
  for (var ri = 0; ri < rows.length; ri += 1) {
    var row = rows[ri];
    var isRec = row[5] === "★";
    createRect(frame, pad, y + ri * 44, tableW, 40, isRec ? { r: 0.15, g: 0.1, b: 0.06 } : PALETTE.bgSurface, 4);
    for (var ci = 0; ci < row.length; ci += 1) {
      var cellColor = ci === 5 ? PALETTE.accent : isRec ? PALETTE.accent : PALETTE.textSecondary;
      createText(frame, pad + ci * colW + 8, y + ri * 44 + 12, row[ci], 13, cellColor, fontName, isRec);
    }
  }
  y += rows.length * 44 + 32;

  // Body measurements summary
  createText(frame, pad, y, "입력한 체형 정보", isMobile ? 16 : 20, PALETTE.textSecondary, fontName, false);
  y += 28;
  var measurements = [
    ["키", "170cm"], ["몸무게", "65kg"], ["어깨", "44cm"], ["가슴", "96cm"]
  ];
  var cols = isMobile ? 2 : 4;
  var cellW = isMobile ? (spec.width - pad * 2 - 12) / 2 : (700 - 24 * 3) / 4;
  for (var mi = 0; mi < measurements.length; mi += 1) {
    var mcol = mi % cols;
    var mrow = Math.floor(mi / cols);
    var mx = pad + mcol * (cellW + (isMobile ? 12 : 24));
    var my = y + mrow * 80;
    createRect(frame, mx, my, cellW, 64, PALETTE.bgSurface, 8);
    createText(frame, mx + 12, my + 10, measurements[mi][0], 12, PALETTE.textMuted, fontName, false);
    createText(frame, mx + 12, my + 32, measurements[mi][1], 18, PALETTE.textPrimary, fontName, true);
  }
  y += Math.ceil(measurements.length / cols) * 80 + 32;

  // CTA buttons
  createRect(frame, pad, y, isMobile ? spec.width - pad * 2 : 340, 52, PALETTE.accent, 8);
  createButtonText(frame, pad, y, isMobile ? spec.width - pad * 2 : 340, 52, "이 사이즈로 장바구니 담기", 14, PALETTE.bgBase, fontName, true);
  if (!isMobile) {
    createRect(frame, pad + 356, y, 340, 52, PALETTE.bgSurface, 8);
    createText(frame, pad + 410, y + 16, "다시 피팅하기", 14, PALETTE.textSecondary, fontName, false);
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
    if (spec.name.indexOf("Loading") !== -1) {
      drawFittingLoading(frame, spec, fontFamily);
    } else {
      drawFittingResult(frame, spec, fontFamily);
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
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
