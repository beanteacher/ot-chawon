import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../pagination';

describe('Pagination', () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    onPageChange.mockClear();
  });

  it('페이지 번호가 렌더링된다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByLabelText('1페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('5페이지')).toBeInTheDocument();
  });

  it('현재 페이지에 aria-current="page"가 설정된다', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByLabelText('3페이지')).toHaveAttribute('aria-current', 'page');
  });

  it('페이지 번호 클릭 시 onPageChange가 호출된다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('3페이지'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('다음 버튼 클릭 시 currentPage+1로 호출된다', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('다음 페이지'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('이전 버튼 클릭 시 currentPage-1로 호출된다', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('이전 페이지'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('첫 페이지일 때 이전 버튼이 disabled된다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByLabelText('이전 페이지')).toBeDisabled();
  });

  it('마지막 페이지일 때 다음 버튼이 disabled된다', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByLabelText('다음 페이지')).toBeDisabled();
  });

  it('첫 페이지에서 이전 버튼 클릭 시 onPageChange가 호출되지 않는다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('이전 페이지'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('totalPages가 7 이하이면 모든 페이지 번호가 표시된다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText(`${i}페이지`)).toBeInTheDocument();
    }
  });

  it('totalPages가 8 이상이면 말줄임(...)이 표시된다', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);
    expect(screen.getByText('…')).toBeInTheDocument();
  });

  it('pageSize와 onPageSizeChange가 있으면 셀렉터가 표시된다', () => {
    const onPageSizeChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
      />
    );
    expect(screen.getByLabelText('페이지당 항목 수')).toBeInTheDocument();
  });

  it('페이지 크기 변경 시 onPageSizeChange가 호출된다', () => {
    const onPageSizeChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
      />
    );
    fireEvent.change(screen.getByLabelText('페이지당 항목 수'), { target: { value: '20' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('pageSize가 없으면 셀렉터가 표시되지 않는다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.queryByLabelText('페이지당 항목 수')).not.toBeInTheDocument();
  });
});
