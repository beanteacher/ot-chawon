'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

interface BodyMeasurement {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hip: number;
  shoulder: number;
  armLength: number;
  legLength: number;
}

interface SliderFieldProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function SliderField({ label, unit, value, min, max, onChange }: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-oc-gray-300">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 text-center bg-oc-gray-800 border border-oc-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-oc-primary-500"
          />
          <span className="text-xs text-oc-gray-500">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-oc-gray-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface BodyMeasurementFormProps {
  onSubmit: (data: BodyMeasurement) => void;
  isLoading?: boolean;
}

const DEFAULT_MEASUREMENTS: BodyMeasurement = {
  height: 170,
  weight: 65,
  chest: 90,
  waist: 75,
  hip: 95,
  shoulder: 45,
  armLength: 60,
  legLength: 80,
};

export function BodyMeasurementForm({ onSubmit, isLoading = false }: BodyMeasurementFormProps) {
  const [measurements, setMeasurements] = useState<BodyMeasurement>(DEFAULT_MEASUREMENTS);

  const updateField = (field: keyof BodyMeasurement) => (value: number) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoadPrevious = () => {
    // UI only - 이전 측정값 불러오기
    setMeasurements(DEFAULT_MEASUREMENTS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(measurements);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 체형 시각화 영역 */}
      <div className="flex justify-center">
        <div className="relative w-32 h-48">
          <svg viewBox="0 0 100 160" className="w-full h-full" fill="none">
            {/* 머리 */}
            <circle cx="50" cy="18" r="12" fill="#FF6B35" fillOpacity="0.3" stroke="#FF6B35" strokeWidth="1.5" />
            {/* 몸통 */}
            <path
              d="M32 35 Q50 32 68 35 L72 90 Q50 95 28 90 Z"
              fill="#FF6B35"
              fillOpacity="0.2"
              stroke="#FF6B35"
              strokeWidth="1.5"
            />
            {/* 팔 - 왼쪽 */}
            <path d="M32 38 L18 75 L22 76 L36 42" fill="#FF6B35" fillOpacity="0.2" stroke="#FF6B35" strokeWidth="1.5" />
            {/* 팔 - 오른쪽 */}
            <path d="M68 38 L82 75 L78 76 L64 42" fill="#FF6B35" fillOpacity="0.2" stroke="#FF6B35" strokeWidth="1.5" />
            {/* 다리 - 왼쪽 */}
            <path d="M38 90 L34 140 L42 140 L46 90" fill="#FF6B35" fillOpacity="0.2" stroke="#FF6B35" strokeWidth="1.5" />
            {/* 다리 - 오른쪽 */}
            <path d="M62 90 L66 140 L58 140 L54 90" fill="#FF6B35" fillOpacity="0.2" stroke="#FF6B35" strokeWidth="1.5" />
            {/* 치수 라인 - 어깨 */}
            <line x1="28" y1="38" x2="72" y2="38" stroke="#FF6B35" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* 치수 라인 - 허리 */}
            <line x1="32" y1="68" x2="68" y2="68" stroke="#4B5563" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* 치수 라인 - 엉덩이 */}
            <line x1="30" y1="88" x2="70" y2="88" stroke="#4B5563" strokeWidth="0.5" strokeDasharray="2,2" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-oc-primary-500">{measurements.height}</div>
              <div className="text-xs text-oc-gray-500">cm</div>
            </div>
          </div>
        </div>
      </div>

      {/* 이전 측정값 불러오기 */}
      <button
        type="button"
        onClick={handleLoadPrevious}
        className="w-full text-sm text-oc-primary-500 border border-oc-primary-500 border-dashed rounded-lg py-2 hover:bg-oc-primary-500/10 transition-colors"
      >
        이전 측정값 불러오기
      </button>

      {/* 측정 입력 필드들 */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SliderField
            label="키"
            unit="cm"
            value={measurements.height}
            min={140}
            max={220}
            onChange={updateField('height')}
          />
          <SliderField
            label="몸무게"
            unit="kg"
            value={measurements.weight}
            min={30}
            max={150}
            onChange={updateField('weight')}
          />
        </div>
        <SliderField
          label="가슴둘레"
          unit="cm"
          value={measurements.chest}
          min={60}
          max={140}
          onChange={updateField('chest')}
        />
        <SliderField
          label="허리둘레"
          unit="cm"
          value={measurements.waist}
          min={55}
          max={130}
          onChange={updateField('waist')}
        />
        <SliderField
          label="엉덩이둘레"
          unit="cm"
          value={measurements.hip}
          min={70}
          max={140}
          onChange={updateField('hip')}
        />
        <SliderField
          label="어깨너비"
          unit="cm"
          value={measurements.shoulder}
          min={30}
          max={60}
          onChange={updateField('shoulder')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SliderField
            label="팔 길이"
            unit="cm"
            value={measurements.armLength}
            min={40}
            max={90}
            onChange={updateField('armLength')}
          />
          <SliderField
            label="다리 길이"
            unit="cm"
            value={measurements.legLength}
            min={60}
            max={120}
            onChange={updateField('legLength')}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 text-base font-semibold bg-oc-primary-500 hover:bg-oc-primary-600 text-white rounded-xl"
      >
        {isLoading ? '처리 중...' : 'AI 피팅 시작'}
      </Button>
    </form>
  );
}
