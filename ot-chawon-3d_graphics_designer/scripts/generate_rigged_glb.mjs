/**
 * 옷차원 3D 리깅 GLB 에셋 생성 스크립트
 * SMPL 24 joints 스켈레톤 리깅 포함
 *
 * 생성 대상:
 *   - MUSINSA_TOP_TSHIRT_BLACK_RIGGED.glb  (코튼 티셔츠)
 *   - MUSINSA_BOTTOM_PANTS_NAVY_RIGGED.glb (데님 팬츠)
 *   - MUSINSA_OUTER_COAT_BEIGE_RIGGED.glb  (울 코트)
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── SMPL 24 Joints 정의 ─────────────────────────────────────────────────────
// Y-up 좌표계, 미터 단위 (T-pose 기준 위치)
const SMPL_JOINTS = [
  { idx: 0,  name: 'Pelvis',      parent: -1, pos: [0.0,  0.92, 0.0] },
  { idx: 1,  name: 'L_Hip',       parent:  0, pos: [-0.09, 0.92, 0.0] },
  { idx: 2,  name: 'R_Hip',       parent:  0, pos: [ 0.09, 0.92, 0.0] },
  { idx: 3,  name: 'Spine1',      parent:  0, pos: [0.0,  1.00, 0.0] },
  { idx: 4,  name: 'L_Knee',      parent:  1, pos: [-0.09, 0.52, 0.0] },
  { idx: 5,  name: 'R_Knee',      parent:  2, pos: [ 0.09, 0.52, 0.0] },
  { idx: 6,  name: 'Spine2',      parent:  3, pos: [0.0,  1.10, 0.0] },
  { idx: 7,  name: 'L_Ankle',     parent:  4, pos: [-0.09, 0.10, 0.0] },
  { idx: 8,  name: 'R_Ankle',     parent:  5, pos: [ 0.09, 0.10, 0.0] },
  { idx: 9,  name: 'Spine3',      parent:  6, pos: [0.0,  1.30, 0.0] },
  { idx: 10, name: 'L_Foot',      parent:  7, pos: [-0.09, 0.02, 0.06] },
  { idx: 11, name: 'R_Foot',      parent:  8, pos: [ 0.09, 0.02, 0.06] },
  { idx: 12, name: 'Neck',        parent:  9, pos: [0.0,  1.50, 0.0] },
  { idx: 13, name: 'L_Collar',    parent:  9, pos: [-0.08, 1.42, 0.0] },
  { idx: 14, name: 'R_Collar',    parent:  9, pos: [ 0.08, 1.42, 0.0] },
  { idx: 15, name: 'Head',        parent: 12, pos: [0.0,  1.65, 0.0] },
  { idx: 16, name: 'L_Shoulder',  parent: 13, pos: [-0.18, 1.42, 0.0] },
  { idx: 17, name: 'R_Shoulder',  parent: 14, pos: [ 0.18, 1.42, 0.0] },
  { idx: 18, name: 'L_Elbow',     parent: 16, pos: [-0.38, 1.22, 0.0] },
  { idx: 19, name: 'R_Elbow',     parent: 17, pos: [ 0.38, 1.22, 0.0] },
  { idx: 20, name: 'L_Wrist',     parent: 18, pos: [-0.56, 1.02, 0.0] },
  { idx: 21, name: 'R_Wrist',     parent: 19, pos: [ 0.56, 1.02, 0.0] },
  { idx: 22, name: 'L_Hand',      parent: 20, pos: [-0.63, 0.95, 0.0] },
  { idx: 23, name: 'R_Hand',      parent: 21, pos: [ 0.63, 0.95, 0.0] },
];

// ─── 의류 카테고리별 영향 Joint 정의 ─────────────────────────────────────────
const CLOTHING_JOINT_INFLUENCE = {
  TOP: [0, 1, 2, 3, 6, 9, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23],
  BOTTOM: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
  OUTER: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23],
};

// ─── 헬퍼: Box geometry 생성 ──────────────────────────────────────────────────
function createBoxGeometry(width, height, depth) {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

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

  const indices = new Uint16Array(36);
  for (let f = 0; f < 6; f++) {
    const b = f * 6;
    const v = f * 4;
    indices[b+0] = v+0; indices[b+1] = v+1; indices[b+2] = v+2;
    indices[b+3] = v+0; indices[b+4] = v+2; indices[b+5] = v+3;
  }

  return { positions, normals, uvs, indices };
}

// ─── 헬퍼: Cylinder geometry 생성 ────────────────────────────────────────────
function createCylinderGeometry(radiusTop, radiusBottom, height, segments = 16) {
  const posArr = [];
  const normArr = [];
  const uvArr = [];
  const idxArr = [];
  const hh = height / 2;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);

    posArr.push(radiusTop * cosT, hh, radiusTop * sinT);
    posArr.push(radiusBottom * cosT, -hh, radiusBottom * sinT);

    const slope = (radiusBottom - radiusTop) / height;
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

// ─── 헬퍼: Vertex별 joint weight 계산 ────────────────────────────────────────
// 각 vertex 위치를 기반으로 가장 가까운 joint에 weight 할당 (최대 4 joints)
function computeVertexWeights(positions, activeJointIndices) {
  const vertexCount = positions.length / 3;
  const joints0 = new Uint8Array(vertexCount * 4);
  const weights0 = new Float32Array(vertexCount * 4);

  const activeJoints = activeJointIndices.map(i => SMPL_JOINTS[i]);

  for (let v = 0; v < vertexCount; v++) {
    const vx = positions[v * 3];
    const vy = positions[v * 3 + 1];
    const vz = positions[v * 3 + 2];

    // 각 active joint까지의 거리 계산
    const distances = activeJoints.map((j, localIdx) => {
      const dx = vx - j.pos[0];
      const dy = vy - j.pos[1];
      const dz = vz - j.pos[2];
      return { localIdx, globalIdx: j.idx, dist: Math.sqrt(dx*dx + dy*dy + dz*dz) };
    });

    // 거리 기준 오름차순 정렬, 상위 4개 선택
    distances.sort((a, b) => a.dist - b.dist);
    const top4 = distances.slice(0, 4);

    // inverse distance weighting (IDW)
    const eps = 1e-6;
    const invDists = top4.map(d => 1.0 / (d.dist + eps));
    const totalInv = invDists.reduce((s, v) => s + v, 0);

    for (let k = 0; k < 4; k++) {
      joints0[v * 4 + k] = top4[k] ? top4[k].globalIdx : 0;
      weights0[v * 4 + k] = top4[k] ? invDists[k] / totalInv : 0.0;
    }
  }

  return { joints0, weights0 };
}

// ─── 헬퍼: 4x4 identity matrix (column-major) ────────────────────────────────
function identityMatrix4x4() {
  return new Float32Array([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
  ]);
}

// ─── 메인: GLB 바이너리 수동 구성 ────────────────────────────────────────────
// glTF 2.0 스펙에 따라 skin + joints + weights 포함 GLB 직접 생성

function buildRiggedGLB(opts) {
  const {
    meshName,
    nodeName,
    materialName,
    baseColor,
    roughness,
    metallic,
    geometry,
    clothingCategory, // 'TOP' | 'BOTTOM' | 'OUTER'
  } = opts;

  const { positions, normals, uvs, indices } = geometry;
  const vertexCount = positions.length / 3;
  const activeJointIndices = CLOTHING_JOINT_INFLUENCE[clothingCategory];
  const { joints0, weights0 } = computeVertexWeights(positions, activeJointIndices);

  // ─── JSON 구조 구성 ─────────────────────────────────────────────────────────
  // Nodes: skeleton joints (24개) + mesh node
  const jointNodeIndices = SMPL_JOINTS.map(j => j.idx); // 0..23
  const meshNodeIndex = 24;

  const nodes = SMPL_JOINTS.map(j => {
    const node = {
      name: j.name,
      translation: j.pos,
    };
    const children = SMPL_JOINTS.filter(c => c.parent === j.idx).map(c => c.idx);
    if (children.length > 0) {
      node.children = children;
    }
    return node;
  });

  // Mesh node
  nodes.push({
    name: nodeName,
    mesh: 0,
    skin: 0,
  });

  // Scene: root joints + mesh node
  // Pelvis(0)는 최상위, mesh node도 scene에 추가
  const sceneNodes = [0, meshNodeIndex];

  // ─── Accessor 데이터 버퍼 준비 ──────────────────────────────────────────────
  // Inverse bind matrices: 24개 4x4 identity (각 joint의 inverse bind)
  const ibmData = new Float32Array(24 * 16);
  for (let i = 0; i < 24; i++) {
    const mat = identityMatrix4x4();
    ibmData.set(mat, i * 16);
  }

  // ─── Buffer 정렬 및 배치 ────────────────────────────────────────────────────
  function alignedSize(size, align = 4) {
    return Math.ceil(size / align) * align;
  }

  const chunks = [
    { data: positions.buffer,  byteLength: positions.byteLength },  // acc 0: POSITION
    { data: normals.buffer,    byteLength: normals.byteLength },     // acc 1: NORMAL
    { data: uvs.buffer,        byteLength: uvs.byteLength },         // acc 2: TEXCOORD_0
    { data: indices.buffer,    byteLength: indices.byteLength },     // acc 3: indices
    { data: joints0.buffer,    byteLength: joints0.byteLength },     // acc 4: JOINTS_0
    { data: weights0.buffer,   byteLength: weights0.byteLength },    // acc 5: WEIGHTS_0
    { data: ibmData.buffer,    byteLength: ibmData.byteLength },     // acc 6: IBM
  ];

  const offsets = [];
  let totalBytes = 0;
  for (const chunk of chunks) {
    offsets.push(totalBytes);
    totalBytes += alignedSize(chunk.byteLength);
  }

  // ─── glTF JSON 작성 ─────────────────────────────────────────────────────────
  // BufferView 정의
  const bufferViews = [
    { buffer: 0, byteOffset: offsets[0], byteLength: positions.byteLength, target: 34962 }, // ARRAY_BUFFER: POSITION
    { buffer: 0, byteOffset: offsets[1], byteLength: normals.byteLength,   target: 34962 }, // NORMAL
    { buffer: 0, byteOffset: offsets[2], byteLength: uvs.byteLength,       target: 34962 }, // TEXCOORD_0
    { buffer: 0, byteOffset: offsets[3], byteLength: indices.byteLength,   target: 34963 }, // ELEMENT_ARRAY_BUFFER
    { buffer: 0, byteOffset: offsets[4], byteLength: joints0.byteLength,   target: 34962 }, // JOINTS_0
    { buffer: 0, byteOffset: offsets[5], byteLength: weights0.byteLength,  target: 34962 }, // WEIGHTS_0
    { buffer: 0, byteOffset: offsets[6], byteLength: ibmData.byteLength },                  // IBM (no target)
  ];

  // Accessor 최솟값/최댓값 계산 (POSITION 필수)
  let minPos = [Infinity, Infinity, Infinity];
  let maxPos = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < vertexCount; i++) {
    for (let c = 0; c < 3; c++) {
      const v = positions[i * 3 + c];
      if (v < minPos[c]) minPos[c] = v;
      if (v > maxPos[c]) maxPos[c] = v;
    }
  }

  const accessors = [
    { bufferView: 0, byteOffset: 0, componentType: 5126, count: vertexCount, type: 'VEC3', min: minPos, max: maxPos }, // POSITION
    { bufferView: 1, byteOffset: 0, componentType: 5126, count: vertexCount, type: 'VEC3' },  // NORMAL
    { bufferView: 2, byteOffset: 0, componentType: 5126, count: vertexCount, type: 'VEC2' },  // TEXCOORD_0
    { bufferView: 3, byteOffset: 0, componentType: 5123, count: indices.length, type: 'SCALAR' }, // indices (UNSIGNED_SHORT)
    { bufferView: 4, byteOffset: 0, componentType: 5121, count: vertexCount, type: 'VEC4' },  // JOINTS_0 (UNSIGNED_BYTE)
    { bufferView: 5, byteOffset: 0, componentType: 5126, count: vertexCount, type: 'VEC4' },  // WEIGHTS_0 (FLOAT)
    { bufferView: 6, byteOffset: 0, componentType: 5126, count: 24,          type: 'MAT4' },  // IBM
  ];

  const gltf = {
    asset: { version: '2.0', generator: 'ot-chawon-rigged-glb-generator' },
    scene: 0,
    scenes: [{ name: 'Scene', nodes: sceneNodes }],
    nodes,
    meshes: [{
      name: meshName,
      primitives: [{
        attributes: {
          POSITION:   0,
          NORMAL:     1,
          TEXCOORD_0: 2,
          JOINTS_0:   4,
          WEIGHTS_0:  5,
        },
        indices: 3,
        material: 0,
        mode: 4, // TRIANGLES
      }],
    }],
    materials: [{
      name: materialName,
      pbrMetallicRoughness: {
        baseColorFactor: baseColor,
        roughnessFactor: roughness,
        metallicFactor: metallic,
      },
      doubleSided: false,
    }],
    skins: [{
      name: 'SMPL-24',
      inverseBindMatrices: 6,
      joints: jointNodeIndices,
      skeleton: 0,
    }],
    accessors,
    bufferViews,
    buffers: [{ byteLength: totalBytes }],
  };

  const jsonStr = JSON.stringify(gltf);
  // JSON chunk은 4바이트 정렬, 패딩은 0x20 (space)
  const jsonBytes = Buffer.from(jsonStr, 'utf8');
  const jsonPadded = alignedSize(jsonBytes.length);
  const jsonChunkData = Buffer.alloc(jsonPadded, 0x20);
  jsonBytes.copy(jsonChunkData);

  // BIN chunk 조립
  const binBuffer = Buffer.alloc(totalBytes, 0);
  for (let i = 0; i < chunks.length; i++) {
    Buffer.from(chunks[i].data).copy(binBuffer, offsets[i]);
  }
  const binPadded = alignedSize(binBuffer.length);
  const binChunkData = Buffer.alloc(binPadded, 0x00);
  binBuffer.copy(binChunkData);

  // GLB 헤더 + JSON chunk + BIN chunk 조립
  const totalLength = 12 + (8 + jsonPadded) + (8 + binPadded);
  const glb = Buffer.alloc(totalLength);
  let offset = 0;

  // GLB 헤더
  glb.writeUInt32LE(0x46546C67, offset); offset += 4; // magic: 'glTF'
  glb.writeUInt32LE(2, offset); offset += 4;           // version: 2
  glb.writeUInt32LE(totalLength, offset); offset += 4; // total length

  // JSON chunk
  glb.writeUInt32LE(jsonPadded, offset); offset += 4;  // chunk length
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4;  // chunk type: 'JSON'
  jsonChunkData.copy(glb, offset); offset += jsonPadded;

  // BIN chunk
  glb.writeUInt32LE(binPadded, offset); offset += 4;   // chunk length
  glb.writeUInt32LE(0x004E4942, offset); offset += 4;  // chunk type: 'BIN\0'
  binChunkData.copy(glb, offset);

  return glb;
}

// ─── 에셋 정의 ───────────────────────────────────────────────────────────────
const RIGGED_ASSETS = [
  {
    filename: 'MUSINSA_TOP_TSHIRT_BLACK_RIGGED.glb',
    destDirs: ['assets/clothing/top'],
    meshName: 'mesh-tshirt-body-rigged',
    nodeName: 'tshirt-body-rigged',
    materialName: 'mat-tshirt-body',
    baseColor: [0.02, 0.02, 0.02, 1.0],
    roughness: 0.90,
    metallic: 0.0,
    clothingCategory: 'TOP',
    geometry: () => createBoxGeometry(0.52, 0.70, 0.08),
  },
  {
    filename: 'MUSINSA_BOTTOM_PANTS_NAVY_RIGGED.glb',
    destDirs: ['assets/clothing/bottom'],
    meshName: 'mesh-pants-body-rigged',
    nodeName: 'pants-body-rigged',
    materialName: 'mat-pants-denim',
    baseColor: [0.03, 0.07, 0.22, 1.0],
    roughness: 0.85,
    metallic: 0.0,
    clothingCategory: 'BOTTOM',
    geometry: () => createBoxGeometry(0.40, 1.00, 0.12),
  },
  {
    filename: 'MUSINSA_OUTER_COAT_BEIGE_RIGGED.glb',
    destDirs: ['assets/clothing/outer'],
    meshName: 'mesh-coat-body-rigged',
    nodeName: 'coat-body-rigged',
    materialName: 'mat-coat-wool',
    baseColor: [0.76, 0.65, 0.50, 1.0],
    roughness: 0.80,
    metallic: 0.0,
    clothingCategory: 'OUTER',
    geometry: () => {
      // Cylinder geometry (측면만, 약식)
      const radiusTop = 0.30, radiusBottom = 0.32, height = 1.10, segments = 16;
      const posArr = [], normArr = [], uvArr = [], idxArr = [];
      const hh = height / 2;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const sinT = Math.sin(theta), cosT = Math.cos(theta);
        posArr.push(radiusTop * cosT, hh, radiusTop * sinT);
        posArr.push(radiusBottom * cosT, -hh, radiusBottom * sinT);
        const slope = (radiusBottom - radiusTop) / height;
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
    },
  },
];

// ─── 메인 실행 ───────────────────────────────────────────────────────────────
async function main() {
  const manifestRows = [];

  for (const asset of RIGGED_ASSETS) {
    console.log(`\n생성 중: ${asset.filename}`);

    const geo = asset.geometry();
    const triCount = geo.indices.length / 3;

    const glbBuffer = buildRiggedGLB({
      meshName: asset.meshName,
      nodeName: asset.nodeName,
      materialName: asset.materialName,
      baseColor: asset.baseColor,
      roughness: asset.roughness,
      metallic: asset.metallic,
      geometry: geo,
      clothingCategory: asset.clothingCategory,
    });

    for (const relDir of asset.destDirs) {
      const outDir = path.join(ROOT, relDir);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, asset.filename);
      fs.writeFileSync(outPath, glbBuffer);
      console.log(`  저장: ${outPath} (${glbBuffer.byteLength} bytes)`);
    }

    // manifest 행 수집
    const parts = asset.filename.replace('.glb', '').split('_');
    const brand = parts[0];
    const category = parts[1];
    const itemType = parts[2];
    const color = parts[3];
    const rigType = parts[4]; // RIGGED
    const assetId = `${brand}_${category}_${itemType}_${color}_${rigType}`.toLowerCase();
    const firstOutPath = path.join(ROOT, asset.destDirs[0], asset.filename);
    const fileSizeBytes = fs.statSync(firstOutPath).size;

    manifestRows.push({
      assetId,
      filename: asset.filename,
      category,
      itemType,
      color,
      lod: 'LOD0',
      rigType: 'SMPL-24',
      triCount,
      fileSizeBytes,
    });

    console.log(`  삼각형 수: ${triCount}, 파일 크기: ${fileSizeBytes} bytes`);
  }

  // manifest-v0.csv 업데이트 (리깅 에셋 행 추가)
  const csvPath = path.join(ROOT, 'manifest-v0.csv');
  const existingCsv = fs.readFileSync(csvPath, 'utf8').trimEnd();
  const header = 'asset_id,filename,category,item_type,color,lod,polygon_count,file_size_bytes,texture_maps,draco_compressed,rig_type,status';

  // 기존 헤더에 rig_type 컬럼이 없으면 업데이트
  let csvLines = existingCsv.split('\n');
  if (!csvLines[0].includes('rig_type')) {
    csvLines[0] = header;
  }

  for (const row of manifestRows) {
    const line = [
      row.assetId,
      row.filename,
      row.category,
      row.itemType,
      row.color,
      row.lod,
      row.triCount,
      row.fileSizeBytes,
      'Albedo',
      'false',
      row.rigType,
      'ready',
    ].join(',');
    csvLines.push(line);
  }

  fs.writeFileSync(csvPath, csvLines.join('\n') + '\n');
  console.log(`\nmanifest-v0.csv 업데이트 완료: ${csvPath}`);
  console.log('\n모든 리깅 GLB 생성 완료.');
}

main().catch(err => {
  console.error('리깅 GLB 생성 실패:', err);
  process.exit(1);
});
