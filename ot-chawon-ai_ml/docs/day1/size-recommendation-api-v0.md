# AI/ML Day1 - Size Recommendation API v0

## V0 Scope
- in: body profile
- out: size recommendation (no generated fitting image in V0)

## Input Schema v0
- height_cm: number
- weight_kg: number
- gender: enum(male,female,other)
- chest_cm?: number
- waist_cm?: number
- hip_cm?: number
- brand_id?: string
- product_id?: string

## Output Schema v0
- recommended_size: string (XS|S|M|L|XL|XXL)
- confidence: number (0~1)
- reason: string[]

## FastAPI Endpoints
- GET /health
- POST /size/predict
