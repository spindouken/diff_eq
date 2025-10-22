/**
 * Core type definitions for the ODE simulation system
 */

/**
 * Represents a single point in the trajectory
 */
export interface TrajectoryPoint {
  t: number;
  state: number[];
}

/**
 * Represents a complete trajectory with metadata
 */
export interface Trajectory {
  points: TrajectoryPoint[];
  variables: string[];
}

/**
 * Result type for ODE solver that can contain either a trajectory or an error
 */
export type SolverResult = 
  | { success: true; trajectory: Trajectory }
  | { success: false; error: string };

/**
 * Defines a parameter for an ODE system
 */
export interface Parameter {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

/**
 * Configuration for the ODE solver
 */
export interface SolverConfig {
  dt: number;
  tMax: number;
  initialConditions: number[];
  parameters: Record<string, number>;
}

/**
 * Defines a complete ODE system
 */
export interface ODESystem {
  id: string;
  name: string;
  description: string;
  stateVariables: string[];
  parameters: Parameter[];
  defaultInitialConditions: number[];
  equations: (state: number[], params: Record<string, number>) => number[];
}

/**
 * Type guard to check if an object is a valid TrajectoryPoint
 */
export function isTrajectoryPoint(obj: unknown): obj is TrajectoryPoint {
  if (typeof obj !== 'object' || obj === null) return false;
  const point = obj as TrajectoryPoint;
  return (
    typeof point.t === 'number' &&
    Array.isArray(point.state) &&
    point.state.every((val) => typeof val === 'number')
  );
}

/**
 * Type guard to check if an object is a valid Trajectory
 */
export function isTrajectory(obj: unknown): obj is Trajectory {
  if (typeof obj !== 'object' || obj === null) return false;
  const trajectory = obj as Trajectory;
  return (
    Array.isArray(trajectory.points) &&
    trajectory.points.every(isTrajectoryPoint) &&
    Array.isArray(trajectory.variables) &&
    trajectory.variables.every((v) => typeof v === 'string')
  );
}

/**
 * Type guard to check if an object is a valid Parameter
 */
export function isParameter(obj: unknown): obj is Parameter {
  if (typeof obj !== 'object' || obj === null) return false;
  const param = obj as Parameter;
  return (
    typeof param.name === 'string' &&
    typeof param.label === 'string' &&
    typeof param.min === 'number' &&
    typeof param.max === 'number' &&
    typeof param.step === 'number' &&
    typeof param.default === 'number'
  );
}

/**
 * Type guard to check if an object is a valid SolverConfig
 */
export function isSolverConfig(obj: unknown): obj is SolverConfig {
  if (typeof obj !== 'object' || obj === null) return false;
  const config = obj as SolverConfig;
  return (
    typeof config.dt === 'number' &&
    typeof config.tMax === 'number' &&
    Array.isArray(config.initialConditions) &&
    config.initialConditions.every((val) => typeof val === 'number') &&
    typeof config.parameters === 'object' &&
    config.parameters !== null &&
    Object.values(config.parameters).every((val) => typeof val === 'number')
  );
}

/**
 * Type guard to check if an object is a valid ODESystem
 */
export function isODESystem(obj: unknown): obj is ODESystem {
  if (typeof obj !== 'object' || obj === null) return false;
  const system = obj as ODESystem;
  return (
    typeof system.id === 'string' &&
    typeof system.name === 'string' &&
    typeof system.description === 'string' &&
    Array.isArray(system.stateVariables) &&
    system.stateVariables.every((v) => typeof v === 'string') &&
    Array.isArray(system.parameters) &&
    system.parameters.every(isParameter) &&
    Array.isArray(system.defaultInitialConditions) &&
    system.defaultInitialConditions.every((val) => typeof val === 'number') &&
    typeof system.equations === 'function'
  );
}
