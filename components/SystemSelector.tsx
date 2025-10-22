'use client';

import { ODESystem } from '@/types/simulation';

interface SystemSelectorProps {
  systems: ODESystem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function SystemSelector({
  systems,
  selectedId,
  onSelect,
}: SystemSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select System
      </label>
      <div className="flex gap-2">
        {systems.map((system) => (
          <button
            key={system.id}
            onClick={() => onSelect(system.id)}
            className={`
              flex-1 px-4 py-2 rounded-lg font-medium transition-all
              ${
                selectedId === system.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={system.description}
          >
            {system.name}
          </button>
        ))}
      </div>
      {systems.find((s) => s.id === selectedId) && (
        <p className="text-sm text-gray-600">
          {systems.find((s) => s.id === selectedId)?.description}
        </p>
      )}
    </div>
  );
}
