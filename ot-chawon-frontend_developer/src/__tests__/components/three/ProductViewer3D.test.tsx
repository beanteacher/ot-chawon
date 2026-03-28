import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductViewer3D } from '@/components/three/ProductViewer3D';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useThree: jest.fn(() => ({
    camera: { position: { set: jest.fn() }, updateProjectionMatrix: jest.fn() },
  })),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: React.forwardRef(function OrbitControlsMock(_props: Record<string, unknown>, _ref: React.Ref<unknown>) { return null; }),
  Environment: () => null,
  useGLTF: jest.fn(() => ({ scene: { scale: { setScalar: jest.fn() }, position: { set: jest.fn() } } })),
  useProgress: jest.fn(() => ({ progress: 100 })),
}));

jest.mock('@/components/three/GLBModel', () => ({
  GLBModel: ({ url }: { url: string }) => <div data-testid="glb-model" data-url={url} />,
}));

jest.mock('@/components/three/ViewerLoading', () => ({
  ViewerLoading: () => <div data-testid="viewer-loading" />,
}));

jest.mock('@/components/three/ViewerControls', () => ({
  ViewerControls: ({
    autoRotate,
    onAutoRotateToggle,
    onZoomReset,
    onFullscreenToggle,
  }: {
    autoRotate: boolean;
    onAutoRotateToggle: () => void;
    onZoomReset: () => void;
    onFullscreenToggle: () => void;
    isFullscreen: boolean;
  }) => (
    <div data-testid="viewer-controls" data-auto-rotate={String(autoRotate)}>
      <button data-testid="auto-rotate-btn" onClick={onAutoRotateToggle}>회전</button>
      <button data-testid="zoom-reset-btn" onClick={onZoomReset}>리셋</button>
      <button data-testid="fullscreen-btn" onClick={onFullscreenToggle}>전체화면</button>
    </div>
  ),
}));

describe('ProductViewer3D', () => {
  const testUrl = 'https://cdn.example.com/assets/clothing/test.glb';

  it('Canvas와 컨트롤이 렌더링된다', () => {
    render(<ProductViewer3D glbUrl={testUrl} />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('viewer-controls')).toBeInTheDocument();
  });

  it('autoRotate 기본값은 true이다', () => {
    render(<ProductViewer3D glbUrl={testUrl} />);
    expect(screen.getByTestId('viewer-controls')).toHaveAttribute('data-auto-rotate', 'true');
  });

  it('autoRotate=false로 초기화할 수 있다', () => {
    render(<ProductViewer3D glbUrl={testUrl} autoRotate={false} />);
    expect(screen.getByTestId('viewer-controls')).toHaveAttribute('data-auto-rotate', 'false');
  });

  it('자동회전 토글 버튼 클릭 시 상태가 변경된다', () => {
    render(<ProductViewer3D glbUrl={testUrl} autoRotate={true} />);
    const btn = screen.getByTestId('auto-rotate-btn');
    fireEvent.click(btn);
    expect(screen.getByTestId('viewer-controls')).toHaveAttribute('data-auto-rotate', 'false');
  });

  it('className prop이 컨테이너에 적용된다', () => {
    const { container } = render(<ProductViewer3D glbUrl={testUrl} className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });
});
