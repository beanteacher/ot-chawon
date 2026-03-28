import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SizeRecommendation } from '@/components/fitting/SizeRecommendation';
import type { FittingDto } from '@/types/fitting.dto';

const mockRecommendation: FittingDto.SizeRecommendation = {
  recommended_size: 'M',
  confidence: 87,
  alternatives: ['S', 'L'],
  reason: [
    '가슴둘레가 M 사이즈 기준에 적합합니다',
    '어깨너비가 M 사이즈 범위 내에 있습니다',
  ],
};

describe('SizeRecommendation', () => {
  it('추천 사이즈 배지를 렌더링한다', () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    // 배지와 텍스트 둘 다 렌더링됨
    const sizeElements = screen.getAllByText('M');
    expect(sizeElements.length).toBeGreaterThanOrEqual(1);
  });

  it('신뢰도 퍼센트를 표시한다', () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    const confidenceElements = screen.getAllByText(/87%/);
    expect(confidenceElements.length).toBeGreaterThanOrEqual(1);
  });

  it('대안 사이즈 칩을 렌더링한다', () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('추천 이유 목록을 렌더링한다', () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    expect(
      screen.getByText('가슴둘레가 M 사이즈 기준에 적합합니다')
    ).toBeInTheDocument();
    expect(
      screen.getByText('어깨너비가 M 사이즈 범위 내에 있습니다')
    ).toBeInTheDocument();
  });

  it('alternatives가 없을 때 섹션을 렌더링하지 않는다', () => {
    const noAlternatives: FittingDto.SizeRecommendation = {
      ...mockRecommendation,
      alternatives: [],
    };
    render(<SizeRecommendation recommendation={noAlternatives} />);
    expect(screen.queryByText('다른 사이즈 옵션')).not.toBeInTheDocument();
  });

  it('reason이 없을 때 섹션을 렌더링하지 않는다', () => {
    const noReason: FittingDto.SizeRecommendation = {
      ...mockRecommendation,
      reason: [],
    };
    render(<SizeRecommendation recommendation={noReason} />);
    expect(screen.queryByText('추천 근거')).not.toBeInTheDocument();
  });
});
