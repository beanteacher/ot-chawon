import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileSection } from '../ProfileSection';
import { useAuthStore } from '@/store/auth.store';

// auth store mock
jest.mock('@/store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('ProfileSection', () => {
  beforeEach(() => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        user: { id: 1, name: '테스트유저', email: 'test@example.com', role: 'USER' },
        accessToken: 'mock-token',
        isAuthenticated: true,
        setAuth: jest.fn(),
        clearAuth: jest.fn(),
      })
    );
  });

  it('사용자 이름과 이메일을 렌더링한다', () => {
    render(<ProfileSection />);
    expect(screen.getByText('테스트유저')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('아바타에 이름 앞 두 글자를 표시한다', () => {
    render(<ProfileSection />);
    expect(screen.getByText('테스')).toBeInTheDocument();
  });

  it('프로필 편집 버튼 클릭 시 모달이 열린다', () => {
    render(<ProfileSection />);
    fireEvent.click(screen.getByRole('button', { name: /프로필 편집/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByText('프로필 편집').length).toBeGreaterThanOrEqual(2);
  });

  it('모달에 이름, 이메일, 전화번호 필드가 있다', () => {
    render(<ProfileSection />);
    fireEvent.click(screen.getByRole('button', { name: /프로필 편집/ }));

    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('전화번호')).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 모달이 닫힌다', () => {
    render(<ProfileSection />);
    fireEvent.click(screen.getByRole('button', { name: /프로필 편집/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('유저 정보가 없을 때 기본 텍스트를 표시한다', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        setAuth: jest.fn(),
        clearAuth: jest.fn(),
      })
    );
    render(<ProfileSection />);
    expect(screen.getByText('이름 없음')).toBeInTheDocument();
    expect(screen.getByText('이메일 없음')).toBeInTheDocument();
  });
});
