/**
 * @gaia/api-client
 * 
 * TypeScript client SDK for the Gaia astrological charting backend API.
 * 
 * @example
 * ```typescript
 * import { createApiClient } from '@gaia/api-client';
 * 
 * const api = createApiClient('http://localhost:8000/api');
 * const charts = await api.charts.list();
 * ```
 */

// Main client factory
export { createApiClient, type ApiClient } from './client';

// Type exports
export * from './types';
export * from './render_types';

// API module exports (for advanced usage)
export * from './apis/charts';
export * from './apis/instances';
export * from './apis/wheels';

// Utility exports
export { buildIndexes } from './utils/buildIndexes';

