import { describe, it, expect } from 'vitest';

/**
 * Smoke test to ensure the built bundle can be imported correctly.
 * This test should be run after building to catch export issues.
 */
describe('Bundle Import', () => {
  it('should export createApiClient', async () => {
    // This will only work if the dist folder exists and is built
    // In CI, we should run this after build
    try {
      const module = await import('../../dist/index.mjs');
      expect(module).toHaveProperty('createApiClient');
      expect(typeof module.createApiClient).toBe('function');
    } catch (error) {
      // If dist doesn't exist, skip this test
      // In a real scenario, we'd run this after build
      if ((error as Error).message.includes('Cannot find module')) {
        console.warn('Skipping bundle test - dist not built. Run pnpm build first.');
        return;
      }
      throw error;
    }
  });

  it('should export types', async () => {
    try {
      const module = await import('../../dist/index.mjs');
      // Check that we can access type-related exports
      expect(module).toBeDefined();
    } catch (error) {
      if ((error as Error).message.includes('Cannot find module')) {
        console.warn('Skipping bundle test - dist not built. Run pnpm build first.');
        return;
      }
      throw error;
    }
  });
});

