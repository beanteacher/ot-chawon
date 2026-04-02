from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "ot-chawon AI Inference Server"
    app_version: str = "0.1.0"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Redis
    redis_url: str = "redis://localhost:6379"
    redis_ttl_seconds: int = 3600

    # AWS S3
    aws_region: str = "ap-northeast-2"
    s3_bucket: str = "ot-chawon-assets"
    cloudfront_url: str = "https://cdn.ot-chawon.com"

    # SMPL-X
    smplx_model_path: str = "/models/smplx"

    # AI Server
    ai_server_url: str = "http://localhost:8000"
    ai_server_base_url: str = "http://ai-server:8001"

    # Backend fitting-service
    fitting_service_url: str = "http://localhost:8001"

    # GPU
    gpu_batch_size: int = 8

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
