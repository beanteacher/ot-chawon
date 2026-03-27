figma.showUI(__html__, { width: 360, height: 480 });

var FRAME_SPECS = [
  { name: "FormField-States-PC", width: 1440, height: 700, category: "component" },
  { name: "Textarea-States-PC", width: 1440, height: 600, category: "component" },
  { name: "Modal-Sizes-PC", width: 1440, height: 800, category: "component" },
  { name: "Modal-Mobile", width: 375, height: 700, category: "component" },
  { name: "ConfirmDialog-PC", width: 1440, height: 600, category: "component" },
  { name: "Toast-Types-PC", width: 1440, height: 500, category: "component" },
  { name: "Spinner-Sizes-PC", width: 1440, height: 500, category: "component" },
  { name: "Skeleton-Variants-PC", width: 1440, height: 700, category: "component" }
];

var CATEGORY_COLOR = {
  component: { r: 0.200, g: 0.200, b: 0.200 },
  foundation: { r: 0.067, g: 0.067, b: 0.067 },
  wireframe: { r: 0.129, g: 0.129, b: 0.129 },
  page: { r: 0.067, g: 0.067, b: 0.067 },
  auth: { r: 0.200, g: 0.200, b: 0.200 },
  error: { r: 0.200, g: 0.200, b: 0.200 },
  main: { r: 0.380, g: 0.380, b: 0.380 },
  product: { r: 0.200, g: 0.200, b: 0.200 },
  fitting: { r: 0.200, g: 0.200, b: 0.200 },
  cart: { r: 0.200, g: 0.200, b: 0.200 },
  order: { r: 0.200, g: 0.200, b: 0.200 }
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

function drawFormField(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  var states = ["Default", "Focus", "Filled", "Error", "Disabled"];
  createText(frame, 40, 68, "Form Field States", 16, PALETTE.textSecondary, fontName, false);
  for (var i = 0; i < states.length; i += 1) {
    var s = states[i];
    var fx = 40 + i * 280;
    var fy = 100;
    createText(frame, fx, fy, s, 12, PALETTE.textMuted, fontName, false);
    createText(frame, fx, fy + 18, "이메일", 12, PALETTE.textSecondary, fontName, false);
    createRect(frame, fx, fy + 36, 240, 48, PALETTE.bgSurface, 6);
    var underlineColor = s === "Error" ? PALETTE.error : s === "Focus" ? PALETTE.accent : PALETTE.border;
    createRect(frame, fx, fy + 82, 240, 2, underlineColor);
    createText(frame, fx + 12, fy + 50, "example@email.com", 14, s === "Disabled" ? PALETTE.textMuted : PALETTE.textPrimary, fontName, false);
    if (s === "Error") {
      createText(frame, fx, fy + 90, "이메일 형식이 올바르지 않습니다", 11, PALETTE.error, fontName, false);
    }
  }
  createText(frame, 40, 300, "Textarea States", 16, PALETTE.textSecondary, fontName, false);
  var slicedStates = states.slice(0, 3);
  for (var j = 0; j < slicedStates.length; j += 1) {
    var tx = 40 + j * 460;
    createText(frame, tx, 330, slicedStates[j], 12, PALETTE.textMuted, fontName, false);
    createRect(frame, tx, 350, 420, 120, PALETTE.bgSurface, 6);
    createText(frame, tx + 12, 362, "내용을 입력하세요...", 14, PALETTE.textMuted, fontName, false);
  }
}

function drawModal(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  var isMobile = spec.width === 375;
  if (isMobile) {
    createRect(frame, 0, 48, 375, frame.height - 48, { r: 0, g: 0, b: 0 });
    createRect(frame, 16, 200, 343, 300, PALETTE.bgElevated, 12);
    createText(frame, 32, 224, "모달 제목", 18, PALETTE.textPrimary, fontName, true);
    createText(frame, 32, 256, "모달 내용이 여기에 표시됩니다.", 14, PALETTE.textSecondary, fontName, false);
    createRect(frame, 16, 450, 343, 48, PALETTE.accent, 8);
    createButtonText(frame, 16, 450, 343, 48, "확인", 14, PALETTE.bgBase, fontName, true);
  } else {
    var sizes = [
      { label: "Small (400px)", w: 400, h: 280 },
      { label: "Medium (560px)", w: 560, h: 360 },
      { label: "Large (720px)", w: 720, h: 480 }
    ];
    for (var i = 0; i < sizes.length; i += 1) {
      var sz = sizes[i];
      var mx = 80 + i * 460;
      createText(frame, mx, 60, sz.label, 13, PALETTE.textMuted, fontName, false);
      createRect(frame, mx, 80, sz.w, sz.h, PALETTE.bgElevated, 12);
      createText(frame, mx + 24, 108, "모달 제목", 20, PALETTE.textPrimary, fontName, true);
      createText(frame, mx + 24, 144, "모달 내용이 여기에 표시됩니다.", 14, PALETTE.textSecondary, fontName, false);
      createRect(frame, mx + sz.w - 120, sz.h + 80 - 60, 96, 40, PALETTE.accent, 6);
      createButtonText(frame, mx + sz.w - 120, sz.h + 80 - 60, 96, 40, "확인", 13, PALETTE.bgBase, fontName, true);
    }
  }
}

function drawConfirmDialog(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  createRect(frame, 440, 120, 560, 300, PALETTE.bgElevated, 12);
  createText(frame, 480, 152, "정말 삭제하시겠습니까?", 20, PALETTE.textPrimary, fontName, true);
  createText(frame, 480, 192, "이 작업은 되돌릴 수 없습니다.", 14, PALETTE.textSecondary, fontName, false);
  createRect(frame, 480, 360, 200, 48, PALETTE.bgSurface, 6);
  createText(frame, 550, 372, "취소", 14, PALETTE.textSecondary, fontName, false);
  createRect(frame, 700, 360, 200, 48, PALETTE.accent, 6);
  createButtonText(frame, 700, 360, 200, 48, "삭제", 14, PALETTE.bgBase, fontName, true);
}

function drawToast(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  var toasts = [
    { label: "Success", color: PALETTE.success, msg: "저장이 완료되었습니다." },
    { label: "Error", color: PALETTE.error, msg: "오류가 발생했습니다." },
    { label: "Warning", color: PALETTE.warning, msg: "주의가 필요합니다." },
    { label: "Info", color: PALETTE.brandBlue, msg: "새로운 업데이트가 있습니다." }
  ];
  for (var i = 0; i < toasts.length; i += 1) {
    var t = toasts[i];
    var ty = 80 + i * 90;
    createRect(frame, 40, ty, 480, 60, PALETTE.bgElevated, 8);
    createRect(frame, 40, ty, 4, 60, t.color, 2);
    createText(frame, 60, ty + 8, t.label, 12, t.color, fontName, true);
    createText(frame, 60, ty + 28, t.msg, 14, PALETTE.textPrimary, fontName, false);
  }
}

function drawSpinner(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  createText(frame, 40, 68, "Spinner Sizes", 16, PALETTE.textSecondary, fontName, false);
  var sizes = [
    { label: "Small 16px", r: 8 },
    { label: "Medium 24px", r: 12 },
    { label: "Large 40px", r: 20 },
    { label: "XLarge 56px", r: 28 }
  ];
  for (var i = 0; i < sizes.length; i += 1) {
    var s = sizes[i];
    var cx = 80 + i * 240;
    var cy = 200;
    var ellipse = figma.createEllipse();
    ellipse.x = cx;
    ellipse.y = cy;
    ellipse.resize(s.r * 2, s.r * 2);
    ellipse.strokes = [{ type: "SOLID", color: PALETTE.accent }];
    ellipse.strokeWeight = 3;
    ellipse.fills = [];
    frame.appendChild(ellipse);
    createText(frame, cx - 10, cy + s.r * 2 + 8, s.label, 12, PALETTE.textMuted, fontName, false);
  }
}

function drawSkeleton(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  createText(frame, 40, 68, "Skeleton Variants", 16, PALETTE.textSecondary, fontName, false);
  for (var i = 0; i < 3; i += 1) {
    var sx = 40 + i * 460;
    createRect(frame, sx, 100, 200, 200, PALETTE.bgSurface, 8);
    createRect(frame, sx, 316, 180, 16, PALETTE.bgSurface, 4);
    createRect(frame, sx, 340, 120, 12, PALETTE.bgSurface, 4);
    createRect(frame, sx, 362, 80, 12, PALETTE.bgSurface, 4);
  }
  createText(frame, 40, 440, "Text Skeleton", 14, PALETTE.textMuted, fontName, false);
  for (var j = 0; j < 3; j += 1) {
    createRect(frame, 40, 468 + j * 24, 600 - j * 100, 12, PALETTE.bgSurface, 4);
  }
}

function drawGenericComponent(frame, spec, fontName) {
  drawHeader(frame, spec, fontName);
  createText(frame, 40, 72, spec.name + " — 컴포넌트 시안", 16, PALETTE.textSecondary, fontName, false);
  createRect(frame, 40, 110, spec.width - 80, spec.height - 150, PALETTE.bgSurface, 8);
  createText(frame, 60, 140, "컴포넌트 내용 영역", 18, PALETTE.textMuted, fontName, false);
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
    if (spec.name.indexOf("FormField") !== -1 || spec.name.indexOf("Textarea") !== -1) {
      drawFormField(frame, spec, fontFamily);
    } else if (spec.name.indexOf("Modal") !== -1) {
      drawModal(frame, spec, fontFamily);
    } else if (spec.name.indexOf("ConfirmDialog") !== -1) {
      drawConfirmDialog(frame, spec, fontFamily);
    } else if (spec.name.indexOf("Toast") !== -1) {
      drawToast(frame, spec, fontFamily);
    } else if (spec.name.indexOf("Spinner") !== -1) {
      drawSpinner(frame, spec, fontFamily);
    } else if (spec.name.indexOf("Skeleton") !== -1) {
      drawSkeleton(frame, spec, fontFamily);
    } else {
      drawGenericComponent(frame, spec, fontFamily);
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
    } else if (msg.type === "component") {
      await buildFramesByCategory("component");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
