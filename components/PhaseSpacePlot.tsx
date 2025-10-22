'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Trajectory } from '@/types/simulation';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PhaseSpacePlotProps {
  trajectory: Trajectory;
  systemType: '2d' | '3d';
}

export default function PhaseSpacePlot({ trajectory, systemType }: PhaseSpacePlotProps) {
  // Extract data from trajectory
  const points = trajectory.points;
  
  if (!points || points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No trajectory data available</p>
      </div>
    );
  }

  // Render 3D plot for Lorenz system
  if (systemType === '3d') {
    const xData = points.map(p => p.state[0]);
    const yData = points.map(p => p.state[1]);
    const zData = points.map(p => p.state[2]);

    const data: Plotly.Data[] = [
      {
        type: 'scatter3d',
        mode: 'lines',
        x: xData,
        y: yData,
        z: zData,
        line: {
          color: points.map((_, i) => i),
          colorscale: 'Viridis',
          width: 2,
        },
        name: 'Trajectory',
      } as Plotly.Data,
    ];

    const layout: Partial<Plotly.Layout> = {
      autosize: true,
      scene: {
        xaxis: { title: trajectory.variables[0] || 'x' },
        yaxis: { title: trajectory.variables[1] || 'y' },
        zaxis: { title: trajectory.variables[2] || 'z' },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 },
        },
      },
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    };

    const config: Partial<Plotly.Config> = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
    };

    return (
      <div className="w-full h-full">
        <Plot
          data={data}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    );
  }

  // Render 2D plot for Lotka-Volterra system
  if (systemType === '2d') {
    const xData = points.map(p => p.state[0]);
    const yData = points.map(p => p.state[1]);

    const data: Plotly.Data[] = [
      {
        type: 'scatter',
        mode: 'lines',
        x: xData,
        y: yData,
        line: {
          color: points.map((_, i) => i),
          colorscale: 'Viridis',
          width: 2,
        },
        name: 'Trajectory',
      } as Plotly.Data,
    ];

    const layout: Partial<Plotly.Layout> = {
      autosize: true,
      xaxis: { 
        title: trajectory.variables[0] || 'x',
        zeroline: true,
      },
      yaxis: { 
        title: trajectory.variables[1] || 'y',
        zeroline: true,
      },
      margin: { l: 60, r: 20, t: 20, b: 60 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(255,255,255,1)',
      hovermode: 'closest',
    };

    const config: Partial<Plotly.Config> = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
    };

    return (
      <div className="w-full h-full">
        <Plot
          data={data}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    );
  }

  return null;
}
