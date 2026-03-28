import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// dynamic import mock — next/dynamic를 먼저 mock
jest.mock('next/dynamic', () => {
  return function dynamicMock(
    loader: () => Promise<{ default: React.ComponentType<{ glbUrl: string; autoRotate?: boolean; className?: string }> }>
  ) {
    // loader를 호출하지 않고 glbUrl을 표시하는 간단한 컴포넌트 반환
    const MockComponent = ({ glbUrl }: { glbUrl: string }) => (
      <div data-testid="product-viewer-3d" data-glb-url={glbUrl} />
    );
    MockComponent.displayName = 'DynamicProductViewer3D';
    // loader를 참조하여 lint 경고 방지
    void loader;
    return MockComponent;
  };
});

import { FittingResult3DViewer } from '@/components/fitting/FittingResult3DViewer';

describe('FittingResult3DViewer', () => {
  const testGlbUrl = 'https://cdn.example.com/assets/fitted/test.glb';

  it('dynamic import된 ProductViewer3D를 렌더링한다', () => {
    render(<FittingResult3DViewer glbUrl={testGlbUrl} />);
    expect(screen.getByTestId('product-viewer-3d')).toBeInTheDocument();
  });

  it('glbUrl prop을 ProductViewer3D에 전달한다', () => {
    render(<FittingResult3DViewer glbUrl={testGlbUrl} />);
    expect(screen.getByTestId('product-viewer-3d')).toHaveAttribute(
      'data-glb-url',
      testGlbUrl
    );
  });

  it('빈 glbUrl도 렌더링한다', () => {
    render(<FittingResult3DViewer glbUrl="" />);
    expect(screen.getByTestId('product-viewer-3d')).toHaveAttribute(
      'data-glb-url',
      ''
    );
  });
});
