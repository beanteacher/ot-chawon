'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface GLBModelProps {
  url: string;
}

export function GLBModel({ url }: GLBModelProps) {
  const { scene } = useGLTF(url, true);
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!scene) return;

    // 모델 바운딩 박스 계산 후 뷰포트에 맞게 스케일/센터 조정
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;

    scene.scale.setScalar(scale);
    scene.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );

    // 카메라를 모델 크기에 맞게 조정
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0, 3);
      camera.updateProjectionMatrix();
    }
  }, [scene, camera]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// 프리로드는 URL이 정해진 경우에만 사용 — 동적 URL이므로 컴포넌트 외부 preload는 생략
