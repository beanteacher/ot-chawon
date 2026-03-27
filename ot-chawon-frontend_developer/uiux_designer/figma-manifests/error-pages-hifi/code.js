figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "404-PC", width: 1440, height: 900, category: "error" },
  { name: "404-Mobile", width: 375, height: 812, category: "error" },
  { name: "500-PC", width: 1440, height: 900, category: "error" },
  { name: "500-Mobile", width: 375, height: 812, category: "error" },
  { name: "403-PC", width: 1440, height: 900, category: "error" },
  { name: "403-Mobile", width: 375, height: 812, category: "error" }
];

var CATEGORY_COLOR = {
  error: { r: 0.200, g: 0.200, b: 0.200 },
  auth: { r: 0.200, g: 0.200, b: 0.200 },
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
}

function drawErrorPage(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isMobile = spec.width === 375;
  var code = spec.name.indexOf("404") === 0 ? "404" : spec.name.indexOf("500") === 0 ? "500" : "403";
  var messages = {
    "404": { title: "페이지를 찾을 수 없습니다", desc: "요청하신 페이지가 존재하지 않거나 이동되었습니다." },
    "500": { title: "서버 오류가 발생했습니다", desc: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요." },
    "403": { title: "접근 권한이 없습니다", desc: "이 페이지에 접근할 권한이 없습니다. 로그인 후 이용해 주세요." }
  };
  var msg = messages[code];
  var cx = isMobile ? 24 : (spec.width - 480) / 2;
  var cy = 200;
  createText(frame, cx, cy, code, isMobile ? 80 : 120, PALETTE.error, fontName, true);
  createText(frame, cx, cy + (isMobile ? 100 : 140), msg.title, isMobile ? 22 : 32, PALETTE.textPrimary, fontName, true);
  createText(frame, cx, cy + (isMobile ? 136 : 190), msg.desc, isMobile ? 14 : 16, PALETTE.textSecondary, fontName, false);
  var btnW = isMobile ? spec.width - 48 : 200;
  createRect(frame, cx, cy + (isMobile ? 200 : 260), btnW, 52, PALETTE.accent, 8);
  createButtonText(frame, cx, cy + (isMobile ? 200 : 260), btnW, 52, "홈으로 돌아가기", 15, PALETTE.bgBase, fontName, true);
  if (!isMobile) {
    createRect(frame, cx + 220, cy + 260, 160, 52, PALETTE.bgSurface, 8);
    createText(frame, cx + 256, cy + 276, "이전 페이지", 15, PALETTE.textSecondary, fontName, false);
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
    drawErrorPage(frame, spec, fontFamily);
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
    } else if (msg.type === "error") {
      await buildFramesByCategory("error");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
