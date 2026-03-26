# GLB 포맷 요구사항 명세

## 1. 기본 포맷 요구사항

### 파일 포맷
- **포맷**: GLB (glTF Binary) 2.0
- **표준**: Khronos Group glTF 2.0 사양 준수
- **확장자**: `.glb`

### 필수 glTF 확장
| 확장 | 용도 | 필수 여부 |
|------|------|-----------|
| `KHR_draco_mesh_compression` | Draco 압축 | 필수 |
| `KHR_materials_unlit` | 언릿 머티리얼 (UI 프리뷰용) | 선택 |
| `KHR_texture_basisu` | KTX2/Basis 텍스처 압축 | 권장 |

### Draco 압축
- 모든 납품 GLB에 Draco 압축 **필수** 적용
- 압축 도구: `gltf-pipeline` 최신 안정 버전
- 압축 레벨: quantization bits — position 14, normal 10, texcoord 12
- 압축 후 목표 파일 크기: LOD0 기준 **5MB 이하**

### PBR Metallic-Roughness
- 머티리얼 모델: `pbrMetallicRoughness` (glTF 2.0 표준)
- Three.js `MeshStandardMaterial` 호환 필수

#### 필수 텍스처 채널 (4종)
| 채널 | 설명 | 컬러 스페이스 |
|------|------|--------------|
| `baseColorTexture` (Albedo) | 기본 색상 | sRGB |
| `normalTexture` | 표면 노멀 | Non-Color (Linear) |
| `metallicRoughnessTexture` | Metallic(B채널) + Roughness(G채널) | Non-Color (Linear) |
| Metallic 단독 값 | 금속성 | — |

#### 선택 텍스처 채널
| 채널 | 설명 | 적용 대상 |
|------|------|-----------|
| `occlusionTexture` | Ambient Occlusion | 전 카테고리 권장 |
| `emissiveTexture` | 발광 (Emissive) | 야광·형광 소재 한정 |

#### 소재별 PBR 값 기준
| 소재 | Roughness | Metallic | 비고 |
|------|-----------|----------|------|
| 면 (Cotton) | 0.85–0.95 | 0.0 | 섬유 노멀맵 필수 |
| 데님 (Denim) | 0.80–0.90 | 0.0 | 위사/경사 패턴 노멀맵 |
| 가죽 (Leather) | 0.30–0.50 | 0.0 | Specular 강조 |
| 니트 (Knit) | 0.90–0.98 | 0.0 | 루프 패턴 노멀맵 |
| 실크 (Silk) | 0.10–0.25 | 0.0 | Anisotropic 방향성 |
| 금속 지퍼/버튼 | 0.20–0.40 | 1.0 | — |

---

## 2. 에셋 명명 규칙

### 파일명 패턴
```
{BRAND}_{CATEGORY}_{ITEM}_{COLOR}_{LOD}.glb
```

### 필드 정의
| 필드 | 예시 | 규칙 |
|------|------|------|
| BRAND | `MUSINSA`, `NIKE`, `TOPTEN` | 영문 대문자, 특수문자 금지 |
| CATEGORY | `TOP`, `BOTTOM`, `OUTER`, `DRESS`, `SHOES`, `ACC` | 정해진 코드만 사용 |
| ITEM | `TSHIRT`, `HOODIE`, `PANTS`, `COAT` | 영문 대문자, 공백 금지 |
| COLOR | `BLACK`, `WHITE`, `NAVY`, `BEIGE` | 영문 대문자 색상명 |
| LOD | `LOD0`, `LOD1`, `LOD2` | 반드시 명시 |

**예시**: `NIKE_TOP_HOODIE_BLACK_LOD0.glb`

### 금지 패턴
- 공백, 한글, 특수문자 (`!@#$%^&*()`)
- 대소문자 혼용 (모두 대문자 사용)
- LOD 표기 누락

### kebab-case 적용 범위 (에셋 내부 식별자)
GLB 파일 내부 노드명, 메쉬명, 머티리얼명은 kebab-case 사용:

```
노드명:    hoodie-body, pants-leg-left, coat-lapel
메쉬명:    mesh-hoodie-body, mesh-pants-waistband
머티리얼명: mat-hoodie-body, mat-pants-denim, mat-zipper-metal
```

### S3 저장 경로
```
assets/clothing/{item_id}.glb          # 단일 에셋 (LOD0 기본)
assets/clothing/{item_id}/lod0.glb
assets/clothing/{item_id}/lod1.glb
assets/clothing/{item_id}/lod2.glb
assets/clothing/{item_id}/metadata.json
```

---

## 3. 리깅 스펙

### 본 구조: SMPL 24 Joints
의류 리깅은 반드시 SMPL 24 joints 본 구조를 기준으로 스키닝:

| Index | Joint 이름 | 부위 |
|-------|-----------|------|
| 0 | Pelvis | 골반 |
| 1 | L_Hip | 왼쪽 엉덩이 |
| 2 | R_Hip | 오른쪽 엉덩이 |
| 3 | Spine1 | 척추 하부 |
| 4 | L_Knee | 왼쪽 무릎 |
| 5 | R_Knee | 오른쪽 무릎 |
| 6 | Spine2 | 척추 중부 |
| 7 | L_Ankle | 왼쪽 발목 |
| 8 | R_Ankle | 오른쪽 발목 |
| 9 | Spine3 | 척추 상부 |
| 10 | L_Foot | 왼쪽 발 |
| 11 | R_Foot | 오른쪽 발 |
| 12 | Neck | 목 |
| 13 | L_Collar | 왼쪽 쇄골 |
| 14 | R_Collar | 오른쪽 쇄골 |
| 15 | Head | 머리 |
| 16 | L_Shoulder | 왼쪽 어깨 |
| 17 | R_Shoulder | 오른쪽 어깨 |
| 18 | L_Elbow | 왼쪽 팔꿈치 |
| 19 | R_Elbow | 오른쪽 오른쪽 팔꿈치 |
| 20 | L_Wrist | 왼쪽 손목 |
| 21 | R_Wrist | 오른쪽 손목 |
| 22 | L_Hand | 왼쪽 손 |
| 23 | R_Hand | 오른쪽 손 |

### 기본 포즈: A-Pose
- 납품 기본 포즈는 **A-Pose** (양팔을 약 45° 내려 벌린 자세)
- T-Pose 납품 시 AI팀과 사전 협의 필요
- 아바타 기준 신장: 1.70m (미터 단위)

### 좌표계
- **Y-up 좌표계** (glTF 2.0 표준)
- 원점(0, 0, 0): 아바타 발바닥 중심
- 스케일 단위: **미터(m)**

### Weight Paint 규칙
- 각 버텍스의 모든 Weight 합계 = **1.0** (normalized)
- 보조 본(Auxiliary Bone) 추가 시 AI팀 사전 협의 필수

---

## 4. 품질 기준

### 폴리곤 수 기준

| 카테고리 | LOD0 (최대) | LOD1 | LOD2 |
|----------|------------|------|------|
| 의류 (일반) | 50,000 | LOD0의 50% | LOD0의 20% 이하 |
| 아바타 | 100,000 | LOD0의 50% | LOD0의 20% 이하 |
| 원피스/세트 | 70,000 | LOD0의 50% | LOD0의 20% 이하 |

> 참고: 3D 에셋 규격서(references/3d/asset-specs.md)의 아바타 LOD0 기준은 30,000이나,
> AI 피팅 파이프라인의 아바타 메쉬는 SMPL-X 생성 기준 100,000 이하를 목표로 함.

### 텍스처 해상도
- **최소**: 1024 × 1024px
- **최대**: 2048 × 2048px
- POT(Power of Two) 해상도만 허용: 1024, 2048
- 웹 압축: KTX2/Basis 선호

### 파일 크기
| LOD | 최대 크기 |
|-----|----------|
| LOD0 | 5MB (Draco 압축 후) |
| LOD1 | 2MB |
| LOD2 | 500KB |

### 메쉬 품질 기준
- N-Gon 없음 (Tri 또는 Quad만 허용)
- UV 겹침(Overlap) 없음, 단일 UV 채널
- non-manifold 엣지 0개
- 고립 정점(Isolated Vertex) 0개
- Trimesh watertight 검증 통과

### Three.js 호환성
- `GLTFLoader`로 로드 오류 없음
- `MeshStandardMaterial` 기준 정상 렌더링
- Draco Extension(`KHR_draco_mesh_compression`) 포함 필수

---

## 5. 검수 프로세스

```
브랜드 업로드
    → validate_name.sh   (파일명 규칙 검사)
    → validate_size.sh   (파일 크기 검사)
    → validate_manifest.sh (메타데이터 검사)
    → 수동 최종 확인
    → assets/ 등록
```

### 자동 검수 항목
- [ ] 파일명 패턴 준수
- [ ] 파일 크기 기준 충족
- [ ] LOD 3단계 파일 모두 존재
- [ ] Albedo/Normal/Roughness/Metallic 4종 텍스처 임베드 확인
- [ ] SMPL 24 joints 본 매핑 확인
- [ ] Weight Paint 합계 = 1.0

---

## 6. 협업 인터페이스

### AI팀 → 3D팀 (리깅 스펙 변경 요청)
- Jira 티켓으로 스펙 정의 후 3D팀 구현
- 보조 본 추가는 AI팀 선승인 필수

### 3D팀 → AI팀 (에셋 납품)
- S3 경로 + `item_id` Jira 코멘트로 전달
- 납품 즉시 AI팀 검증: Trimesh watertight, SMPL-X 조인트 바인딩, PBR 4채널

### 3D팀 → FE팀
- Draco Extension 포함 GLB만 납품
- 머티리얼명: `mat-{item}-{part}` 형식
