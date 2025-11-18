/**
 * @gaia-tools/coeus-api-client
 * 
 * Coeus - TypeScript client SDK for the Gaia astrological charting backend API.
 * Named after Coeus, the Titan of intellect and inquiry in Greek mythology.
 * 
 * @example
 * ```typescript
 * import { createApiClient } from '@gaia-tools/coeus-api-client';
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
export * from './ephemeris_types';

// API module exports (for advanced usage)
export * from './apis/charts';
export * from './apis/instances';
export * from './apis/wheels';
export * from './apis/render';

// Utility exports
export { buildIndexes } from './utils/buildIndexes';
export { aspectService, AspectService } from './utils/aspect-service';
export type {
  AspectSettings,
  AspectCore,
  AspectObjectRef,
  AspectPair,
  AspectSet,
} from './utils/aspect-service';
export { WheelAssembler } from './utils/wheel-assembler';
export { convertEphemerisToRender } from './utils/convert-ephemeris';

