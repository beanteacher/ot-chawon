# Day7 Execution Order

1. `./scripts/check-local-tools-summary.sh`
2. `docker compose up -d`
3. `./scripts/revalidate-compose.sh`
4. AI: `pytest -q`
5. QA: `cd newman && ./run-smoke-with-log.sh`
