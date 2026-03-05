# 3D Day1 - GLB Spec v0

## Delivery Spec
- format: .glb
- size target: <= 5MB per model
- polygon budget: High<=50k, Mid<=20k, Low<=5k
- texture: 2048(max detail), 1024(AI), 512(list)

## Naming Rule
- {BRAND}_{ITEM}_{COLOR}_{LOD}.glb
- example: BRAND001_ITEM00123_BLACK_HIGH.glb

## Sample Asset Plan (1 item)
- choose: basic t-shirt black
- outputs: HIGH/MID/LOW 3 variants
- checks: normals, uv, draco compression, viewer load test
