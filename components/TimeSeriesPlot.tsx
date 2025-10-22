'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Trajectory } from '@/types/simulation';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface TimeSeriesPlotProps {
  trajectory: Trajectory;
}

export default function TimeSeriesPlot({ trajectory }: TimeSeriesPlotProps) {
  const points = trajectory.points;
  
  if (!points || points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No trajectory data available</p>
      </div>
    );
  }

  // Extract time data
  const timeData = points.map(p => p.t);
  
  // Define distinct colors for each variable
  const colors = [
    '#1f77b4', // blue
    '#ff7f0e', // orange
    '#2ca02c', // green
    '#d62728', // red
    '#9467bd', // purple
    '#8c564b', // brown
  ];

  // Create a trace for each state variable
  const data: Plotly.Data[] = trajectory.variables.map((varName, index) => {
    const varData = points.map(p => p.state[index]);
    
    return {
      type: 'scatter',
      mode: 'lines',
      x: timeData,
      y: varData,
      name: varName,
      line: {
        color: colors[index % colors.length],
        width: 2,
      },
    } as Plotly.Data;
  });

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    xaxis: {
      title: 'Time',
      zeroline: true,
      showgrid: true,
      gridcolor: '#e5e7eb',
    },
    yaxis: {
      title: 'Value',
      zeroline: true,
      showgrid: true,
      gridcolor: '#e5e7eb',
    },
    margin: { l: 60, r: 20, t: 20, b: 60 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(255,255,255,1)',
    hovermode: 'x unified',
    showlegend: true,
    legend: {
      x: 1.02,
      y: 1,
      xanchor: 'left',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#e5e7eb',
      borderwidth: 1,
    },
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
