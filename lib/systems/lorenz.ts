import { ODESystem } from '@/types/simulation';

/**
 * Lorenz Attractor System
 * 
 * A system of three coupled ordinary differential equations that exhibits chaotic behavior.
 * The system is known for its butterfly-shaped attractor.
 * 
 * Equations:
 * dx/dt = σ(y - x)
 * dy/dt = x(ρ - z) - y
 * dz/dt = xy - βz
 * 
 * Where:
 * - σ (sigma): Prandtl number
 * - ρ (rho): Rayleigh number
 * - β (beta): Geometric factor
 */
export const lorenzSystem: ODESystem = {
  id: 'lorenz',
  name: 'Lorenz Attractor',
  description: 'A chaotic system exhibiting the famous butterfly attractor',
  stateVariables: ['x', 'y', 'z'],
  parameters: [
    {
      name: 'sigma',
      label: 'σ (Sigma)',
      min: 0,
      max: 20,
      step: 0.1,
      default: 10,
    },
    {
      name: 'rho',
      label: 'ρ (Rho)',
      min: 0,
      max: 50,
      step: 0.5,
      default: 28,
    },
    {
      name: 'beta',
      label: 'β (Beta)',
      min: 0,
      max: 10,
      step: 0.1,
      default: 8 / 3,
    },
  ],
  defaultInitialConditions: [1, 1, 1],
  equations: (state: number[], params: Record<string, number>): number[] => {
    const [x, y, z] = state;
    const { sigma, rho, beta } = params;

    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;

    return [dx, dy, dz];
  },
};
