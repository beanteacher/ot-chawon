# Unblock Docker on WSL

## Steps
1. Docker Desktop 설치/실행
2. Settings > Resources > WSL Integration
3. 사용중인 WSL distro 토글 ON
4. WSL 터미널 재시작

## Verify
- docker --version
- docker compose version
- docker compose -f docker-compose.yml config
