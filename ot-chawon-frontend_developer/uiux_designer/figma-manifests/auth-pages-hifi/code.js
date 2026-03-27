figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "Login-PC", width: 1440, height: 900, category: "auth" },
  { name: "Login-Mobile", width: 375, height: 812, category: "auth" },
  { name: "Signup-PC", width: 1440, height: 900, category: "auth" },
  { name: "Signup-Mobile", width: 375, height: 812, category: "auth" },
  { name: "Login-Error-State-PC", width: 1440, height: 900, category: "auth" },
  { name: "Signup-Error-State-PC", width: 1440, height: 900, category: "auth" }
];

var CATEGORY_COLOR = {
  auth: { r: 0.200, g: 0.200, b: 0.200 },
  component: { r: 0.200, g: 0.200, b: 0.200 },
  page: { r: 0.067, g: 0.067, b: 0.067 },
  error: { r: 0.200, g: 0.200, b: 0.200 },
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

function drawAuthForm(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  drawNavbar(frame, spec, fontName);
  var isError = spec.name.indexOf("Error") !== -1;
  var isSignup = spec.name.indexOf("Signup") !== -1;
  var isMobile = spec.width === 375;
  var formW = isMobile ? 327 : 440;
  var formX = isMobile ? 24 : (spec.width - formW) / 2;
  var formY = 160;

  createRect(frame, formX, formY, formW, isSignup ? 480 : 380, PALETTE.bgElevated, 12);
  createText(frame, formX + 32, formY + 32, isSignup ? "회원가입" : "로그인", 28, PALETTE.textPrimary, fontName, true);
  createText(frame, formX + 32, formY + 72, "이메일", 13, PALETTE.textSecondary, fontName, false);
  createRect(frame, formX + 32, formY + 92, formW - 64, 48, PALETTE.bgSurface, 6);
  createRect(frame, formX + 32, formY + 138, formW - 64, 2, isError ? PALETTE.error : PALETTE.border);
  createText(frame, formX + 44, formY + 106, "example@email.com", 14, PALETTE.textMuted, fontName, false);
  if (isError) {
    createText(frame, formX + 32, formY + 146, "이메일 또는 비밀번호가 올바르지 않습니다.", 12, PALETTE.error, fontName, false);
  }
  createText(frame, formX + 32, formY + 172, "비밀번호", 13, PALETTE.textSecondary, fontName, false);
  createRect(frame, formX + 32, formY + 192, formW - 64, 48, PALETTE.bgSurface, 6);
  createRect(frame, formX + 32, formY + 238, formW - 64, 2, PALETTE.border);
  createText(frame, formX + 44, formY + 206, "••••••••", 14, PALETTE.textMuted, fontName, false);
  if (isSignup) {
    createText(frame, formX + 32, formY + 258, "비밀번호 확인", 13, PALETTE.textSecondary, fontName, false);
    createRect(frame, formX + 32, formY + 278, formW - 64, 48, PALETTE.bgSurface, 6);
    createRect(frame, formX + 32, formY + 324, formW - 64, 2, PALETTE.border);
    createText(frame, formX + 44, formY + 292, "••••••••", 14, PALETTE.textMuted, fontName, false);
  }
  var btnY = isSignup ? formY + 360 : formY + 270;
  createRect(frame, formX + 32, btnY, formW - 64, 52, PALETTE.accent, 8);
  createButtonText(frame, formX + 32, btnY, formW - 64, 52, isSignup ? "가입하기" : "로그인", 16, PALETTE.bgBase, fontName, true);
  createText(frame, formX + formW / 2 - 60, btnY + 72, isSignup ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입", 13, PALETTE.textSecondary, fontName, false);
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
    drawAuthForm(frame, spec, fontFamily);
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
    } else if (msg.type === "auth") {
      await buildFramesByCategory("auth");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
