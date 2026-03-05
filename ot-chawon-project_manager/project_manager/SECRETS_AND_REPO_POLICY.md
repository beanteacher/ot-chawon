# Secrets 보관 + Sub Agent Repo 정책

## 1) 변수 값(Secrets) 보관 원칙
- 절대 금지: `~/.claude.json`, 코드 파일, `AGENTS.md`, 커밋된 `.env` 파일에 평문 저장
- 권장 위치: 사용자 홈의 로컬 전용 파일
  - `~/.config/ot-chawon/secrets/common.env`
  - `~/.config/ot-chawon/secrets/{sub_agent}.env`
- 파일 권한: `chmod 600` (소유자만 읽기/쓰기)
- Git에는 `*.env`, `secrets/`, `*.pem`, `*.key` 전부 ignore

## 2) MCP/로컬 실행 시 주입 방식
- 실행 전에 shell 환경변수로 export
- 예시:
  - `set -a && source ~/.config/ot-chawon/secrets/common.env && set +a`
  - `set -a && source ~/.config/ot-chawon/secrets/backend_developer.env && set +a`
- 프로젝트에는 값 없는 샘플만 보관:
  - `.env.example`

## 3) GitHub Repo 생성 기준
- 생성 형식: `ot-chawon-{sub_agent_name}`
- 레포 생성 "필수": 코드/스크립트/인프라가 독립 산출물인 경우
- 레포 생성 "불필요": 문서/기획/Figma 중심으로 코드 산출물이 거의 없는 경우

## 4) 에이전트별 초기 판단
- 생성: `ot-chawon-backend_developer`
- 생성: `ot-chawon-frontend_developer`
- 생성: `ot-chawon-ai_ml`
- 생성: `ot-chawon-devops`
- 생성: `ot-chawon-qa`
- 생성: `ot-chawon-3d_graphics_designer` (에셋 파이프라인 스크립트/검수 자동화가 있으면)
- 미생성: `ot-chawon-project_manager`
- 미생성: `ot-chawon-uiux_designer`

## 5) 시작 절차 (토큰 절약)
1. PM이 생성 대상 레포만 먼저 만든다.
2. 각 Sub Agent는 Slack/Jira 없이 로컬 파일 기반으로 Day1 산출물을 만든다.
3. Day1 종료 후에만 Jira 티켓 일괄 생성.

## 6) Git 작업 규칙
- 커밋(`git commit`)은 각 Sub Agent가 자율적으로 진행한다.
- 푸시(`git push`)는 자동 실행 금지.
- 푸시할 변경이 생기면 아래 형식으로 사용자 확인 후 진행:
  - 대상 브랜치
  - 커밋 수
  - 변경 파일 요약
  - 실행할 push 명령어
- 사용자 승인 전에는 원격 push를 실행하지 않는다.

## 7) 즉시 해야 할 보안 작업
- 현재 노출된 Slack/Jira/GitHub 토큰은 즉시 폐기(rotate) 후 재발급
- 새 토큰은 위 secrets 경로로 이동
