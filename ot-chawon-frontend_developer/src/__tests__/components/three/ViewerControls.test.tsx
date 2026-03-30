import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ViewerControls } from '@/components/three/viewer-controls';

describe('ViewerControls', () => {
  const defaultProps = {
    autoRotate: false,
    onAutoRotateToggle: jest.fn(),
    onZoomReset: jest.fn(),
    onFullscreenToggle: jest.fn(),
    isFullscreen: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤 버튼들이 렌더링된다', () => {
    render(<ViewerControls {...defaultProps} />);
    expect(screen.getByTitle('자동 회전 켜기')).toBeInTheDocument();
    expect(screen.getByTitle('줌 리셋')).toBeInTheDocument();
    expect(screen.getByTitle('전체화면')).toBeInTheDocument();
  });

  it('자동 회전 버튼 클릭 시 콜백이 호출된다', () => {
    render(<ViewerControls {...defaultProps} />);
    fireEvent.click(screen.getByTitle('자동 회전 켜기'));
    expect(defaultProps.onAutoRotateToggle).toHaveBeenCalledTimes(1);
  });

  it('줌 리셋 버튼 클릭 시 콜백이 호출된다', () => {
    render(<ViewerControls {...defaultProps} />);
    fireEvent.click(screen.getByTitle('줌 리셋'));
    expect(defaultProps.onZoomReset).toHaveBeenCalledTimes(1);
  });

  it('전체화면 버튼 클릭 시 콜백이 호출된다', () => {
    render(<ViewerControls {...defaultProps} />);
    fireEvent.click(screen.getByTitle('전체화면'));
    expect(defaultProps.onFullscreenToggle).toHaveBeenCalledTimes(1);
  });

  it('autoRotate=true일 때 활성화 스타일이 적용된다', () => {
    render(<ViewerControls {...defaultProps} autoRotate={true} />);
    const btn = screen.getByTitle('자동 회전 끄기');
    expect(btn).toHaveClass('text-oc-primary-400');
  });

  it('isFullscreen=true일 때 전체화면 종료 버튼 title이 변경된다', () => {
    render(<ViewerControls {...defaultProps} isFullscreen={true} />);
    expect(screen.getByTitle('전체화면 종료')).toBeInTheDocument();
  });
});
