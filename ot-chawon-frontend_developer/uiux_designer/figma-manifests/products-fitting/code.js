figma.showUI(__html__, { width: 360, height: 540 });

var FRAME_SPECS = [
  { name: "ProductList-PC", width: 1440, height: 900, category: "page" },
  { name: "ProductList-Mobile", width: 375, height: 812, category: "page" },
  { name: "ProductDetail-PC", width: 1440, height: 900, category: "page" },
  { name: "ProductDetail-Mobile", width: 375, height: 812, category: "page" },
  { name: "FittingEntry-PC", width: 1440, height: 900, category: "page" },
  { name: "FittingLoading-PC", width: 1440, height: 700, category: "page" },
  { name: "FittingResult-PC", width: 1440, height: 900, category: "page" }
];

var CATEGORY_COLOR = {
  page: { r: 0.067, g: 0.067, b: 0.067 },
  product: { r: 0.200, g: 0.200, b: 0.200 },
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

function drawProductListFrame(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var y = 140;
  createText(frame, pad, y, "전체 상품", isMobile ? 20 : 28, PALETTE.textPrimary, fontName, true);
  y += 44;
  createRect(frame, pad, y, spec.width - pad * 2, 44, PALETTE.bgSurface, 6);
  createText(frame, pad + 16, y + 12, "카테고리  |  사이즈  |  가격", 13, PALETTE.textMuted, fontName, false);
  y += 60;
  var cols = isMobile ? 2 : 4;
  var gap = isMobile ? 12 : 24;
  var cardW = (spec.width - pad * 2 - gap * (cols - 1)) / cols;
  var cardH = cardW * 1.2;
  for (var c = 0; c < cols; c += 1) {
    var cx = pad + c * (cardW + gap);
    createRect(frame, cx, y, cardW, cardH, PALETTE.bgSurface, 8);
    createRect(frame, cx, y + cardH + 8, cardW * 0.75, 13, PALETTE.bgElevated, 3);
    createRect(frame, cx, y + cardH + 28, cardW * 0.45, 13, PALETTE.accent, 3);
    createRect(frame, cx + cardW - 56, y + 8, 48, 20, PALETTE.brandBlue, 4);
    createText(frame, cx + cardW - 48, y + 12, "AI피팅", 10, PALETTE.white, fontName, true);
  }
}

function drawProductDetailFrame(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var pad = isMobile ? 16 : 80;
  var y = 140;
  if (isMobile) {
    createRect(frame, 0, y, spec.width, 340, PALETTE.bgSurface);
    y += 356;
    createText(frame, pad, y, "슬림핏 코튼 티셔츠", 20, PALETTE.textPrimary, fontName, true);
    y += 32;
    createText(frame, pad, y, "39,000원", 22, PALETTE.accent, fontName, true);
    y += 40;
    var mSizes = ["S", "M", "L", "XL"];
    for (var mi = 0; mi < mSizes.length; mi += 1) {
      createRect(frame, pad + mi * 64, y, 56, 40, mi === 1 ? PALETTE.accent : PALETTE.bgElevated, 6);
      createText(frame, pad + mi * 64 + 18, y + 12, mSizes[mi], 13, mi === 1 ? PALETTE.bgBase : PALETTE.textSecondary, fontName, false);
    }
    y += 56;
    createRect(frame, pad, y, spec.width - pad * 2, 44, PALETTE.brandBlue, 8);
    createText(frame, pad + 40, y + 13, "AI 피팅으로 사이즈 추천받기", 13, PALETTE.white, fontName, true);
    y += 56;
    createRect(frame, pad, y, spec.width - pad * 2, 48, PALETTE.accent, 8);
    createButtonText(frame, pad, y, spec.width - pad * 2, 48, "장바구니 담기", 14, PALETTE.bgBase, fontName, true);
  } else {
    var imgW = 500;
    createRect(frame, pad, y, imgW, 500, PALETTE.bgSurface, 8);
    var infoX = pad + imgW + 60;
    createText(frame, infoX, y, "슬림핏 코튼 티셔츠", 28, PALETTE.textPrimary, fontName, true);
    createText(frame, infoX, y + 48, "39,000원", 28, PALETTE.accent, fontName, true);
    createText(frame, infoX, y + 96, "사이즈 선택", 14, PALETTE.textSecondary, fontName, false);
    var pcSizes = ["S", "M", "L", "XL", "XXL"];
    for (var pi = 0; pi < pcSizes.length; pi += 1) {
      createRect(frame, infoX + pi * 64, y + 120, 56, 44, pi === 1 ? PALETTE.accent : PALETTE.bgElevated, 6);
      createText(frame, infoX + pi * 64 + 16, y + 134, pcSizes[pi], 13, pi === 1 ? PALETTE.bgBase : PALETTE.textSecondary, fontName, false);
    }
    createRect(frame, infoX, y + 180, spec.width - infoX - pad, 48, PALETTE.brandBlue, 8);
    createText(frame, infoX + 60, y + 196, "AI 피팅으로 사이즈 추천받기", 14, PALETTE.white, fontName, true);
    createRect(frame, infoX, y + 244, spec.width - infoX - pad, 52, PALETTE.accent, 8);
    createButtonText(frame, infoX, y + 244, spec.width - infoX - pad, 52, "장바구니 담기", 15, PALETTE.bgBase, fontName, true);
  }
}

function drawFittingEntryFrame(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var formW = 600;
  var formX = (spec.width - formW) / 2;
  var y = 140;
  createText(frame, formX, y, "AI 피팅 — 체형 정보 입력", 32, PALETTE.textPrimary, fontName, true);
  y += 52;
  createText(frame, formX, y, "정확한 사이즈 추천을 위해 체형 정보를 입력해 주세요.", 16, PALETTE.textSecondary, fontName, false);
  y += 48;
  var fields = [
    ["키 (cm)", "몸무게 (kg)"],
    ["어깨 너비 (cm)", "가슴 둘레 (cm)"],
    ["허리 둘레 (cm)", "엉덩이 둘레 (cm)"]
  ];
  for (var ri = 0; ri < fields.length; ri += 1) {
    var row = fields[ri];
    for (var ci = 0; ci < row.length; ci += 1) {
      var fx = formX + ci * 308;
      var fy = y + ri * 88;
      createText(frame, fx, fy, row[ci], 13, PALETTE.textSecondary, fontName, false);
      createRect(frame, fx, fy + 20, 280, 48, PALETTE.bgSurface, 6);
      createRect(frame, fx, fy + 66, 280, 2, PALETTE.border);
    }
  }
  y += fields.length * 88 + 24;
  createRect(frame, formX, y, formW, 56, PALETTE.accent, 8);
  createButtonText(frame, formX, y, formW, 56, "AI 피팅 시작하기", 16, PALETTE.bgBase, fontName, true);
}

function drawFittingLoadingFrame(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var cx = spec.width / 2;
  var cy = spec.height / 2;
  var ellipse = figma.createEllipse();
  ellipse.x = cx - 48;
  ellipse.y = cy - 100;
  ellipse.resize(96, 96);
  ellipse.strokes = [{ type: "SOLID", color: PALETTE.accent }];
  ellipse.strokeWeight = 6;
  ellipse.fills = [];
  frame.appendChild(ellipse);
  createText(frame, cx - 130, cy + 20, "AI가 체형을 분석하고 있습니다...", 20, PALETTE.textPrimary, fontName, true);
  createText(frame, cx - 150, cy + 54, "잠시만 기다려 주세요. 최적의 사이즈를 찾고 있습니다.", 14, PALETTE.textSecondary, fontName, false);
  createRect(frame, cx - 200, cy + 100, 400, 8, PALETTE.bgElevated, 4);
  createRect(frame, cx - 200, cy + 100, 280, 8, PALETTE.accent, 4);
}

function drawFittingResultFrame(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var pad = 80;
  var y = 140;
  createText(frame, pad, y, "AI 피팅 결과", 36, PALETTE.textPrimary, fontName, true);
  y += 56;
  createRect(frame, pad, y, 200, 72, PALETTE.bgSurface, 10);
  createText(frame, pad + 16, y + 8, "추천 사이즈", 12, PALETTE.textMuted, fontName, false);
  createText(frame, pad + 16, y + 30, "M", 36, PALETTE.accent, fontName, true);
  y += 92;
  // Size table
  var tableW = 700;
  createRect(frame, pad, y, tableW, 44, PALETTE.bgElevated, 6);
  var headers = ["사이즈", "어깨", "가슴", "허리", "엉덩이", "추천"];
  var colW = tableW / headers.length;
  for (var hi = 0; hi < headers.length; hi += 1) {
    createText(frame, pad + hi * colW + 8, y + 12, headers[hi], 12, PALETTE.textMuted, fontName, true);
  }
  y += 44;
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
  y += rows.length * 44 + 40;
  createRect(frame, pad, y, 320, 52, PALETTE.accent, 8);
  createButtonText(frame, pad, y, 320, 52, "이 사이즈로 장바구니 담기", 15, PALETTE.bgBase, fontName, true);
  createRect(frame, pad + 336, y, 200, 52, PALETTE.bgSurface, 8);
  createText(frame, pad + 376, y + 16, "다시 피팅하기", 15, PALETTE.textSecondary, fontName, false);
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
    if (spec.name.indexOf("ProductList") !== -1) {
      drawProductListFrame(frame, spec, fontFamily);
    } else if (spec.name.indexOf("ProductDetail") !== -1) {
      drawProductDetailFrame(frame, spec, fontFamily);
    } else if (spec.name.indexOf("FittingEntry") !== -1) {
      drawFittingEntryFrame(frame, spec, fontFamily);
    } else if (spec.name.indexOf("FittingLoading") !== -1) {
      drawFittingLoadingFrame(frame, spec, fontFamily);
    } else if (spec.name.indexOf("FittingResult") !== -1) {
      drawFittingResultFrame(frame, spec, fontFamily);
    } else {
      drawHeader(frame, spec, fontFamily);
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
    } else if (msg.type === "product") {
      var fontFamily = await loadFontSafe();
      var specs = [];
      for (var i = 0; i < FRAME_SPECS.length; i += 1) {
        if (FRAME_SPECS[i].name.indexOf("Product") !== -1) {
          specs.push(FRAME_SPECS[i]);
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
        if (spec.name.indexOf("ProductList") !== -1) {
          drawProductListFrame(frame, spec, fontFamily);
        } else {
          drawProductDetailFrame(frame, spec, fontFamily);
        }
        offsetX += spec.width + 80;
      }
      figma.notify("" + specs.length + "개 프레임 생성 완료");
    } else if (msg.type === "fitting") {
      var fontFamily2 = await loadFontSafe();
      var fSpecs = [];
      for (var fi = 0; fi < FRAME_SPECS.length; fi += 1) {
        if (FRAME_SPECS[fi].name.indexOf("Fitting") !== -1) {
          fSpecs.push(FRAME_SPECS[fi]);
        }
      }
      var fOffsetX = 0;
      for (var fj = 0; fj < fSpecs.length; fj += 1) {
        var fSpec = fSpecs[fj];
        var fFrame = figma.createFrame();
        fFrame.name = fSpec.name;
        fFrame.resize(fSpec.width, fSpec.height);
        fFrame.x = fOffsetX;
        fFrame.fills = [{ type: "SOLID", color: PALETTE.bgBase }];
        if (fSpec.name.indexOf("FittingEntry") !== -1) {
          drawFittingEntryFrame(fFrame, fSpec, fontFamily2);
        } else if (fSpec.name.indexOf("FittingLoading") !== -1) {
          drawFittingLoadingFrame(fFrame, fSpec, fontFamily2);
        } else {
          drawFittingResultFrame(fFrame, fSpec, fontFamily2);
        }
        fOffsetX += fSpec.width + 80;
      }
      figma.notify("" + fSpecs.length + "개 프레임 생성 완료");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
