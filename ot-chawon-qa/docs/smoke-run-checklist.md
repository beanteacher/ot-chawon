# Smoke Run Checklist

1. API server up (`/health` responds 200)
2. Newman installed (`newman --version`)
3. Environment file points to correct `baseUrl`
4. Run `./newman/run-smoke.sh`
5. Capture pass/fail and attach output to PM report
