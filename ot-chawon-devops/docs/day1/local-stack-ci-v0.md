# DevOps Day1 - Local Stack/CI v0

## docker-compose minimal
- mysql:8
- redis:7
- kafka + zookeeper (dev mode)
- spring-gateway (placeholder)
- nextjs-frontend (placeholder)

## .env.example required keys
- APP_ENV
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
- REDIS_HOST, REDIS_PORT
- KAFKA_BOOTSTRAP_SERVERS
- NEXT_PUBLIC_SPRING_GATEWAY_URL

## CI minimum scope
- trigger: PR to develop/main
- jobs: lint -> unit test -> build
- fail-fast enabled
