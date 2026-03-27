import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockScene = {
  scale: { setScalar: jest.fn() },
  position: { set: jest.fn() },
};

const mockCamera = {
  position: { set: jest.fn() },
  updateProjectionMatrix: jest.fn(),
};

jest.mock('@react-three/drei', () => ({
  useGLTF: jest.fn(() => ({ scene: mockScene })),
}));

jest.mock('@react-three/fiber', () => ({
  useThree: jest.fn(() => ({ camera: mockCamera })),
  useFrame: jest.fn(),
}));

// THREE.js mock
jest.mock('three', () => ({
  Box3: jest.fn().mockImplementation(() => ({
    setFromObject: jest.fn().mockReturnThis(),
    getSize: jest.fn(() => ({ x: 1, y: 2, z: 1 })),
    getCenter: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
  })),
  Vector3: jest.fn().mockImplementation(() => ({ x: 0, y: 0, z: 0 })),
  PerspectiveCamera: class {},
  Group: jest.fn(),
}));

import { GLBModel } from '@/components/three/GLBModel';

describe('GLBModel', () => {
  const testUrl = 'https://cdn.example.com/assets/clothing/shirt.glb';

  it('useGLTF가 올바른 URL로 호출된다', () => {
    const { useGLTF } = require('@react-three/drei');
    render(<GLBModel url={testUrl} />);
    expect(useGLTF).toHaveBeenCalledWith(testUrl, true);
  });

  it('scene이 반환될 때 스케일이 조정된다', () => {
    render(<GLBModel url={testUrl} />);
    expect(mockScene.scale.setScalar).toHaveBeenCalled();
    expect(mockScene.position.set).toHaveBeenCalled();
  });
});
