figma.showUI(__html__, { width: 360, height: 520 });

var FRAME_SPECS = [
  { name: "ColorPalette-PC", width: 1440, height: 900, category: "design-system" },
  { name: "Typography-PC", width: 1440, height: 900, category: "design-system" },
  { name: "Button-States-PC", width: 1440, height: 600, category: "component" },
  { name: "Input-States-PC", width: 1440, height: 700, category: "component" },
  { name: "Select-Checkbox-PC", width: 1440, height: 600, category: "component" },
  { name: "Header-PC", width: 1440, height: 64, category: "layout" },
  { name: "Header-Mobile", width: 375, height: 64, category: "layout" },
  { name: "Footer-PC", width: 1440, height: 120, category: "layout" },
  { name: "Footer-Mobile", width: 375, height: 160, category: "layout" },
  { name: "MobileNav-Mobile", width: 375, height: 64, category: "layout" }
];

var CATEGORY_COLOR = {
  "design-system": { r: 0.067, g: 0.067, b: 0.067 },
  component: { r: 0.200, g: 0.200, b: 0.200 },
  layout: { r: 0.129, g: 0.129, b: 0.129 },
  foundation: { r: 0.067, g: 0.067, b: 0.067 },
  wireframe: { r: 0.129, g: 0.129, b: 0.129 },
  page: { r: 0.067, g: 0.067, b: 0.067 },
  auth: { r: 0.200, g: 0.200, b: 0.200 },
  error: { r: 0.200, g: 0.200, b: 0.200 },
  main: { r: 0.380, g: 0.380, b: 0.380 },
  product: { r: 0.200, g: 0.200, b: 0.200 },
  fitting: { r: 0.200, g: 0.200, b: 0.200 },
  cart: { r: 0.200, g: 0.200, b: 0.200 },
  order: { r: 0.200, g: 0.200, b: 0.200 },
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
  createText(frame, 24, 12, spec.name, 18, PALETTE.textPrimary, fontName, true);
  createText(frame, 24, 34, spec.category + " · " + spec.width + "×" + spec.height, 11, PALETTE.textSecondary, fontName, false);
}

function drawDesignSystem(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  var colors = [
    { label: "bgBase #111111", color: PALETTE.bgBase },
    { label: "bgSurface #212121", color: PALETTE.bgSurface },
    { label: "bgElevated #333333", color: PALETTE.bgElevated },
    { label: "accent #F9F9F9", color: PALETTE.accent },
    { label: "brandBlue #3B82F6", color: PALETTE.brandBlue },
    { label: "success #22C55E", color: PALETTE.success },
    { label: "warning #F59E0B", color: PALETTE.warning },
    { label: "error #EF4444", color: PALETTE.error }
  ];
  var cx = 40;
  for (var i = 0; i < colors.length; i += 1) {
    createRect(frame, cx + i * 120, 80, 100, 100, colors[i].color, 8);
    createText(frame, cx + i * 120, 188, colors[i].label, 11, PALETTE.textSecondary, fontName, false);
  }
  createText(frame, 40, 240, "Typography Scale", 20, PALETTE.textPrimary, fontName, true);
  var scales = [
    { label: "Display 48px / 700", size: 28 },
    { label: "H1 30px / 700", size: 22 },
    { label: "H2 24px / 700", size: 18 },
    { label: "H3 20px / 600", size: 16 },
    { label: "Body1 16px / 400", size: 14 },
    { label: "Body2 14px / 400", size: 13 },
    { label: "Caption 12px / 400", size: 12 }
  ];
  var ty = 280;
  for (var j = 0; j < scales.length; j += 1) {
    createText(frame, 40, ty, scales[j].label, scales[j].size, PALETTE.textPrimary, fontName, false);
    ty += scales[j].size + 16;
  }
  createText(frame, 40, ty + 20, "Spacing: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64px", 14, PALETTE.textMuted, fontName, false);
}

function drawComponent(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  createText(frame, 40, 72, spec.name, 16, PALETTE.textSecondary, fontName, false);
  var states = ["Default", "Hover", "Active", "Disabled", "Focus"];
  for (var i = 0; i < states.length; i += 1) {
    var bx = 40 + i * 180;
    var by = 120;
    createRect(frame, bx, by, 160, 48, PALETTE.accent, 6);
    createButtonText(frame, bx, by, 160, 48, states[i], 14, PALETTE.bgBase, fontName, true);
    createText(frame, bx + 40, by + 56, states[i], 12, PALETTE.textMuted, fontName, false);
  }
  createText(frame, 40, 220, "Input States", 16, PALETTE.textSecondary, fontName, false);
  for (var k = 0; k < states.length; k += 1) {
    var ix = 40 + k * 260;
    var iy = 260;
    createRect(frame, ix, iy, 240, 48, PALETTE.bgSurface, 6);
    createRect(frame, ix, iy + 46, 240, 2, k === 3 ? PALETTE.accent : PALETTE.border);
    createText(frame, ix + 12, iy + 14, states[k] + " state", 14, k === 4 ? PALETTE.textMuted : PALETTE.textPrimary, fontName, false);
  }
}

function drawLayout(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  createRect(frame, 0, 48, spec.width, spec.height - 48, PALETTE.bgSurface);
  if (spec.name.indexOf("Header") !== -1) {
    createText(frame, 24, 60, "옷차원", 18, PALETTE.accent, fontName, true);
    createText(frame, spec.width - 200, 60, "로그인  회원가입", 14, PALETTE.textSecondary, fontName, false);
  } else if (spec.name.indexOf("Footer") !== -1) {
    createText(frame, 24, 68, "옷차원 © 2026 All rights reserved.", 13, PALETTE.textMuted, fontName, false);
  } else if (spec.name.indexOf("MobileNav") !== -1) {
    var icons = ["홈", "상품", "피팅", "장바구니", "마이"];
    for (var i = 0; i < icons.length; i += 1) {
      createRect(frame, 19 + i * 67, 50, 40, 4, PALETTE.accent, 2);
      createText(frame, 25 + i * 67, 56, icons[i], 10, PALETTE.textMuted, fontName, false);
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
    if (spec.category === "design-system") {
      drawDesignSystem(frame, spec, fontFamily);
    } else if (spec.category === "component") {
      drawComponent(frame, spec, fontFamily);
    } else if (spec.category === "layout") {
      drawLayout(frame, spec, fontFamily);
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
    } else if (msg.type === "design-system") {
      await buildFramesByCategory("design-system");
    } else if (msg.type === "component") {
      await buildFramesByCategory("component");
    } else if (msg.type === "layout") {
      await buildFramesByCategory("layout");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
