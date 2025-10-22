'use client';

import { Parameter } from '@/types/simulation';
import { useState, useEffect, useCallback } from 'react';

interface ParameterControlsProps {
  parameters: Parameter[];
  values: Record<string, number>;
  onChange: (name: string, value: number) => void;
}

export default function ParameterControls({
  parameters,
  values,
  onChange,
}: ParameterControlsProps) {
  // Local state for immediate UI updates
  const [localValues, setLocalValues] = useState<Record<string, number>>(values);

  // Update local values when parent values change (e.g., system switch)
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // Debounced onChange handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only trigger parent onChange if values have actually changed
      Object.keys(localValues).forEach((key) => {
        if (localValues[key] !== values[key]) {
          onChange(key, localValues[key]);
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localValues, onChange, values]);

  const handleSliderChange = useCallback((name: string, value: number) => {
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Parameters</h3>
      <div className="space-y-3">
        {parameters.map((param) => (
          <div key={param.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor={`param-${param.name}`}
                className="text-sm font-medium text-gray-700"
              >
                {param.label}
              </label>
              <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {localValues[param.name]?.toFixed(2) ?? param.default.toFixed(2)}
              </span>
            </div>
            <input
              id={`param-${param.name}`}
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={localValues[param.name] ?? param.default}
              onChange={(e) => handleSliderChange(param.name, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{param.min}</span>
              <span>{param.max}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
