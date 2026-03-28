/**
 * 옷차원 3D GLB 에셋 생성 스크립트
 * @gltf-transform/core + @gltf-transform/extensions 사용
 *
 * 생성 대상:
 *   - MUSINSA_TOP_TSHIRT_BLACK_LOD0.glb  (코튼 티셔츠)
 *   - MUSINSA_BOTTOM_PANTS_NAVY_LOD0.glb (데님 팬츠)
 *   - MUSINSA_OUTER_COAT_BEIGE_LOD0.glb  (울 코트)
 */

import { Document, NodeIO, Primitive } from '@gltf-transform/core';
import { KHRMaterialsUnlit } from '@gltf-transform/extensions';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── 헬퍼: Float32Array로 Box geometry 생성 ───────────────────────────────────
// glTF 2.0 Y-up 좌표계, 미터 단위
function createBoxGeometry(width, height, depth) {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  // 24 vertices (6면 × 4꼭짓점), Tri-list
  const positions = new Float32Array([
    // +Y (top)
    -hw, hh, -hd,   hw, hh, -hd,   hw, hh,  hd,  -hw, hh,  hd,
    // -Y (bottom)
    -hw,-hh,  hd,   hw,-hh,  hd,   hw,-hh, -hd,  -hw,-hh, -hd,
    // +Z (front)
    -hw,-hh,  hd,  -hw, hh,  hd,   hw, hh,  hd,   hw,-hh,  hd,
    // -Z (back)
     hw,-hh, -hd,   hw, hh, -hd,  -hw, hh, -hd,  -hw,-hh, -hd,
    // -X (left)
    -hw,-hh, -hd,  -hw, hh, -hd,  -hw, hh,  hd,  -hw,-hh,  hd,
    // +X (right)
     hw,-hh,  hd,   hw, hh,  hd,   hw, hh, -hd,   hw,-hh, -hd,
  ]);

  const normals = new Float32Array([
     0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
     0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
     0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
     0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
     1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
  ]);

  const uvs = new Float32Array([
    0,1, 1,1, 1,0, 0,0,
    0,1, 1,1, 1,0, 0,0,
    0,1, 0,0, 1,0, 1,1,
    0,1, 0,0, 1,0, 1,1,
    0,1, 0,0, 1,0, 1,1,
    0,1, 0,0, 1,0, 1,1,
  ]);

  // 6면 × 2삼각형 = 36 indices
  const indices = new Uint16Array(36);
  for (let f = 0; f < 6; f++) {
    const b = f * 6;
    const v = f * 4;
    indices[b+0] = v+0; indices[b+1] = v+1; indices[b+2] = v+2;
    indices[b+3] = v+0; indices[b+4] = v+2; indices[b+5] = v+3;
  }

  return { positions, normals, uvs, indices };
}

// ─── 헬퍼: Cylinder geometry (코트 몸통용) ────────────────────────────────────
function createCylinderGeometry(radiusTop, radiusBottom, height, segments = 16) {
  const posArr = [];
  const normArr = [];
  const uvArr = [];
  const idxArr = [];

  const hh = height / 2;

  // 측면
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const rt = radiusTop;
    const rb = radiusBottom;

    posArr.push(rt * cosT, hh, rt * sinT);
    posArr.push(rb * cosT, -hh, rb * sinT);

    const slope = (rb - rt) / height;
    const ny = -slope / Math.sqrt(1 + slope * slope);
    const nr = 1 / Math.sqrt(1 + slope * slope);
    normArr.push(nr * cosT, ny, nr * sinT);
    normArr.push(nr * cosT, ny, nr * sinT);

    uvArr.push(i / segments, 1);
    uvArr.push(i / segments, 0);
  }

  for (let i = 0; i < segments; i++) {
    const b = i * 2;
    idxArr.push(b, b+1, b+2, b+1, b+3, b+2);
  }

  return {
    positions: new Float32Array(posArr),
    normals: new Float32Array(normArr),
    uvs: new Float32Array(uvArr),
    indices: new Uint16Array(idxArr),
  };
}

// ─── 헬퍼: GLB 문서 생성 ─────────────────────────────────────────────────────
function buildGlbDocument(opts) {
  const {
    meshName,
    nodeName,
    materialName,
    baseColor,       // [r, g, b, a]
    roughness,
    metallic,
    geometry,        // { positions, normals, uvs, indices }
  } = opts;

  const doc = new Document();
  const buf = doc.createBuffer();

  const posAcc = doc.createAccessor()
    .setBuffer(buf)
    .setType('VEC3')
    .setArray(geometry.positions);

  const normAcc = doc.createAccessor()
    .setBuffer(buf)
    .setType('VEC3')
    .setArray(geometry.normals);

  const uvAcc = doc.createAccessor()
    .setBuffer(buf)
    .setType('VEC2')
    .setArray(geometry.uvs);

  const idxAcc = doc.createAccessor()
    .setBuffer(buf)
    .setType('SCALAR')
    .setArray(geometry.indices);

  const mat = doc.createMaterial(materialName)
    .setBaseColorFactor(baseColor)
    .setRoughnessFactor(roughness)
    .setMetallicFactor(metallic)
    .setDoubleSided(false);

  const prim = doc.createPrimitive()
    .setMode(Primitive.Mode.TRIANGLES)
    .setAttribute('POSITION', posAcc)
    .setAttribute('NORMAL', normAcc)
    .setAttribute('TEXCOORD_0', uvAcc)
    .setIndices(idxAcc)
    .setMaterial(mat);

  const mesh = doc.createMesh(meshName).addPrimitive(prim);
  const node = doc.createNode(nodeName).setMesh(mesh);

  doc.createScene().addChild(node);

  return doc;
}

// ─── 에셋 정의 ───────────────────────────────────────────────────────────────
const ASSETS = [
  {
    filename: 'MUSINSA_TOP_TSHIRT_BLACK_LOD0.glb',
    destDirs: [
      'assets/brand/MUSINSA/TOP',
      'assets/clothing/top',
    ],
    meshName: 'mesh-tshirt-body',
    nodeName: 'tshirt-body',
    materialName: 'mat-tshirt-body',
    // 검정 코튼 티셔츠: roughness 0.90, metallic 0.0
    baseColor: [0.02, 0.02, 0.02, 1.0],
    roughness: 0.90,
    metallic: 0.0,
    geometry: () => {
      // 티셔츠: 넓은 박스 (폭 0.52m, 높이 0.70m, 두께 0.08m)
      return createBoxGeometry(0.52, 0.70, 0.08);
    },
  },
  {
    filename: 'MUSINSA_BOTTOM_PANTS_NAVY_LOD0.glb',
    destDirs: [
      'assets/brand/MUSINSA/BOTTOM',
      'assets/clothing/bottom',
    ],
    meshName: 'mesh-pants-body',
    nodeName: 'pants-body',
    materialName: 'mat-pants-denim',
    // 네이비 데님 팬츠: roughness 0.85, metallic 0.0
    baseColor: [0.03, 0.07, 0.22, 1.0],
    roughness: 0.85,
    metallic: 0.0,
    geometry: () => {
      // 팬츠: 세로로 긴 박스 (폭 0.40m, 높이 1.00m, 두께 0.12m)
      return createBoxGeometry(0.40, 1.00, 0.12);
    },
  },
  {
    filename: 'MUSINSA_OUTER_COAT_BEIGE_LOD0.glb',
    destDirs: [
      'assets/brand/MUSINSA/OUTER',
      'assets/clothing/outer',
    ],
    meshName: 'mesh-coat-body',
    nodeName: 'coat-body',
    materialName: 'mat-coat-wool',
    // 베이지 울 코트: roughness 0.80, metallic 0.0
    baseColor: [0.76, 0.65, 0.50, 1.0],
    roughness: 0.80,
    metallic: 0.0,
    geometry: () => {
      // 코트: 약간 넓은 실린더 형태 (상단 0.30m, 하단 0.32m, 높이 1.10m)
      return createCylinderGeometry(0.30, 0.32, 1.10, 16);
    },
  },
];

// ─── 메인 실행 ───────────────────────────────────────────────────────────────
async function main() {
  const io = new NodeIO();

  const manifestRows = [];
  const manifestHeader = 'asset_id,filename,category,item_type,color,lod,polygon_count,file_size_bytes,texture_maps,draco_compressed,status';

  for (const asset of ASSETS) {
    console.log(`\n생성 중: ${asset.filename}`);

    const geo = asset.geometry();
    const triCount = geo.indices.length / 3;

    const doc = buildGlbDocument({
      meshName: asset.meshName,
      nodeName: asset.nodeName,
      materialName: asset.materialName,
      baseColor: asset.baseColor,
      roughness: asset.roughness,
      metallic: asset.metallic,
      geometry: geo,
    });

    // GLB 바이너리 직렬화
    const glbBuffer = await io.writeBinary(doc);

    // 모든 목적지 디렉터리에 저장
    for (const relDir of asset.destDirs) {
      const outDir = path.join(ROOT, relDir);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, asset.filename);
      fs.writeFileSync(outPath, glbBuffer);
      console.log(`  저장: ${outPath} (${glbBuffer.byteLength} bytes)`);
    }

    // manifest 행 수집 (첫 번째 destDir 기준)
    const parts = asset.filename.replace('.glb', '').split('_');
    const brand = parts[0];
    const category = parts[1];
    const itemType = parts[2];
    const color = parts[3];
    const lod = parts[4];
    const assetId = `${brand}_${category}_${itemType}_${color}_${lod}`.toLowerCase();
    const firstOutPath = path.join(ROOT, asset.destDirs[0], asset.filename);
    const fileSizeBytes = fs.statSync(firstOutPath).size;

    manifestRows.push([
      assetId,
      asset.filename,
      category,
      itemType,
      color,
      lod,
      triCount * 2, // triangle → polygon (tri = polygon here)
      fileSizeBytes,
      'Albedo',     // 텍스처맵: 프로그래매틱 생성이므로 baseColorFactor 사용
      'false',      // Draco: validate/compress 단계에서 적용
      'ready',
    ].join(','));
  }

  // manifest-v0.csv 작성
  const csvPath = path.join(ROOT, 'manifest-v0.csv');
  fs.writeFileSync(csvPath, [manifestHeader, ...manifestRows].join('\n') + '\n');
  console.log(`\nmanifest-v0.csv 작성 완료: ${csvPath}`);

  console.log('\n모든 GLB 생성 완료.');
}

main().catch(err => {
  console.error('GLB 생성 실패:', err);
  process.exit(1);
});
