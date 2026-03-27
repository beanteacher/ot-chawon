import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyPageTabs } from '../MyPageTabs';
import type { MyPageTab } from '../MyPageTabs';

describe('MyPageTabs', () => {
  const tabs: { id: MyPageTab; label: string }[] = [
    { id: 'profile', label: '프로필' },
    { id: 'orders', label: '주문내역' },
    { id: 'fittings', label: '피팅이력' },
    { id: 'address', label: '배송지' },
  ];

  it('모든 탭 라벨을 렌더링한다', () => {
    const handleChange = jest.fn();
    render(<MyPageTabs activeTab="profile" onChange={handleChange} />);

    tabs.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('활성 탭에 aria-selected="true"를 설정한다', () => {
    const handleChange = jest.fn();
    render(<MyPageTabs activeTab="orders" onChange={handleChange} />);

    const ordersTab = screen.getByRole('tab', { name: '주문내역' });
    expect(ordersTab).toHaveAttribute('aria-selected', 'true');

    const profileTab = screen.getByRole('tab', { name: '프로필' });
    expect(profileTab).toHaveAttribute('aria-selected', 'false');
  });

  it('탭 클릭 시 onChange 핸들러를 호출한다', () => {
    const handleChange = jest.fn();
    render(<MyPageTabs activeTab="profile" onChange={handleChange} />);

    fireEvent.click(screen.getByRole('tab', { name: '피팅이력' }));
    expect(handleChange).toHaveBeenCalledWith('fittings');
  });

  it('활성 탭에 brandOrange 하단 보더 클래스를 적용한다', () => {
    const handleChange = jest.fn();
    render(<MyPageTabs activeTab="address" onChange={handleChange} />);

    const addressTab = screen.getByRole('tab', { name: '배송지' });
    expect(addressTab.className).toContain('border-[#FF6B35]');
  });
});
