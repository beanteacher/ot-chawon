# 옷차원 3D 에셋 규격 및 파이프라인

## 책임 범위

### 의류 3D 모델 제작
- 브랜드 파트너가 제공하는 실물 의류 사진(정면/측면/후면/디테일)을 레퍼런스로 Blender에서 3D 모델 제작
- 카테고리: 상의(티셔츠·셔츠·후드·자켓), 하의(팬츠·숏츠·스커트), 아우터(코트·패딩·블레이저), 원피스/세트, 신발, 액세서리
- 납품 포맷은 반드시 **GLB** (glTF Binary)

### 아바타 베이스 모델
- AI팀이 사용하는 **SMPL / SMPL-X** 포맷과 호환되는 기본 아바타 제작
- 체형 변형 모프(Blend Shape): 키, 체중, 가슴둘레, 허리둘레, 힙둘레 최소 5종
- 성별 구분: 남성형·여성형·중성형 베이스 각 1종 유지

### 의류 리깅
- **SMPL 24 joints** 본 구조에 맞춰 의류 스키닝 및 리깅 작업
- AI 피팅 시뮬레이션(물리 기반 천 시뮬레이션 포함)을 위해 Weight Paint 정밀 조정
- 원피스·코트 등 긴 실루엣의 경우 추가 보조 본(Auxiliary Bone) 허용 — AI팀과 사전 협의 필수

### PBR 텍스처 제작 (Substance Painter)

| 소재 | Roughness | Metallic | 특이사항 |
|------|-----------|----------|---------|
| 면 (Cotton) | 0.85–0.95 | 0.0 | 섬유 노멀맵 필수 |
| 데님 (Denim) | 0.80–0.90 | 0.0 | 위사/경사 패턴 노멀맵 |
| 가죽 (Leather) | 0.30–0.50 | 0.0 | Specular 강조 |
| 니트 (Knit) | 0.90–0.98 | 0.0 | 루프 패턴 노멀맵 |
| 실크 (Silk) | 0.10–0.25 | 0.0 | Anisotropic 방향성 |
| 금속 지퍼/버튼 | 0.20–0.40 | 1.0 | — |

필수 텍스처 맵: **Albedo + Normal + Roughness + Metallic** (최소 4종)
선택 텍스처 맵: Ambient Occlusion, Emissive (야광·형광 소재 한정)

### 웹 최적화
- **LOD 3단계** 구성:
  - LOD0 (근거리): 의류 50K 이하 / 아바타 30K 이하
  - LOD1 (중거리): LOD0 대비 50% 감면
  - LOD2 (원거리/썸네일): LOD0 대비 20% 이하
- Blender → **Draco 압축** 적용 후 GLB export (`gltf-pipeline` 사용)
- GLB 파일 크기 목표: **5MB 이하** (Draco 적용 후, LOD0 기준)
- 텍스처 해상도: 최대 2048 × 2048px, 웹용 압축은 **KTX2/Basis** 선호

---

## 에셋 표준 규격

| 항목 | 기준값 |
|------|--------|
| 의류 모델 폴리곤 | 최대 50,000 (LOD0) |
| 아바타 모델 폴리곤 | 최대 30,000 (LOD0) |
| GLB 파일 크기 | 5MB 이하 (Draco 압축 후, LOD0) |
| 텍스처 해상도 | 최대 2048 × 2048px |
| 필수 텍스처 맵 | Albedo, Normal, Roughness, Metallic |
| 리깅 본 구조 | SMPL 24 joints 호환 |
| 파일 포맷 | .glb (glTF 2.0) |
| 컬러 스페이스 | Linear (렌더링), sRGB (Albedo 텍스처) |
| 스케일 단위 | 미터(m) 기준, 성인 신장 1.70m 기준 |
| UV 타일링 | UDIM 불가, 단일 UV 채널 사용 |

---

## 카테고리별 제작 가이드

### 상의 (티셔츠·셔츠·후드·자켓)
- 기본 착장 포즈: T-Pose (양팔 수평, SMPL 기준)
- 칼라·소매·밑단은 별도 엣지 루프로 두께 표현 (두께 최소 2mm 이상)
- 단추·지퍼는 LOD0에서만 별도 메쉬 허용, LOD1 이후 텍스처 베이크 처리
- 리깅 핵심 본: `Spine`, `Spine1`, `Spine2`, `LeftShoulder`, `RightShoulder`, `LeftArm`, `RightArm`, `LeftForeArm`, `RightForeArm`
- 패턴 의류(체크·스트라이프)는 Albedo 텍스처에 패턴 포함, Normal은 소재 질감만 표현

### 하의 (팬츠·숏츠·스커트)
- 팬츠: 인심(Inseam) 라인 엣지 루프 명확히 구분
- 스커트: 플리츠·플레어 형태는 실루엣 폴리곤 수 예외 허용 (최대 +10K)
- 허리밴드·벨트 루프는 별도 메쉬 또는 노멀맵 처리 선택
- 리깅 핵심 본: `Hips`, `LeftUpLeg`, `RightUpLeg`, `LeftLeg`, `RightLeg`
- 스커트의 경우 보조 본 `SkirtFront`, `SkirtBack`, `SkirtLeft`, `SkirtRight` AI팀 협의 후 추가 가능

### 아우터 (코트·패딩·블레이저)
- 상의와 동일한 T-Pose 기준
- 패딩: 충전재 부피감은 메쉬 두께로 표현 (노멀맵 과의존 금지)
- 코트·블레이저: 라펠(Lapel), 포켓 플랩은 LOD0 전용 메쉬, LOD1 이후 베이크
- 리깅: 상의 핵심 본 전체 + 긴 코트의 경우 하단 플랩용 보조 본 추가 (AI팀 협의 필수)

### 원피스 / 세트
- 상의 + 하의 규격을 각각 적용하되, 단일 메쉬로 합산 폴리곤 최대 **70K** 허용
- 세트 상품은 상의·하의 개별 GLB + 합본 GLB 총 3파일 납품

---

## 브랜드 파트너 에셋 업로드 가이드

### 업로드 포맷
허용 포맷: `.glb`, `.fbx`, `.obj` (OBJ는 MTL + 텍스처 ZIP 동봉)
권장 포맷: `.glb` (glTF 2.0, Draco 압축 적용)

### 네이밍 규칙

```
{BRAND}_{CATEGORY}_{ITEM}_{COLOR}_{LOD}.glb
```

| 필드 | 예시 | 규칙 |
|------|------|------|
| BRAND | `MUSINSA`, `NIKE`, `TOPTEN` | 영문 대문자, 특수문자 금지 |
| CATEGORY | `TOP`, `BOTTOM`, `OUTER`, `DRESS`, `SHOES`, `ACC` | 정해진 코드만 사용 |
| ITEM | `TSHIRT`, `HOODIE`, `PANTS`, `COAT` | 영문 대문자, 공백 금지 |
| COLOR | `BLACK`, `WHITE`, `NAVY`, `BEIGE` | 영문 대문자 색상명 |
| LOD | `LOD0`, `LOD1`, `LOD2` | 반드시 명시 |

예시: `NIKE_TOP_HOODIE_BLACK_LOD0.glb`

### 자동 검수 파이프라인

```
브랜드 업로드 → validate_name.sh → validate_size.sh → validate_manifest.sh → 수동 최종 확인 → assets/ 등록
```

**파일명 금지 패턴**: 공백, 한글, 특수문자(`!@#$%^&*()`), 대소문자 혼용 (모두 대문자 사용)

---

## QA 체크리스트 (납품 전 검수)

### 파일 규격
- [ ] 파일 포맷: `.glb` (glTF 2.0)
- [ ] 파일 크기: LOD0 5MB 이하, LOD1 2MB 이하, LOD2 500KB 이하
- [ ] 네이밍 규칙 준수
- [ ] LOD 3단계 파일 모두 존재 (LOD0/LOD1/LOD2)

### 메쉬 품질
- [ ] 폴리곤 수: 의류 LOD0 50K 이하, 아바타 30K 이하
- [ ] N-Gon 없음 (Tri 또는 Quad만 허용)
- [ ] 스케일 단위: 미터(m), 원점 기준 정렬
- [ ] UV 언랩: 겹침(Overlap) 없음, 단일 채널

### 텍스처
- [ ] Albedo, Normal, Roughness, Metallic 4종 첨부
- [ ] 텍스처 해상도: 2048px 이하 (POT: 512/1024/2048)
- [ ] 컬러 스페이스: Albedo는 sRGB, 나머지는 Non-Color
- [ ] 텍스처 파일이 GLB 내부에 임베드(embed)되어 있음

### 리깅 (의류 모델)
- [ ] SMPL 24 joints 본 구조와 매핑 확인
- [ ] Weight Paint 합계: 각 버텍스의 Weight 합 = 1.0
- [ ] 아바타 LOD0 착장 시 클리핑(Clipping) 없음
- [ ] A-Pose / T-Pose 전환 시 버텍스 파열 없음

### Three.js 렌더러 호환
- [ ] Three.js `GLTFLoader`로 로드 오류 없음
- [ ] 머티리얼: `MeshStandardMaterial` 기준 정상 렌더링
- [ ] 애니메이션(있는 경우): Three.js `AnimationMixer` 정상 동작
- [ ] 모바일 WebGL 환경(iPhone 12 기준) 렌더링 성능 확인

---

## 에셋 폴더 구조

```
ot-chawon-3d_graphics_designer/
├── assets/
│   ├── clothing/{top,bottom,outer,dress,shoes,acc}/
│   ├── avatar/{base,morphs}/
│   └── brand/{BRAND}/{CATEGORY}/{ITEM}_{COLOR}_{LOD}.glb
├── checklists/
├── docs/{brand-partner-guide,rigging-spec,texture-spec}.md
├── scripts/{validate_all,validate_manifest,validate_name,validate_size}.sh
└── manifest-v0.csv
```

---

## 협업 규칙

### AI팀 — 리깅 스펙 협의
- 공유 문서: `docs/rigging-spec.md`
- 아바타 본 구조 변경 시 AI팀 선승인 필수
- SMPL 24 joints 외 보조 본 추가 요청은 AI팀이 Jira 티켓으로 스펙 정의 → 3D팀 구현
- 납품: `assets/clothing/{CATEGORY}/{파일}.glb` → AI팀 SMPL 피팅 파이프라인 입력

### FE팀 — Three.js 호환
- Three.js `GLTFLoader` 호환 GLB만 납품 (Draco Extension 포함)
- 머티리얼 명칭: `mat_{ITEM}_{PART}` 형식 (예: `mat_hoodie_body`)
- Three.js 머티리얼 매핑: `MeshStandardMaterial { map: Albedo, normalMap, roughnessMap, metalnessMap }`

### BE팀 — 에셋 저장 API
- GLB 파일 업로드: `/api/v1/assets/upload`
- 파일 크기 5MB 초과 에셋은 BE팀 협의 필수

---

## Jira / Slack 운영

### Jira 이슈 구조

| 이슈 유형 | 네이밍 예시 |
|-----------|------------|
| Epic | `[3D] 상의 카테고리 에셋 제작` |
| Story | `[3D] NIKE_TOP_HOODIE_BLACK GLB 납품` |
| Task | `[3D] SMPL 리깅 Weight 수정 — 후드 어깨 클리핑` |
| Bug | `[3D] TOPTEN_OUTER_COAT_BEIGE_LOD0 파일 크기 초과` |

### Slack 채널

| 채널 | 용도 |
|------|------|
| `#3d-asset-review` | 자동 검수 결과 알림 |
| `#3d-ai-sync` | AI팀 리깅 스펙 협의 |
| `#fe-3d-asset` | FE팀 에셋 납품 공지 |
| `#asset-release` | CDN URL 발급 후 전팀 공유 |

---

## 주의사항

- 브랜드 파트너 레퍼런스 사진·소스 파일은 옷차원 플랫폼 전용으로만 사용
- Blender 소스 파일(`.blend`)은 Git 추적 제외, 별도 내부 스토리지 보관
- 폴리곤 예산 초과 에셋은 어떠한 이유로도 LOD0 납품 불가 — 반드시 최적화 후 재납품
- 리깅 스펙 변경(본 추가·삭제·이름 변경)은 AI팀·FE팀 동시 공지 필수
- 도구 버전 고정: Blender 3.6 LTS, Substance Painter 9.x, gltf-pipeline 최신 안정 버전
