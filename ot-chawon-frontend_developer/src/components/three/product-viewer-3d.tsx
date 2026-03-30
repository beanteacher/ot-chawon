'use client';

import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { GLBModel } from './glb-model';
import { ViewerControls } from './viewer-controls';
import { ViewerLoading } from './viewer-loading';

interface ProductViewer3DProps {
  glbUrl: string;
  autoRotate?: boolean;
  className?: string;
}

export function ProductViewer3D({
  glbUrl,
  autoRotate: initialAutoRotate = true,
  className,
}: ProductViewer3DProps) {
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleAutoRotateToggle = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  const handleZoomReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square bg-oc-black rounded-xl overflow-hidden ${className ?? ''}`}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
      >
        {/* 3점 조명 시스템 */}
        <ambientLight intensity={0.3} />
        {/* Key Light */}
        <directionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
        {/* Fill Light */}
        <directionalLight intensity={0.5} position={[-5, 3, -5]} />
        {/* Rim Light */}
        <spotLight intensity={0.8} position={[0, 5, -5]} />

        <Environment preset="studio" />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          minDistance={1}
          maxDistance={8}
          makeDefault
        />

        <Suspense fallback={null}>
          <GLBModel url={glbUrl} />
        </Suspense>
      </Canvas>

      {/* 로딩 오버레이 — Suspense 경계 바깥에서 useProgress로 표시 */}
      <LoadingOverlay />

      <ViewerControls
        autoRotate={autoRotate}
        onAutoRotateToggle={handleAutoRotateToggle}
        onZoomReset={handleZoomReset}
        onFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}

// useProgress는 Canvas 바깥에서도 동작하므로 별도 컴포넌트로 분리
function LoadingOverlay() {
  return (
    <Suspense fallback={<ViewerLoading />}>
      <></>
    </Suspense>
  );
}
