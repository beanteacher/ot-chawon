# SMPL-24 리깅 스펙 문서

## 개요

본 문서는 옷차원 3D 의류 에셋에 적용된 SMPL 24 joints 스켈레톤 리깅 스펙을 정의합니다.
모든 리깅 에셋은 glTF 2.0 GLB 포맷으로 생성되며, `skin` 오브젝트에 24개의 joint 노드가 포함됩니다.

---

## SMPL 24 Joint 인덱스 표

| Idx | Name        | 부위       | 부모 Joint  |
|-----|-------------|-----------|------------|
| 0   | Pelvis      | 골반       | (root)     |
| 1   | L_Hip       | 왼쪽 엉덩이 | 0 Pelvis   |
| 2   | R_Hip       | 오른쪽 엉덩이| 0 Pelvis  |
| 3   | Spine1      | 척추 하부   | 0 Pelvis   |
| 4   | L_Knee      | 왼쪽 무릎  | 1 L_Hip    |
| 5   | R_Knee      | 오른쪽 무릎 | 2 R_Hip    |
| 6   | Spine2      | 척추 중부   | 3 Spine1   |
| 7   | L_Ankle     | 왼쪽 발목  | 4 L_Knee   |
| 8   | R_Ankle     | 오른쪽 발목 | 5 R_Knee   |
| 9   | Spine3      | 척추 상부   | 6 Spine2   |
| 10  | L_Foot      | 왼쪽 발    | 7 L_Ankle  |
| 11  | R_Foot      | 오른쪽 발  | 8 R_Ankle  |
| 12  | Neck        | 목         | 9 Spine3   |
| 13  | L_Collar    | 왼쪽 쇄골  | 9 Spine3   |
| 14  | R_Collar    | 오른쪽 쇄골 | 9 Spine3  |
| 15  | Head        | 머리       | 12 Neck    |
| 16  | L_Shoulder  | 왼쪽 어깨  | 13 L_Collar|
| 17  | R_Shoulder  | 오른쪽 어깨 | 14 R_Collar|
| 18  | L_Elbow     | 왼쪽 팔꿈치 | 16 L_Shoulder|
| 19  | R_Elbow     | 오른쪽 팔꿈치| 17 R_Shoulder|
| 20  | L_Wrist     | 왼쪽 손목  | 18 L_Elbow |
| 21  | R_Wrist     | 오른쪽 손목 | 19 R_Elbow |
| 22  | L_Hand      | 왼쪽 손    | 20 L_Wrist |
| 23  | R_Hand      | 오른쪽 손  | 21 R_Wrist |

---

## 계층 구조 다이어그램

```
Pelvis (0)
├── L_Hip (1)
│   └── L_Knee (4)
│       └── L_Ankle (7)
│           └── L_Foot (10)
├── R_Hip (2)
│   └── R_Knee (5)
│       └── R_Ankle (8)
│           └── R_Foot (11)
└── Spine1 (3)
    └── Spine2 (6)
        └── Spine3 (9)
            ├── Neck (12)
            │   └── Head (15)
            ├── L_Collar (13)
            │   └── L_Shoulder (16)
            │       └── L_Elbow (18)
            │           └── L_Wrist (20)
            │               └── L_Hand (22)
            └── R_Collar (14)
                └── R_Shoulder (17)
                    └── R_Elbow (19)
                        └── R_Wrist (21)
                            └── R_Hand (23)
```

---

## 의류 카테고리별 영향 Joint 목록

### TOP (상의: 티셔츠, 블라우스 등)

상체 전체 + 팔 영역에 영향을 받습니다.

| Joint Idx | Name       | 역할            |
|-----------|------------|----------------|
| 0         | Pelvis     | 하단 고정       |
| 1         | L_Hip      | 하단 좌측       |
| 2         | R_Hip      | 하단 우측       |
| 3         | Spine1     | 허리 하부       |
| 6         | Spine2     | 허리 중부       |
| 9         | Spine3     | 허리 상부       |
| 12        | Neck       | 목 영역         |
| 13        | L_Collar   | 왼쪽 어깨 기점  |
| 14        | R_Collar   | 오른쪽 어깨 기점|
| 16        | L_Shoulder | 왼쪽 소매       |
| 17        | R_Shoulder | 오른쪽 소매     |
| 18        | L_Elbow    | 왼쪽 소매 중단  |
| 19        | R_Elbow    | 오른쪽 소매 중단|
| 20        | L_Wrist    | 왼쪽 소매 끝    |
| 21        | R_Wrist    | 오른쪽 소매 끝  |
| 22        | L_Hand     | 왼쪽 손목 끝    |
| 23        | R_Hand     | 오른쪽 손목 끝  |

### BOTTOM (하의: 팬츠, 스커트 등)

하체 전체 영역에 영향을 받습니다.

| Joint Idx | Name    | 역할          |
|-----------|---------|--------------|
| 0         | Pelvis  | 허리 기점     |
| 1         | L_Hip   | 왼쪽 엉덩이   |
| 2         | R_Hip   | 오른쪽 엉덩이 |
| 3         | Spine1  | 허리 상단     |
| 4         | L_Knee  | 왼쪽 무릎     |
| 5         | R_Knee  | 오른쪽 무릎   |
| 6         | Spine2  | 허리 보조     |
| 7         | L_Ankle | 왼쪽 발목     |
| 8         | R_Ankle | 오른쪽 발목   |
| 10        | L_Foot  | 왼쪽 발       |
| 11        | R_Foot  | 오른쪽 발     |

### OUTER (아우터: 코트, 재킷 등)

전신 커버리지 (상하체 모두 포함).

| Joint Idx | Name       | 역할              |
|-----------|------------|-----------------|
| 0         | Pelvis     | 골반 기점         |
| 1         | L_Hip      | 왼쪽 엉덩이       |
| 2         | R_Hip      | 오른쪽 엉덩이     |
| 3         | Spine1     | 척추 하부         |
| 4         | L_Knee     | 왼쪽 무릎 (롱코트)|
| 5         | R_Knee     | 오른쪽 무릎       |
| 6         | Spine2     | 척추 중부         |
| 7         | L_Ankle    | 왼쪽 발목 (맥시)  |
| 8         | R_Ankle    | 오른쪽 발목       |
| 9         | Spine3     | 척추 상부         |
| 12        | Neck       | 목 영역           |
| 13        | L_Collar   | 왼쪽 쇄골         |
| 14        | R_Collar   | 오른쪽 쇄골       |
| 16        | L_Shoulder | 왼쪽 어깨         |
| 17        | R_Shoulder | 오른쪽 어깨       |
| 18        | L_Elbow    | 왼쪽 팔꿈치       |
| 19        | R_Elbow    | 오른쪽 팔꿈치     |
| 20        | L_Wrist    | 왼쪽 손목         |
| 21        | R_Wrist    | 오른쪽 손목       |
| 22        | L_Hand     | 왼쪽 손           |
| 23        | R_Hand     | 오른쪽 손         |

---

## Weight Paint 방식

- **알고리즘**: Inverse Distance Weighting (IDW)
- **최대 영향 Joint 수**: 4 (JOINTS_0 / WEIGHTS_0 vec4)
- **정규화**: 각 vertex의 weight 합 = 1.0
- **계산 방법**:
  1. 각 vertex에서 활성 joint까지의 유클리드 거리 계산
  2. 거리 기준 상위 4개 joint 선택
  3. `weight_k = (1 / dist_k) / sum(1 / dist_i)`로 정규화

---

## GLB 파일 구조

```
GLB (glTF 2.0)
├── JSON Chunk
│   ├── asset: { version: "2.0" }
│   ├── scene + nodes (24 joint nodes + 1 mesh node)
│   ├── meshes[0].primitives[0]
│   │   └── attributes: POSITION, NORMAL, TEXCOORD_0, JOINTS_0, WEIGHTS_0
│   ├── materials[0]: PBR metallic-roughness
│   └── skins[0]: SMPL-24 (24 joints, inverseBindMatrices)
└── BIN Chunk
    ├── POSITION (VEC3, FLOAT)
    ├── NORMAL (VEC3, FLOAT)
    ├── TEXCOORD_0 (VEC2, FLOAT)
    ├── indices (SCALAR, UNSIGNED_SHORT)
    ├── JOINTS_0 (VEC4, UNSIGNED_BYTE)
    ├── WEIGHTS_0 (VEC4, FLOAT)
    └── inverseBindMatrices (MAT4 × 24, FLOAT)
```

---

## 생성 에셋 목록

| 파일명 | 카테고리 | 활성 Joints | 파일 크기 |
|--------|---------|------------|---------|
| MUSINSA_TOP_TSHIRT_BLACK_RIGGED.glb   | TOP    | 17개 | 6,124 bytes |
| MUSINSA_BOTTOM_PANTS_NAVY_RIGGED.glb  | BOTTOM | 11개 | 6,096 bytes |
| MUSINSA_OUTER_COAT_BEIGE_RIGGED.glb   | OUTER  | 23개 | 6,756 bytes |

---

## 관련 스크립트

- `scripts/generate_rigged_glb.mjs`: 리깅 GLB 생성
- `scripts/validate_rigging.sh`: GLB 유효성 검사 (skins, joint count, 파일 크기)
