import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from '../Table';
import type { Column } from '../Table';

interface User {
  id: number;
  name: string;
  age: number;
}

const columns: Column<User>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '이름', sortable: true },
  { key: 'age', label: '나이', sortable: true },
];

const data: User[] = [
  { id: 1, name: '홍길동', age: 30 },
  { id: 2, name: '김철수', age: 25 },
  { id: 3, name: '이영희', age: 28 },
];

describe('Table', () => {
  it('헤더 컬럼이 렌더링된다', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('나이')).toBeInTheDocument();
  });

  it('데이터 행이 렌더링된다', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
    expect(screen.getByText('이영희')).toBeInTheDocument();
  });

  it('빈 데이터일 때 기본 빈 상태 메시지가 표시된다', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('커스텀 emptyState가 표시된다', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        emptyState={{ message: '결과가 없습니다.', icon: '🔍' }}
      />
    );
    expect(screen.getByText('결과가 없습니다.')).toBeInTheDocument();
  });

  it('sortable 컬럼 헤더 클릭 시 오름차순 정렬된다', () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByText('이름').closest('th');
    fireEvent.click(nameHeader!);
    const cells = screen.getAllByRole('cell');
    const nameCells = cells.filter((_, i) => i % 3 === 1); // 2번째 컬럼(이름)
    expect(nameCells[0]).toHaveTextContent('김철수');
  });

  it('sortable 컬럼 헤더 두 번 클릭 시 내림차순 정렬된다', () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByText('이름').closest('th');
    fireEvent.click(nameHeader!);
    fireEvent.click(nameHeader!);
    const cells = screen.getAllByRole('cell');
    const nameCells = cells.filter((_, i) => i % 3 === 1);
    expect(nameCells[0]).toHaveTextContent('홍길동');
  });

  it('sortable 컬럼 헤더 세 번 클릭 시 정렬 해제된다', () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByText('이름').closest('th');
    fireEvent.click(nameHeader!);
    fireEvent.click(nameHeader!);
    fireEvent.click(nameHeader!);
    // 원래 순서 복원
    const cells = screen.getAllByRole('cell');
    const nameCells = cells.filter((_, i) => i % 3 === 1);
    expect(nameCells[0]).toHaveTextContent('홍길동');
  });

  it('render 함수가 있으면 커스텀 렌더링된다', () => {
    const customColumns: Column<User>[] = [
      ...columns.slice(0, 2),
      {
        key: 'age',
        label: '나이',
        render: (value) => <span data-testid="age-badge">{String(value)}세</span>,
      },
    ];
    render(<Table columns={customColumns} data={data} />);
    expect(screen.getAllByTestId('age-badge')[0]).toHaveTextContent('30세');
  });

  it('rowKeyExtractor를 사용하면 고유 키가 적용된다', () => {
    render(
      <Table
        columns={columns}
        data={data}
        rowKeyExtractor={(row) => row.id}
      />
    );
    expect(screen.getByText('홍길동')).toBeInTheDocument();
  });
});
