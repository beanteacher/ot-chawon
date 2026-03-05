# Smoke Triage Checklist

1. 실패 케이스의 HTTP status/code 확인
2. 요청 payload와 환경값(baseUrl) 확인
3. 재시도 1회 수행
4. 동일 실패 시 blocker 여부 판정
5. blocker면 PM 보고 + 로그 첨부
