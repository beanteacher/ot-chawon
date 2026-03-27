---
description: JIRA 티켓 발행, 스프린트 생성/시작/종료, 코멘트 작성 시 자동 참조. jira_create_issue, jira_create_sprint, jira_update_sprint, jira_transition_issue, jira_add_comment 호출 전 반드시 이 규칙을 따른다.
---

# JIRA 운영 스킬 — 옷차원

JIRA 티켓 발행, 스크럼/스프린트 관리, 코멘트 작성 시 참조하는 규칙.

## 티켓 description 작성 규칙

### 줄바꿈: `\n` 리터럴 금지

JIRA description/comment 필드에 `\n` 문자열을 직접 넣으면 줄바꿈이 아니라 `\n` 텍스트가 그대로 노출된다.

**금지 패턴:**
```
"상품 등록, 수정, Soft Delete.\n\nDoD: Swagger 확인\n담당: Backend | 소요: 2일"
```

**올바른 패턴 — 마크다운 구조 사용:**
```
"## 설명\n\n상품 등록, 수정, Soft Delete, 페이지네이션, 카테고리/브랜드 필터, 키워드 검색.\n\n## DoD\n\n- Swagger에서 전체 API 동작 확인\n\n## 담당\n\nBackend\n\n## 소요\n\n2일"
```

JIRA Cloud는 마크다운 `##` 헤딩과 `-` 리스트를 ADF로 자동 변환한다. 반드시 `## 섹션명` + 빈 줄(`\n\n`)로 구분한다.

### 필수 섹션 구조

모든 티켓 description은 아래 4개 섹션을 포함해야 한다:

```
## 설명

{작업 내용 상세 설명}

## DoD

- {완료 기준 1}
- {완료 기준 2}

## 담당

{역할: Backend / Frontend / UI/UX / AI/ML / DevOps / QA}

## 소요

{예상 소요일}
```

### 코멘트 작성 규칙

`jira_transition_issue`의 comment 파라미터 또는 `jira_add_comment`에서:

**금지:**
- `comment` 파라미터에 `\n` 리터럴 포함 (Atlassian Document Format 에러 발생)
- 한 줄짜리 긴 문장

**올바른 방법:**
- comment 없이 transition만 실행하거나
- 짧은 단일 문장 사용 (줄바꿈 불필요한 수준)
- 긴 코멘트가 필요하면 `jira_add_comment` 별도 호출

### 스프린트 발행 규칙

`jira_create_sprint` 사용 시:

```json
{
  "board_id": "1",
  "name": "Sprint {N}-{sub} ({날짜} {요일})",
  "goal": "핵심 작업 요약 (한 줄)",
  "start_date": "YYYY-MM-DDT00:00:00.000Z",
  "end_date": "YYYY-MM-DDT23:59:00.000Z"
}
```

- name 형식: `Sprint 3-1 (4/10 금)` — 스프린트 번호 + 날짜 + 요일
- goal: 한 줄 요약 (줄바꿈 금지)
- start_date/end_date: ISO 8601 UTC

### 티켓 발행 규칙

`jira_create_issue` 사용 시:

```json
{
  "project_key": "SCRUM",
  "issue_type": "스토리",
  "summary": "{역할 약어}: {작업 요약}",
  "description": "## 설명\n\n{상세}\n\n## DoD\n\n- {기준1}\n- {기준2}\n\n## 담당\n\n{역할}\n\n## 소요\n\n{일수}",
  "labels": ["Sprint-{N}", "MVP", "Day-{D}"]
}
```

- summary 접두사: `BE:`, `FE:`, `UI:`, `AI:`, `DevOps:`, `QA:`
- labels: Sprint 번호 + MVP + Day 번호
- priority: High / Medium / Low

### 티켓 완료 처리

1. `jira_get_transitions`로 transition ID 확인 (보통 완료=41)
2. `jira_transition_issue`로 전환 (comment 파라미터 사용하지 않음)
3. 필요 시 `jira_add_comment`로 별도 코멘트 추가

### 스프린트 시작/종료

- 시작: `jira_update_sprint(sprint_id, state="active")`
- 종료: `jira_update_sprint(sprint_id, state="closed")`
- future → active → closed 순서 필수 (future에서 바로 closed 불가)
