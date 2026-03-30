import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../search-bar';

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onSearch: jest.fn(),
    suggestions: [],
    showSuggestions: false,
    onShowSuggestions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('placeholder 텍스트가 표시된다', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('검색어를 입력하세요...')).toBeInTheDocument();
  });

  it('검색어 입력 시 onChange가 호출된다', async () => {
    const onChange = jest.fn();
    render(<SearchBar {...defaultProps} onChange={onChange} />);
    const input = screen.getByPlaceholderText('검색어를 입력하세요...');
    await userEvent.type(input, '나이키');
    expect(onChange).toHaveBeenCalled();
  });

  it('검색 버튼 클릭 시 onSearch가 호출된다', () => {
    const onSearch = jest.fn();
    render(<SearchBar {...defaultProps} value="나이키" onSearch={onSearch} />);
    fireEvent.click(screen.getByText('검색'));
    expect(onSearch).toHaveBeenCalledWith('나이키');
  });

  it('Enter 키 입력 시 onSearch가 호출된다', () => {
    const onSearch = jest.fn();
    render(<SearchBar {...defaultProps} value="나이키" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('검색어를 입력하세요...');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('나이키');
  });

  it('value가 있을 때 클리어 버튼이 표시된다', () => {
    render(<SearchBar {...defaultProps} value="나이키" />);
    expect(screen.getByLabelText('검색어 지우기')).toBeInTheDocument();
  });

  it('value가 없을 때 클리어 버튼이 표시되지 않는다', () => {
    render(<SearchBar {...defaultProps} value="" />);
    expect(screen.queryByLabelText('검색어 지우기')).not.toBeInTheDocument();
  });

  it('자동완성 목록이 showSuggestions=true일 때 표시된다', () => {
    const suggestions = ['오버사이즈 코트', '오버핏 셔츠'];
    render(
      <SearchBar
        {...defaultProps}
        value="오버"
        suggestions={suggestions}
        showSuggestions={true}
      />
    );
    expect(screen.getByText('오버사이즈 코트')).toBeInTheDocument();
    expect(screen.getByText('오버핏 셔츠')).toBeInTheDocument();
  });

  it('자동완성 항목 클릭 시 onSearch가 호출된다', () => {
    const onSearch = jest.fn();
    const onChange = jest.fn();
    const suggestions = ['오버사이즈 코트'];
    render(
      <SearchBar
        {...defaultProps}
        value="오버"
        onChange={onChange}
        onSearch={onSearch}
        suggestions={suggestions}
        showSuggestions={true}
      />
    );
    fireEvent.mouseDown(screen.getByText('오버사이즈 코트'));
    expect(onSearch).toHaveBeenCalledWith('오버사이즈 코트');
  });

  it('첫 번째 자동완성 항목이 brandOrange 색상으로 하이라이트된다', () => {
    const suggestions = ['오버사이즈 코트', '오버핏 셔츠'];
    render(
      <SearchBar
        {...defaultProps}
        value="오버"
        suggestions={suggestions}
        showSuggestions={true}
      />
    );
    const firstItem = screen.getByText('오버사이즈 코트');
    expect(firstItem).toHaveClass('text-[#FF6B35]');
  });

  it('Escape 키 입력 시 onShowSuggestions(false)가 호출된다', () => {
    const onShowSuggestions = jest.fn();
    render(
      <SearchBar
        {...defaultProps}
        showSuggestions={true}
        onShowSuggestions={onShowSuggestions}
      />
    );
    const input = screen.getByPlaceholderText('검색어를 입력하세요...');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onShowSuggestions).toHaveBeenCalledWith(false);
  });

  it("클리어 버튼 클릭 시 onChange('')가 호출된다", () => {
    const onChange = jest.fn();
    render(<SearchBar {...defaultProps} value="나이키" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('검색어 지우기'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
