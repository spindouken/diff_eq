/**
 * ODE Solver using the Fourth-Order Runge-Kutta (RK4) method
 */

import { Trajectory, TrajectoryPoint, SolverConfig, ODESystem, SolverResult } from '@/types/simulation';

/**
 * Vector utility functions for arbitrary-length arrays
 */

/**
 * Add two vectors element-wise
 * @param a First vector
 * @param b Second vector
 * @returns Sum of the two vectors
 */
export function add(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} !== ${b.length}`);
  }
  return a.map((val, i) => val + b[i]);
}

/**
 * Scale a vector by a scalar value
 * @param v Vector to scale
 * @param scalar Scalar multiplier
 * @returns Scaled vector
 */
export function scale(v: number[], scalar: number): number[] {
  return v.map((val) => val * scalar);
}

/**
 * Subtract vector b from vector a element-wise
 * @param a First vector
 * @param b Second vector to subtract
 * @returns Difference of the two vectors
 */
export function subtract(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} !== ${b.length}`);
  }
  return a.map((val, i) => val - b[i]);
}

/**
 * Compute the dot product of two vectors
 * @param a First vector
 * @param b Second vector
 * @returns Dot product
 */
export function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} !== ${b.length}`);
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Compute the magnitude (L2 norm) of a vector
 * @param v Vector
 * @returns Magnitude
 */
export function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

/**
 * RK4 Algorithm Implementation
 */

/**
 * Perform a single RK4 integration step
 * @param f ODE function that returns derivatives
 * @param state Current state vector
 * @param params System parameters
 * @param dt Time step
 * @returns New state after one RK4 step
 */
export function rk4Step(
  f: (state: number[], params: Record<string, number>) => number[],
  state: number[],
  params: Record<string, number>,
  dt: number
): number[] {
  // Compute k1 = f(state)
  const k1 = f(state, params);
  
  // Compute k2 = f(state + dt/2 * k1)
  const k2 = f(add(state, scale(k1, dt / 2)), params);
  
  // Compute k3 = f(state + dt/2 * k2)
  const k3 = f(add(state, scale(k2, dt / 2)), params);
  
  // Compute k4 = f(state + dt * k3)
  const k4 = f(add(state, scale(k3, dt)), params);
  
  // Compute new state = state + dt/6 * (k1 + 2*k2 + 2*k3 + k4)
  const weightedSum = add(
    add(k1, scale(k2, 2)),
    add(scale(k3, 2), k4)
  );
  
  return add(state, scale(weightedSum, dt / 6));
}

/**
 * Validate solver configuration parameters
 * @param config Solver configuration to validate
 * @param system ODE system definition
 * @returns Error message if invalid, null if valid
 */
function validateSolverConfig(config: SolverConfig, system: ODESystem): string | null {
  const { dt, tMax, initialConditions, parameters } = config;
  
  // Validate time step
  if (!isFinite(dt)) {
    return 'Time step dt must be a finite number';
  }
  if (dt <= 0) {
    return 'Time step dt must be positive';
  }
  if (dt > tMax) {
    return 'Time step dt cannot be larger than maximum time tMax';
  }
  
  // Validate maximum time
  if (!isFinite(tMax)) {
    return 'Maximum time tMax must be a finite number';
  }
  if (tMax <= 0) {
    return 'Maximum time tMax must be positive';
  }
  
  // Validate initial conditions
  if (!Array.isArray(initialConditions)) {
    return 'Initial conditions must be an array';
  }
  if (initialConditions.length !== system.stateVariables.length) {
    return `Initial conditions length (${initialConditions.length}) must match ` +
           `number of state variables (${system.stateVariables.length})`;
  }
  if (initialConditions.some((val) => !isFinite(val))) {
    return 'All initial conditions must be finite numbers';
  }
  
  // Validate parameters
  if (typeof parameters !== 'object' || parameters === null) {
    return 'Parameters must be an object';
  }
  
  // Check that all required parameters are present
  const missingParams = system.parameters
    .map(p => p.name)
    .filter(name => !(name in parameters));
  if (missingParams.length > 0) {
    return `Missing required parameters: ${missingParams.join(', ')}`;
  }
  
  // Validate parameter values
  for (const param of system.parameters) {
    const value = parameters[param.name];
    if (!isFinite(value)) {
      return `Parameter ${param.name} must be a finite number`;
    }
    if (value < param.min || value > param.max) {
      return `Parameter ${param.name} (${value}) is outside valid range [${param.min}, ${param.max}]`;
    }
  }
  
  return null;
}

/**
 * Check if a state vector contains invalid values (NaN or Infinity)
 * @param state State vector to check
 * @returns True if state contains NaN or Infinity
 */
function hasInvalidValues(state: number[]): boolean {
  return state.some((val) => !isFinite(val));
}

/**
 * Solve an ODE system over a time range using RK4
 * @param system ODE system definition
 * @param config Solver configuration
 * @returns Trajectory containing time points and state values
 * @throws Error if validation fails or numerical instability is detected
 */
export function solveODE(system: ODESystem, config: SolverConfig): Trajectory {
  const { dt, tMax, initialConditions, parameters } = config;
  
  // Validate inputs
  const validationError = validateSolverConfig(config, system);
  if (validationError) {
    throw new Error(validationError);
  }
  
  const points: TrajectoryPoint[] = [];
  let t = 0;
  let state = [...initialConditions]; // Copy to avoid mutation
  
  // Validate initial state
  if (hasInvalidValues(state)) {
    throw new Error('Initial conditions contain NaN or Infinity');
  }
  
  // Store initial point
  points.push({ t, state: [...state] });
  
  // Integrate over time
  const maxSteps = Math.ceil(tMax / dt) + 1;
  let stepCount = 0;
  
  while (t < tMax && stepCount < maxSteps) {
    try {
      // Perform one RK4 step
      state = rk4Step(system.equations, state, parameters, dt);
      t += dt;
      stepCount++;
      
      // Check for numerical instability
      if (hasInvalidValues(state)) {
        throw new Error(
          `Numerical instability detected at t=${t.toFixed(2)}. ` +
          'State contains NaN or Infinity. ' +
          'Try reducing the time step or adjusting parameters.'
        );
      }
      
      // Store point
      points.push({ t, state: [...state] });
    } catch (error) {
      // Re-throw with additional context if it's not already our error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unexpected error during integration at t=${t.toFixed(2)}: ${error}`);
    }
  }
  
  // Safety check for infinite loops
  if (stepCount >= maxSteps) {
    throw new Error('Maximum number of integration steps exceeded');
  }
  
  return {
    points,
    variables: system.stateVariables,
  };
}

/**
 * Solve an ODE system with error handling that returns a result type
 * @param system ODE system definition
 * @param config Solver configuration
 * @returns SolverResult containing either trajectory or error message
 */
export function solveODESafe(system: ODESystem, config: SolverConfig): SolverResult {
  try {
    const trajectory = solveODE(system, config);
    return { success: true, trajectory };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
