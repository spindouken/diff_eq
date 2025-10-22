'use client';

interface InitialConditionControlsProps {
  variableNames: string[];
  values: number[];
  onChange: (index: number, value: number) => void;
}

export default function InitialConditionControls({
  variableNames,
  values,
  onChange,
}: InitialConditionControlsProps) {
  const handleInputChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange(index, numValue);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Initial Conditions</h3>
      <div className="space-y-3">
        {variableNames.map((varName, index) => (
          <div key={index} className="space-y-1">
            <label
              htmlFor={`ic-${index}`}
              className="text-sm font-medium text-gray-700"
            >
              {varName}₀
            </label>
            <input
              id={`ic-${index}`}
              type="number"
              step="0.1"
              value={values[index] ?? 0}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
