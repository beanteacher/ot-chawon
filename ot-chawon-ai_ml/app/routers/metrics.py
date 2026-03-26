from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter(tags=["metrics"])


@router.get("/metrics", response_class=PlainTextResponse)
async def get_metrics() -> str:
    """Prometheus 메트릭을 노출합니다."""
    # TODO: prometheus_client 연동
    metrics_output = (
        "# HELP fit_inference_duration_seconds 피팅 추론 소요 시간\n"
        "# TYPE fit_inference_duration_seconds histogram\n"
        "# HELP gpu_memory_used_bytes GPU 메모리 사용량\n"
        "# TYPE gpu_memory_used_bytes gauge\n"
        "# HELP fit_queue_length 피팅 큐 대기 작업 수\n"
        "# TYPE fit_queue_length gauge\n"
        "fit_queue_length 0\n"
        "# HELP fit_error_total 피팅 오류 총 횟수\n"
        "# TYPE fit_error_total counter\n"
        "fit_error_total 0\n"
    )
    return metrics_output
