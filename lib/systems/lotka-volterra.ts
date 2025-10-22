import { ODESystem } from '@/types/simulation';

/**
 * Lotka-Volterra Predator-Prey Model
 * 
 * A pair of first-order nonlinear differential equations that describe the dynamics
 * of biological systems in which two species interact, one as a predator and the
 * other as prey.
 * 
 * Equations:
 * d(prey)/dt = αx - βxy
 * d(predator)/dt = δxy - γy
 * 
 * Where:
 * - α (alpha): Prey growth rate
 * - β (beta): Predation rate
 * - δ (delta): Predator efficiency (conversion of prey to predator)
 * - γ (gamma): Predator death rate
 * - x: Prey population
 * - y: Predator population
 */
export const lotkaVolterraSystem: ODESystem = {
  id: 'lotka-volterra',
  name: 'Lotka-Volterra',
  description: 'Predator-prey population dynamics model',
  stateVariables: ['Prey', 'Predator'],
  parameters: [
    {
      name: 'alpha',
      label: 'α (Prey Growth Rate)',
      min: 0,
      max: 3,
      step: 0.1,
      default: 1.5,
    },
    {
      name: 'beta',
      label: 'β (Predation Rate)',
      min: 0,
      max: 2,
      step: 0.1,
      default: 1.0,
    },
    {
      name: 'delta',
      label: 'δ (Predator Efficiency)',
      min: 0,
      max: 2,
      step: 0.1,
      default: 1.0,
    },
    {
      name: 'gamma',
      label: 'γ (Predator Death Rate)',
      min: 0,
      max: 5,
      step: 0.1,
      default: 3.0,
    },
  ],
  defaultInitialConditions: [10, 5],
  equations: (state: number[], params: Record<string, number>): number[] => {
    const [prey, predator] = state;
    const { alpha, beta, delta, gamma } = params;

    const dPrey = alpha * prey - beta * prey * predator;
    const dPredator = delta * prey * predator - gamma * predator;

    return [dPrey, dPredator];
  },
};
