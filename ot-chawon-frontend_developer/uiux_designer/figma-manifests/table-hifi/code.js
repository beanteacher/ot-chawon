figma.showUI(__html__, { width: 360, height: 520 });

// ─── Frame 스펙 ───────────────────────────────────────────────────────────────
var FRAME_SPECS = [
  { name: "Table-PC",             width: 1440, height: 1200, category: "table"  },
  { name: "Table-Mobile",         width: 375,  height: 1400, category: "mobile" },
  { name: "Table-FilterStates-PC",width: 1440, height: 900,  category: "filter" },
  { name: "Table-EmptyState",     width: 1440, height: 600,  category: "empty"  }
];

// ─── 카테고리별 배경색 ────────────────────────────────────────────────────────
var CATEGORY_COLOR = {
  table:  { r: 0.067, g: 0.067, b: 0.067 },
  mobile: { r: 0.067, g: 0.067, b: 0.067 },
  filter: { r: 0.067, g: 0.067, b: 0.067 },
  empty:  { r: 0.067, g: 0.067, b: 0.067 }
};

// ─── 팔레트 ──────────────────────────────────────────────────────────────────
var PALETTE = {
  bgBase:        { r: 0.067, g: 0.067, b: 0.067 },
  bgSurface:     { r: 0.129, g: 0.129, b: 0.129 },
  bgElevated:    { r: 0.200, g: 0.200, b: 0.200 },
  bgHover:       { r: 0.157, g: 0.157, b: 0.157 },
  border:        { r: 0.380, g: 0.380, b: 0.380 },
  borderLight:   { r: 0.255, g: 0.255, b: 0.255 },
  textPrimary:   { r: 0.976, g: 0.976, b: 0.976 },
  textSecondary: { r: 0.741, g: 0.741, b: 0.741 },
  textMuted:     { r: 0.502, g: 0.502, b: 0.502 },
  brandOrange:   { r: 0.976, g: 0.976, b: 0.976 },
  brandBlue:     { r: 0.620, g: 0.620, b: 0.620 },
  success:       { r: 0.741, g: 0.741, b: 0.741 },
  warning:       { r: 0.620, g: 0.620, b: 0.620 },
  error:         { r: 0.741, g: 0.741, b: 0.741 },
  white:         { r: 1.000, g: 1.000, b: 1.000 },
  sortActive:    { r: 0.976, g: 0.976, b: 0.976 },
  rowSelected:   { r: 0.157, g: 0.196, b: 0.275 }
};

// ─── 폰트 로드 ────────────────────────────────────────────────────────────────
async function loadFontSafe() {
  var families = ["Inter", "Roboto"];
  for (var i = 0; i < families.length; i += 1) {
    try {
      await figma.loadFontAsync({ family: families[i], style: "Regular" });
      await figma.loadFontAsync({ family: families[i], style: "Bold" });
      return families[i];
    } catch (error) {
      // 다음 폰트 시도
    }
  }
  throw new Error("사용 가능한 폰트를 로드하지 못했습니다.");
}

// ─── 기본 헬퍼 ────────────────────────────────────────────────────────────────
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
  var safeContent = (content !== undefined && content !== null && content !== "") ? String(content) : " ";
  text.characters = safeContent;
  text.fills = [{ type: "SOLID", color: color }];
  text.x = x;
  text.y = y;
  parent.appendChild(text);
  return text;
}

// ─── 공통 네비게이션 바 ───────────────────────────────────────────────────────
function drawNavbar(frame, spec, fontName) {
  createRect(frame, 0, 0, spec.width, 60, PALETTE.bgSurface);
  // 로고
  createRect(frame, 24, 16, 28, 28, PALETTE.brandOrange, 4);
  createText(frame, 60, 20, "옷차원", 18, PALETTE.textPrimary, fontName, true);
  // 네비 메뉴 (PC만)
  if (spec.width > 400) {
    createText(frame, spec.width - 320, 22, "대시보드  주문관리  상품관리  고객관리", 13, PALETTE.textSecondary, fontName, false);
  }
  // 하단 구분선
  createRect(frame, 0, 60, spec.width, 1, PALETTE.borderLight);
}

// ─── 페이지 헤더 (타이틀 + 서브텍스트) ───────────────────────────────────────
function drawPageHeader(frame, x, y, title, subtitle, fontName) {
  createText(frame, x, y, title, 24, PALETTE.textPrimary, fontName, true);
  createText(frame, x, y + 34, subtitle, 13, PALETTE.textMuted, fontName, false);
  return y + 70;
}

// ─── 테이블 툴바 (검색 + 액션 버튼) ─────────────────────────────────────────
function drawTableToolbar(frame, x, y, w, fontName) {
  // 배경 바
  createRect(frame, x, y, w, 52, PALETTE.bgSurface, 8);
  // 검색 입력 영역
  createRect(frame, x + 16, y + 12, 260, 28, PALETTE.bgElevated, 4);
  createText(frame, x + 32, y + 18, "주문번호, 고객명으로 검색...", 12, PALETTE.textMuted, fontName, false);
  // 필터 버튼들
  createRect(frame, x + 292, y + 12, 80, 28, PALETTE.bgElevated, 4);
  createText(frame, x + 308, y + 18, "상태  ▾", 12, PALETTE.textSecondary, fontName, false);
  createRect(frame, x + 380, y + 12, 100, 28, PALETTE.bgElevated, 4);
  createText(frame, x + 396, y + 18, "날짜 범위  ▾", 12, PALETTE.textSecondary, fontName, false);
  createRect(frame, x + 488, y + 12, 80, 28, PALETTE.bgElevated, 4);
  createText(frame, x + 504, y + 18, "카테고리  ▾", 12, PALETTE.textSecondary, fontName, false);
  // 내보내기 버튼 (우측)
  createRect(frame, x + w - 120, y + 12, 104, 28, PALETTE.bgElevated, 4);
  createText(frame, x + w - 104, y + 18, "CSV 내보내기", 12, PALETTE.textSecondary, fontName, false);
  return y + 68;
}

// ─── 테이블 헤더 행 ──────────────────────────────────────────────────────────
function drawTableHeader(frame, x, y, w, cols, fontName) {
  createRect(frame, x, y, w, 44, PALETTE.bgElevated);
  // 상단 구분선
  createRect(frame, x, y, w, 1, PALETTE.border);
  var colX = x + 16;
  for (var i = 0; i < cols.length; i += 1) {
    var col = cols[i];
    var labelColor = col.sorted ? PALETTE.sortActive : PALETTE.textSecondary;
    createText(frame, colX, y + 14, col.label, 12, labelColor, fontName, true);
    // 정렬 아이콘 (정렬 활성 컬럼)
    if (col.sorted) {
      createRect(frame, colX + col.labelW + 4, y + 17, 8, 10, PALETTE.sortActive, 1);
    } else if (col.sortable) {
      // 비활성 정렬 아이콘
      createRect(frame, colX + col.labelW + 4, y + 17, 8, 10, PALETTE.bgHover, 1);
    }
    colX += col.width;
  }
  // 하단 구분선
  createRect(frame, x, y + 44, w, 1, PALETTE.borderLight);
  return y + 44;
}

// ─── 상태 배지 ───────────────────────────────────────────────────────────────
function drawBadge(frame, x, y, label, color, fontName) {
  var bgColor = {
    r: color.r * 0.2 + 0.06,
    g: color.g * 0.2 + 0.06,
    b: color.b * 0.2 + 0.06
  };
  createRect(frame, x, y, 64, 22, bgColor, 11);
  createText(frame, x + 8, y + 4, label, 11, color, fontName, true);
}

// ─── 주문 데이터 행들 ─────────────────────────────────────────────────────────
function drawTableRows(frame, x, startY, w, cols, rows, fontName) {
  var y = startY;
  for (var r = 0; r < rows.length; r += 1) {
    var row = rows[r];
    var rowBg = (r % 2 === 0) ? PALETTE.bgBase : PALETTE.bgSurface;
    createRect(frame, x, y, w, 52, rowBg);
    var colX = x + 16;
    for (var c = 0; c < cols.length; c += 1) {
      var col = cols[c];
      var cellVal = row[col.key];
      if (col.key === "status") {
        var statusColor = PALETTE.textSecondary;
        if (cellVal === "배송완료") { statusColor = PALETTE.success; }
        else if (cellVal === "배송중") { statusColor = PALETTE.brandBlue; }
        else if (cellVal === "결제완료") { statusColor = PALETTE.warning; }
        else if (cellVal === "취소") { statusColor = PALETTE.error; }
        else if (cellVal === "반품") { statusColor = PALETTE.brandOrange; }
        drawBadge(frame, colX, y + 15, cellVal, statusColor, fontName);
      } else if (col.key === "checkbox") {
        // 체크박스
        createRect(frame, colX, y + 18, 16, 16, PALETTE.bgElevated, 3);
        createRect(frame, colX, y + 18, 16, 16, PALETTE.border);
        if (row.selected) {
          createRect(frame, colX + 3, y + 21, 10, 10, PALETTE.brandOrange, 2);
        }
      } else {
        var textColor = col.key === "orderId" ? PALETTE.brandBlue : PALETTE.textPrimary;
        if (col.key === "amount") { textColor = PALETTE.textPrimary; }
        if (col.key === "product") { textColor = PALETTE.textPrimary; }
        createText(frame, colX, y + 18, cellVal, 13, textColor, fontName, col.key === "orderId");
      }
      colX += col.width;
    }
    // 하단 구분선
    createRect(frame, x, y + 52, w, 1, PALETTE.borderLight);
    y += 52;
  }
  return y;
}

// ─── 페이지네이션 ─────────────────────────────────────────────────────────────
function drawPagination(frame, x, y, w, currentPage, totalPages, fontName) {
  var paginationY = y + 20;
  // 페이지당 행 수 선택
  createRect(frame, x + 16, paginationY, 110, 32, PALETTE.bgSurface, 4);
  createText(frame, x + 32, paginationY + 9, "행: 10개  ▾", 12, PALETTE.textSecondary, fontName, false);
  // 총 개수
  createText(frame, x + 144, paginationY + 9, "총 247건", 12, PALETTE.textMuted, fontName, false);
  // 페이지 버튼들 (중앙)
  var pageX = x + w / 2 - 130;
  // 이전 버튼
  createRect(frame, pageX, paginationY, 32, 32, PALETTE.bgSurface, 4);
  createText(frame, pageX + 10, paginationY + 9, "‹", 14, PALETTE.textSecondary, fontName, false);
  pageX += 40;
  var pages = [1, 2, 3, 4, 5];
  for (var p = 0; p < pages.length; p += 1) {
    var isActive = pages[p] === currentPage;
    var btnBg = isActive ? PALETTE.brandOrange : PALETTE.bgSurface;
    var btnText = isActive ? PALETTE.white : PALETTE.textSecondary;
    createRect(frame, pageX, paginationY, 32, 32, btnBg, 4);
    createText(frame, pageX + (pages[p] > 9 ? 8 : 12), paginationY + 9, String(pages[p]), 13, btnText, fontName, isActive);
    pageX += 40;
  }
  // 다음 버튼
  createRect(frame, pageX, paginationY, 32, 32, PALETTE.bgSurface, 4);
  createText(frame, pageX + 10, paginationY + 9, "›", 14, PALETTE.textSecondary, fontName, false);
}

// ─── PC 테이블 메인 프레임 ────────────────────────────────────────────────────
function drawTablePC(frame, spec, fontName) {
  var pad = 80;
  var tableW = spec.width - pad * 2;

  drawNavbar(frame, spec, fontName);
  var y = 80;

  // 페이지 제목
  y = drawPageHeader(frame, pad, y, "주문 관리", "전체 주문 내역을 확인하고 상태를 관리하세요.", fontName);

  // 탭 영역
  var tabs = ["전체 (247)", "결제완료 (82)", "배송중 (63)", "배송완료 (91)", "취소/반품 (11)"];
  var tabX = pad;
  for (var t = 0; t < tabs.length; t += 1) {
    var isActiveTab = t === 0;
    var tabW = t === 0 ? 100 : 110;
    if (t === 1) { tabW = 110; }
    if (t === 2) { tabW = 90; }
    if (t === 3) { tabW = 100; }
    if (t === 4) { tabW = 110; }
    if (isActiveTab) {
      createRect(frame, tabX, y, tabW, 36, PALETTE.bgBase);
      createText(frame, tabX + 8, y + 10, tabs[t], 13, PALETTE.textPrimary, fontName, true);
      createRect(frame, tabX, y + 33, tabW, 3, PALETTE.brandOrange);
    } else {
      createRect(frame, tabX, y, tabW, 36, PALETTE.bgBase);
      createText(frame, tabX + 8, y + 10, tabs[t], 13, PALETTE.textMuted, fontName, false);
    }
    tabX += tabW + 4;
  }
  y += 40;

  // 탭 하단 구분선
  createRect(frame, pad, y, tableW, 1, PALETTE.borderLight);
  y += 16;

  // 툴바
  y = drawTableToolbar(frame, pad, y, tableW, fontName);

  // 테이블 컬럼 정의
  var cols = [
    { key: "checkbox", label: "",        width: 40,  labelW: 0,  sortable: false, sorted: false },
    { key: "orderId",  label: "주문번호",  width: 160, labelW: 40, sortable: true,  sorted: false },
    { key: "customer", label: "고객명",    width: 120, labelW: 30, sortable: true,  sorted: false },
    { key: "product",  label: "상품명",    width: 280, labelW: 30, sortable: false, sorted: false },
    { key: "amount",   label: "결제금액",  width: 130, labelW: 40, sortable: true,  sorted: true  },
    { key: "status",   label: "상태",     width: 110, labelW: 20, sortable: true,  sorted: false },
    { key: "date",     label: "주문일시",  width: 150, labelW: 40, sortable: true,  sorted: false },
    { key: "action",   label: "",        width: 90,  labelW: 0,  sortable: false, sorted: false }
  ];

  // 헤더 행
  y = drawTableHeader(frame, pad, y, tableW, cols, fontName);

  // 목 데이터 행
  var rows = [
    { checkbox: "", orderId: "ORD-2024-08821", customer: "김민지", product: "오버사이즈 울 코트 / 아이보리 / L", amount: "₩189,000", status: "배송완료", date: "2026-03-26 14:32", selected: true },
    { checkbox: "", orderId: "ORD-2024-08820", customer: "이서연", product: "슬림핏 데님 팬츠 / 인디고 / 27", amount: "₩79,000",  status: "배송중",   date: "2026-03-26 11:08", selected: false },
    { checkbox: "", orderId: "ORD-2024-08819", customer: "박지훈", product: "크롭 니트 가디건 / 머스타드 / M", amount: "₩95,000",  status: "결제완료", date: "2026-03-26 09:55", selected: false },
    { checkbox: "", orderId: "ORD-2024-08818", customer: "최수아", product: "플리츠 미디 스커트 / 블랙 / S", amount: "₩67,000",  status: "배송완료", date: "2026-03-25 20:14", selected: false },
    { checkbox: "", orderId: "ORD-2024-08817", customer: "정다은", product: "린넨 와이드 팬츠 / 베이지 / M", amount: "₩112,000", status: "취소",     date: "2026-03-25 17:42", selected: false },
    { checkbox: "", orderId: "ORD-2024-08816", customer: "한예진", product: "레이어드 쉬폰 블라우스 / 화이트 / XS", amount: "₩54,000",  status: "배송중",   date: "2026-03-25 15:30", selected: false },
    { checkbox: "", orderId: "ORD-2024-08815", customer: "강유나", product: "테일러드 울 블레이저 / 차콜 / L", amount: "₩225,000", status: "결제완료", date: "2026-03-25 12:17", selected: false },
    { checkbox: "", orderId: "ORD-2024-08814", customer: "윤채원", product: "버킷햇 + 스트랩 백 세트", amount: "₩48,000",  status: "반품",     date: "2026-03-24 23:51", selected: false },
    { checkbox: "", orderId: "ORD-2024-08813", customer: "임소희", product: "스트라이프 오버셔츠 / 네이비 / M", amount: "₩88,000",  status: "배송완료", date: "2026-03-24 19:06", selected: false },
    { checkbox: "", orderId: "ORD-2024-08812", customer: "송지원", product: "포켓 카고 팬츠 / 카키 / 28", amount: "₩135,000", status: "배송중",   date: "2026-03-24 16:22", selected: false }
  ];

  y = drawTableRows(frame, pad, y, tableW, cols, rows, fontName);

  // 페이지네이션
  drawPagination(frame, pad, y, tableW, 1, 25, fontName);

  // 선택된 행 강조 표시 안내
  y += 80;
  createRect(frame, pad, y, tableW, 32, PALETTE.bgElevated, 4);
  createText(frame, pad + 16, y + 9, "1개 선택됨  •  일괄 처리: 상태 변경  |  CSV 내보내기  |  삭제", 12, PALETTE.textSecondary, fontName, false);
}

// ─── Mobile 카드형 레이아웃 ───────────────────────────────────────────────────
function drawTableMobile(frame, spec, fontName) {
  var pad = 16;
  var cardW = spec.width - pad * 2;

  drawNavbar(frame, spec, fontName);
  var y = 76;

  // 페이지 제목
  createText(frame, pad, y, "주문 관리", 20, PALETTE.textPrimary, fontName, true);
  createText(frame, pad, y + 28, "총 247건", 12, PALETTE.textMuted, fontName, false);
  y += 52;

  // 검색 바
  createRect(frame, pad, y, cardW, 44, PALETTE.bgSurface, 6);
  createRect(frame, pad + 12, y + 12, 20, 20, PALETTE.bgElevated, 10);
  createText(frame, pad + 40, y + 14, "주문번호, 고객명 검색", 13, PALETTE.textMuted, fontName, false);
  y += 56;

  // 가로 스크롤 필터 칩
  var chips = ["전체", "결제완료", "배송중", "배송완료", "취소"];
  var chipX = pad;
  for (var ch = 0; ch < chips.length; ch += 1) {
    var chipActive = ch === 0;
    var chipBg = chipActive ? PALETTE.brandOrange : PALETTE.bgSurface;
    var chipText = chipActive ? PALETTE.white : PALETTE.textSecondary;
    var chipW = ch === 0 ? 44 : (ch === 1 ? 64 : (ch === 2 ? 52 : (ch === 3 ? 64 : 44)));
    createRect(frame, chipX, y, chipW, 30, chipBg, 15);
    createText(frame, chipX + 8, y + 8, chips[ch], 12, chipText, fontName, chipActive);
    chipX += chipW + 8;
  }
  y += 46;

  // 정렬 옵션 바
  createRect(frame, pad, y, cardW, 36, PALETTE.bgSurface, 4);
  createText(frame, pad + 12, y + 10, "결제금액 높은순  ▾", 12, PALETTE.textSecondary, fontName, false);
  createText(frame, pad + cardW - 80, y + 10, "필터  |  정렬", 12, PALETTE.brandOrange, fontName, false);
  y += 48;

  // 주문 카드들
  var mobileOrders = [
    { orderId: "ORD-2024-08821", customer: "김민지", product: "오버사이즈 울 코트 / 아이보리 / L", amount: "₩189,000", status: "배송완료", date: "03.26 14:32" },
    { orderId: "ORD-2024-08820", customer: "이서연", product: "슬림핏 데님 팬츠 / 인디고 / 27", amount: "₩79,000",  status: "배송중",   date: "03.26 11:08" },
    { orderId: "ORD-2024-08819", customer: "박지훈", product: "크롭 니트 가디건 / 머스타드 / M", amount: "₩95,000",  status: "결제완료", date: "03.26 09:55" },
    { orderId: "ORD-2024-08818", customer: "최수아", product: "플리츠 미디 스커트 / 블랙 / S", amount: "₩67,000",  status: "배송완료", date: "03.25 20:14" },
    { orderId: "ORD-2024-08817", customer: "정다은", product: "린넨 와이드 팬츠 / 베이지 / M", amount: "₩112,000", status: "취소",     date: "03.25 17:42" },
    { orderId: "ORD-2024-08816", customer: "한예진", product: "레이어드 쉬폰 블라우스", amount: "₩54,000",  status: "배송중",   date: "03.25 15:30" }
  ];

  for (var m = 0; m < mobileOrders.length; m += 1) {
    var order = mobileOrders[m];
    // 카드 배경
    createRect(frame, pad, y, cardW, 110, PALETTE.bgSurface, 8);
    // 상단: 주문번호 + 상태 배지
    createText(frame, pad + 14, y + 14, order.orderId, 12, PALETTE.brandBlue, fontName, true);
    // 상태 배지
    var stColor = PALETTE.textSecondary;
    if (order.status === "배송완료") { stColor = PALETTE.success; }
    else if (order.status === "배송중") { stColor = PALETTE.brandBlue; }
    else if (order.status === "결제완료") { stColor = PALETTE.warning; }
    else if (order.status === "취소") { stColor = PALETTE.error; }
    drawBadge(frame, pad + cardW - 82, y + 10, order.status, stColor, fontName);
    // 상품명
    var productShort = order.product;
    if (productShort.length > 24) {
      productShort = productShort.substring(0, 23) + "...";
    }
    createText(frame, pad + 14, y + 36, productShort, 13, PALETTE.textPrimary, fontName, false);
    // 고객명 + 날짜
    createText(frame, pad + 14, y + 58, order.customer + "  ·  " + order.date, 12, PALETTE.textMuted, fontName, false);
    // 금액
    createText(frame, pad + 14, y + 78, order.amount, 15, PALETTE.textPrimary, fontName, true);
    // 상세보기 링크
    createText(frame, pad + cardW - 68, y + 82, "상세보기 →", 12, PALETTE.brandOrange, fontName, false);
    // 하단 구분선
    createRect(frame, pad + 14, y + 107, cardW - 28, 1, PALETTE.borderLight);
    y += 118;
  }

  // 더보기 버튼
  y += 8;
  createRect(frame, pad, y, cardW, 44, PALETTE.bgSurface, 8);
  createText(frame, pad + cardW / 2 - 36, y + 13, "더 보기 (241건)", 13, PALETTE.textSecondary, fontName, false);
}

// ─── 필터 상태 PC 프레임 ──────────────────────────────────────────────────────
function drawFilterStates(frame, spec, fontName) {
  var pad = 80;
  var w = spec.width - pad * 2;

  drawNavbar(frame, spec, fontName);
  var y = 80;

  createText(frame, pad, y, "필터링 상태 패턴", 22, PALETTE.textPrimary, fontName, true);
  createText(frame, pad, y + 32, "텍스트 검색 / 드롭다운 선택 / 날짜 범위 — 3가지 필터 조합 상태", 13, PALETTE.textMuted, fontName, false);
  y += 64;

  // ─ 구분선 ─
  createRect(frame, pad, y, w, 1, PALETTE.borderLight);
  y += 24;

  // [상태 A] 텍스트 검색 활성
  createText(frame, pad, y, "A.  텍스트 검색 활성 상태", 14, PALETTE.textSecondary, fontName, true);
  y += 28;
  createRect(frame, pad, y, w, 60, PALETTE.bgSurface, 8);
  // 활성 검색 입력 (포커스 보더)
  createRect(frame, pad + 16, y + 14, 280, 32, PALETTE.bgElevated, 4);
  createRect(frame, pad + 16, y + 14, 280, 32, PALETTE.brandOrange);
  createText(frame, pad + 32, y + 22, "김민지", 13, PALETTE.textPrimary, fontName, false);
  // 검색어 칩
  createRect(frame, pad + 308, y + 14, 80, 32, PALETTE.bgElevated, 16);
  createText(frame, pad + 320, y + 22, "김민지  ×", 12, PALETTE.brandOrange, fontName, false);
  // 결과 카운트
  createText(frame, pad + 410, y + 22, "3건 검색됨", 12, PALETTE.success, fontName, false);
  // 초기화 버튼
  createRect(frame, pad + w - 90, y + 14, 74, 32, PALETTE.bgElevated, 4);
  createText(frame, pad + w - 78, y + 22, "필터 초기화", 11, PALETTE.textMuted, fontName, false);
  y += 76;

  // 미니 결과 테이블 (3행)
  var miniCols = [
    { key: "orderId",  label: "주문번호", width: 160 },
    { key: "customer", label: "고객명",   width: 100 },
    { key: "product",  label: "상품명",   width: 320 },
    { key: "amount",   label: "결제금액", width: 130 },
    { key: "status",   label: "상태",    width: 110 }
  ];
  createRect(frame, pad, y, w, 40, PALETTE.bgElevated);
  var miniX = pad + 16;
  for (var mc = 0; mc < miniCols.length; mc += 1) {
    createText(frame, miniX, y + 12, miniCols[mc].label, 12, PALETTE.textSecondary, fontName, true);
    miniX += miniCols[mc].width;
  }
  createRect(frame, pad, y + 40, w, 1, PALETTE.borderLight);
  var miniRows = [
    { orderId: "ORD-2024-08821", customer: "김민지", product: "오버사이즈 울 코트 / 아이보리 / L", amount: "₩189,000", status: "배송완료" },
    { orderId: "ORD-2024-07334", customer: "김민지", product: "슬림핏 블랙 스키니 진 / 28", amount: "₩82,000",  status: "배송완료" },
    { orderId: "ORD-2024-05102", customer: "김민지", product: "크롭 니트 가디건 / 아이보리 / S", amount: "₩95,000",  status: "취소" }
  ];
  var rowY2 = y + 41;
  for (var mr = 0; mr < miniRows.length; mr += 1) {
    var mRow = miniRows[mr];
    createRect(frame, pad, rowY2, w, 44, mr % 2 === 0 ? PALETTE.bgBase : PALETTE.bgSurface);
    var mColX = pad + 16;
    createText(frame, mColX, rowY2 + 14, mRow.orderId, 12, PALETTE.brandBlue, fontName, false);
    mColX += 160;
    createText(frame, mColX, rowY2 + 14, mRow.customer, 12, PALETTE.textPrimary, fontName, false);
    mColX += 100;
    createText(frame, mColX, rowY2 + 14, mRow.product, 12, PALETTE.textPrimary, fontName, false);
    mColX += 320;
    createText(frame, mColX, rowY2 + 14, mRow.amount, 12, PALETTE.textPrimary, fontName, false);
    mColX += 130;
    var sColor2 = mRow.status === "배송완료" ? PALETTE.success : PALETTE.error;
    drawBadge(frame, mColX, rowY2 + 11, mRow.status, sColor2, fontName);
    createRect(frame, pad, rowY2 + 44, w, 1, PALETTE.borderLight);
    rowY2 += 44;
  }
  y = rowY2 + 24;

  // ─ 구분선 ─
  createRect(frame, pad, y, w, 1, PALETTE.borderLight);
  y += 24;

  // [상태 B] 드롭다운 필터 열림
  createText(frame, pad, y, "B.  드롭다운 필터 열린 상태 (상태 선택)", 14, PALETTE.textSecondary, fontName, true);
  y += 28;
  createRect(frame, pad, y, w, 60, PALETTE.bgSurface, 8);
  createRect(frame, pad + 16, y + 14, 140, 32, PALETTE.bgElevated, 4);
  createRect(frame, pad + 16, y + 14, 140, 32, PALETTE.brandOrange);
  createText(frame, pad + 28, y + 22, "상태 선택  ▾", 13, PALETTE.brandOrange, fontName, false);

  // 드롭다운 패널
  createRect(frame, pad + 16, y + 50, 160, 180, PALETTE.bgElevated, 6);
  createRect(frame, pad + 16, y + 50, 160, 180, PALETTE.border);
  var dropItems = ["전체", "결제완료", "배송중", "배송완료", "취소", "반품"];
  var dropBg = [false, false, false, true, false, false];
  for (var d = 0; d < dropItems.length; d += 1) {
    var dBg = dropBg[d] ? PALETTE.bgHover : PALETTE.bgElevated;
    var dText = dropBg[d] ? PALETTE.textPrimary : PALETTE.textSecondary;
    createRect(frame, pad + 16, y + 50 + d * 30, 160, 30, dBg);
    createText(frame, pad + 30, y + 60 + d * 30, dropItems[d], 13, dText, fontName, dropBg[d]);
    if (dropBg[d]) {
      createText(frame, pad + 148, y + 60 + d * 30, "✓", 12, PALETTE.brandOrange, fontName, true);
    }
  }
  y += 260;

  // ─ 구분선 ─
  createRect(frame, pad, y, w, 1, PALETTE.borderLight);
  y += 24;

  // [상태 C] 날짜 범위 필터
  createText(frame, pad, y, "C.  날짜 범위 필터 (Date Range Picker)", 14, PALETTE.textSecondary, fontName, true);
  y += 28;
  createRect(frame, pad, y, w, 60, PALETTE.bgSurface, 8);
  // 시작일 입력
  createRect(frame, pad + 16, y + 14, 148, 32, PALETTE.bgElevated, 4);
  createRect(frame, pad + 16, y + 14, 148, 32, PALETTE.brandOrange);
  createText(frame, pad + 28, y + 22, "2026-03-20", 13, PALETTE.textPrimary, fontName, false);
  createText(frame, pad + 172, y + 22, "~", 14, PALETTE.textMuted, fontName, false);
  // 종료일 입력
  createRect(frame, pad + 192, y + 14, 148, 32, PALETTE.bgElevated, 4);
  createRect(frame, pad + 192, y + 14, 148, 32, PALETTE.brandOrange);
  createText(frame, pad + 204, y + 22, "2026-03-27", 13, PALETTE.textPrimary, fontName, false);
  // 적용 버튼
  createRect(frame, pad + 356, y + 14, 72, 32, PALETTE.brandOrange, 4);
  createText(frame, pad + 368, y + 22, "적용", 13, PALETTE.white, fontName, true);
  // 범위 결과
  createText(frame, pad + 444, y + 22, "7일간 • 58건", 12, PALETTE.success, fontName, false);
  // 단축 버튼
  var shortcuts = ["오늘", "7일", "30일", "3개월"];
  var scX = pad + w - 280;
  for (var sc = 0; sc < shortcuts.length; sc += 1) {
    createRect(frame, scX, y + 16, 54, 28, PALETTE.bgElevated, 4);
    createText(frame, scX + 12, y + 24, shortcuts[sc], 12, PALETTE.textMuted, fontName, false);
    scX += 62;
  }
}

// ─── 빈 상태 프레임 ───────────────────────────────────────────────────────────
function drawEmptyState(frame, spec, fontName) {
  var pad = 80;
  var w = spec.width - pad * 2;

  drawNavbar(frame, spec, fontName);
  var y = 80;

  createText(frame, pad, y, "주문 관리", 24, PALETTE.textPrimary, fontName, true);
  createText(frame, pad, y + 34, "전체 주문 내역을 확인하고 상태를 관리하세요.", 13, PALETTE.textMuted, fontName, false);
  y += 72;

  // 빈 툴바
  createRect(frame, pad, y, w, 52, PALETTE.bgSurface, 8);
  createRect(frame, pad + 16, y + 12, 260, 28, PALETTE.bgElevated, 4);
  createText(frame, pad + 32, y + 18, "\"패딩\"  ×", 12, PALETTE.brandOrange, fontName, false);
  createRect(frame, pad + 292, y + 12, 80, 28, PALETTE.bgElevated, 4);
  createText(frame, pad + 308, y + 18, "상태  ▾", 12, PALETTE.textSecondary, fontName, false);
  createRect(frame, pad + w - 90, y + 12, 74, 28, PALETTE.bgElevated, 4);
  createText(frame, pad + w - 78, y + 18, "필터 초기화", 11, PALETTE.brandOrange, fontName, false);
  y += 68;

  // 테이블 헤더 (비어있음)
  createRect(frame, pad, y, w, 44, PALETTE.bgElevated);
  createRect(frame, pad, y, w, 1, PALETTE.border);
  var emptyHeaders = ["주문번호", "고객명", "상품명", "결제금액", "상태", "주문일시"];
  var ehX = pad + 16;
  var ehWidths = [160, 120, 300, 130, 110, 160];
  for (var eh = 0; eh < emptyHeaders.length; eh += 1) {
    createText(frame, ehX, y + 14, emptyHeaders[eh], 12, PALETTE.textSecondary, fontName, true);
    ehX += ehWidths[eh];
  }
  createRect(frame, pad, y + 44, w, 1, PALETTE.borderLight);
  y += 60;

  // 빈 상태 중앙 영역
  var emptyH = 280;
  createRect(frame, pad, y, w, emptyH, PALETTE.bgBase);

  // 빈 상태 아이콘 (원형 + 박스 아이콘 표현)
  var centerX = spec.width / 2;
  var iconY = y + 60;
  createRect(frame, centerX - 36, iconY, 72, 72, PALETTE.bgSurface, 36);
  createRect(frame, centerX - 20, iconY + 16, 40, 40, PALETTE.bgElevated, 6);
  createRect(frame, centerX - 14, iconY + 22, 12, 8, PALETTE.textMuted, 2);
  createRect(frame, centerX - 14, iconY + 34, 28, 8, PALETTE.textMuted, 2);
  createRect(frame, centerX - 14, iconY + 46, 20, 8, PALETTE.textMuted, 2);

  // 빈 상태 텍스트
  createText(frame, centerX - 80, iconY + 84, "검색 결과가 없습니다", 16, PALETTE.textPrimary, fontName, true);
  createText(frame, centerX - 110, iconY + 110, "\"패딩\" 에 해당하는 주문 내역을 찾을 수 없습니다.", 13, PALETTE.textMuted, fontName, false);
  createText(frame, centerX - 96, iconY + 132, "검색어를 변경하거나 필터를 초기화해 주세요.", 13, PALETTE.textMuted, fontName, false);

  // CTA 버튼
  createRect(frame, centerX - 80, iconY + 168, 160, 40, PALETTE.bgSurface, 6);
  createRect(frame, centerX - 80, iconY + 168, 160, 40, PALETTE.border);
  createText(frame, centerX - 44, iconY + 179, "필터 초기화하기", 13, PALETTE.textPrimary, fontName, true);

  y += emptyH + 20;

  // 하단 데이터 없음 케이스
  createRect(frame, pad, y, w, 1, PALETTE.borderLight);
  y += 24;
  createText(frame, pad, y, "데이터 없음 상태 (신규 계정)", 14, PALETTE.textSecondary, fontName, true);
  y += 28;

  var emptyH2 = 140;
  createRect(frame, pad, y, w, emptyH2, PALETTE.bgSurface, 8);
  var c2X = spec.width / 2;
  createRect(frame, c2X - 24, y + 28, 48, 48, PALETTE.bgElevated, 24);
  createRect(frame, c2X - 10, y + 42, 20, 20, PALETTE.borderLight, 4);
  createText(frame, c2X - 72, y + 78, "아직 주문 내역이 없습니다", 14, PALETTE.textPrimary, fontName, true);
  createText(frame, c2X - 84, y + 100, "고객이 첫 주문을 하면 여기에 표시됩니다.", 12, PALETTE.textMuted, fontName, false);
}

// ─── 프레임 빌더 ──────────────────────────────────────────────────────────────
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

    if (spec.category === "table") {
      drawTablePC(frame, spec, fontFamily);
    } else if (spec.category === "mobile") {
      drawTableMobile(frame, spec, fontFamily);
    } else if (spec.category === "filter") {
      drawFilterStates(frame, spec, fontFamily);
    } else if (spec.category === "empty") {
      drawEmptyState(frame, spec, fontFamily);
    }

    figma.viewport.scrollAndZoomIntoView([frame]);
    offsetX += spec.width + 80;
  }

  figma.notify("" + specs.length + "개 프레임 생성 완료");
}

// ─── 메시지 핸들러 ────────────────────────────────────────────────────────────
figma.ui.onmessage = async function(msg) {
  try {
    if (!msg || !msg.type) { return; }
    if (msg.type === "all") {
      await buildFramesByCategory("all");
    } else if (msg.type === "table") {
      await buildFramesByCategory("table");
    } else if (msg.type === "mobile") {
      await buildFramesByCategory("mobile");
    } else if (msg.type === "filter") {
      await buildFramesByCategory("filter");
    } else if (msg.type === "empty") {
      await buildFramesByCategory("empty");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
