'use client';

import { useState, useMemo, useCallback } from 'react';
import { systems, getSystemById } from '@/lib/systems';
import { solveODE } from '@/lib/ode-solver';
import { Trajectory } from '@/types/simulation';
import SystemSelector from './SystemSelector';
import ParameterControls from './ParameterControls';
import InitialConditionControls from './InitialConditionControls';
import PhaseSpacePlot from './PhaseSpacePlot';
import TimeSeriesPlot from './TimeSeriesPlot';

export default function SimulationDashboard() {
  // State for selected system
  const [selectedSystemId, setSelectedSystemId] = useState<string>('lorenz');
  
  // Get current system
  const currentSystem = useMemo(() => {
    return getSystemById(selectedSystemId);
  }, [selectedSystemId]);

  // State for parameters - initialized with default values
  const [parameters, setParameters] = useState<Record<string, number>>(() => {
    if (!currentSystem) return {};
    return currentSystem.parameters.reduce((acc, param) => {
      acc[param.name] = param.default;
      return acc;
    }, {} as Record<string, number>);
  });

  // State for initial conditions - initialized with defaults
  const [initialConditions, setInitialConditions] = useState<number[]>(() => {
    return currentSystem?.defaultInitialConditions ?? [];
  });

  // Handle system switching - reset parameters and initial conditions
  const handleSystemChange = useCallback((systemId: string) => {
    const newSystem = getSystemById(systemId);
    if (!newSystem) return;

    setSelectedSystemId(systemId);
    
    // Reset parameters to new system's defaults
    const newParams = newSystem.parameters.reduce((acc, param) => {
      acc[param.name] = param.default;
      return acc;
    }, {} as Record<string, number>);
    setParameters(newParams);
    
    // Reset initial conditions to new system's defaults
    setInitialConditions([...newSystem.defaultInitialConditions]);
  }, []);

  // Handle parameter changes
  const handleParameterChange = useCallback((name: string, value: number) => {
    setParameters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle initial condition changes
  const handleInitialConditionChange = useCallback((index: number, value: number) => {
    setInitialConditions(prev => {
      const newConditions = [...prev];
      newConditions[index] = value;
      return newConditions;
    });
  }, []);

  // Compute trajectory using useMemo - recomputes when dependencies change
  const trajectoryResult = useMemo(() => {
    try {
      // Determine appropriate solver configuration based on system
      const dt = 0.01;
      const tMax = selectedSystemId === 'lorenz' ? 50 : 30;

      const trajectory = solveODE(currentSystem, {
        dt,
        tMax,
        initialConditions,
        parameters,
      });

      return { success: true, trajectory, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, trajectory: null, error: errorMessage };
    }
  }, [currentSystem, parameters, initialConditions, selectedSystemId]);

  if (!currentSystem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error: System not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive ODE Simulation Dashboard
          </h1>
          <p className="text-gray-600">
            Explore dynamical systems through real-time visualization
          </p>
        </header>

        <div className="mb-6">
          <SystemSelector
            systems={systems}
            selectedId={selectedSystemId}
            onSelect={handleSystemChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ParameterControls
                parameters={currentSystem.parameters}
                values={parameters}
                onChange={handleParameterChange}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <InitialConditionControls
                variableNames={currentSystem.stateVariables}
                values={initialConditions}
                onChange={handleInitialConditionChange}
              />
            </div>
          </div>

          {/* Visualizations Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Phase Space
              </h2>
              <div className="h-96">
                {trajectoryResult.success && trajectoryResult.trajectory ? (
                  <PhaseSpacePlot
                    trajectory={trajectoryResult.trajectory}
                    systemType={currentSystem.stateVariables.length === 3 ? '3d' : '2d'}
                  />
                ) : trajectoryResult.error ? (
                  <div className="flex items-center justify-center h-full bg-red-50 rounded-lg border border-red-200">
                    <div className="text-center p-4">
                      <p className="text-red-600 font-semibold mb-2">Computation Error</p>
                      <p className="text-red-500 text-sm">{trajectoryResult.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Computing trajectory...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Time Series
              </h2>
              <div className="h-80">
                {trajectoryResult.success && trajectoryResult.trajectory ? (
                  <TimeSeriesPlot trajectory={trajectoryResult.trajectory} />
                ) : trajectoryResult.error ? (
                  <div className="flex items-center justify-center h-full bg-red-50 rounded-lg border border-red-200">
                    <div className="text-center p-4">
                      <p className="text-red-600 font-semibold mb-2">Computation Error</p>
                      <p className="text-red-500 text-sm">{trajectoryResult.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Computing trajectory...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
