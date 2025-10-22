import { ODESystem } from '@/types/simulation';
import { lorenzSystem } from './lorenz';
import { lotkaVolterraSystem } from './lotka-volterra';

/**
 * Registry of all available ODE systems
 */
export const systems: ODESystem[] = [lorenzSystem, lotkaVolterraSystem];

/**
 * Get an ODE system by its ID
 * @param id - The unique identifier of the system
 * @returns The ODE system if found, undefined otherwise
 */
export function getSystemById(id: string): ODESystem | undefined {
  return systems.find((system) => system.id === id);
}

/**
 * Export individual systems for direct access
 */
export { lorenzSystem, lotkaVolterraSystem };
