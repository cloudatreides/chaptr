import { describe, it, expect } from 'vitest';

describe('cropImage module', () => {
  it('exports getCroppedImg function', async () => {
    const { getCroppedImg } = await import('../lib/cropImage');
    expect(typeof getCroppedImg).toBe('function');
  });
});
