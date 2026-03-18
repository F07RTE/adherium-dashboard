import { describe, it, expect, beforeEach } from 'vitest';
import { TechniqueRatingPipe } from './technique-rating.pipe';

describe('TechniqueRatingPipe', () => {
  let pipe: TechniqueRatingPipe;

  beforeEach(() => {
    pipe = new TechniqueRatingPipe();
  });

  // shake_duration: good ≥ 3000ms, acceptable ≥ 2000ms, poor < 2000ms
  it('shake_duration 3200ms → good', () => {
    expect(pipe.transform(3200, 'shake_duration')).toBe('good');
  });

  it('shake_duration 2500ms → acceptable', () => {
    expect(pipe.transform(2500, 'shake_duration')).toBe('acceptable');
  });

  it('shake_duration 1500ms → poor', () => {
    expect(pipe.transform(1500, 'shake_duration')).toBe('poor');
  });

  // device_orientation: inverted — good ≤ 15deg, acceptable ≤ 30deg, poor > 30deg
  it('device_orientation 10deg → good (inverted)', () => {
    expect(pipe.transform(10, 'device_orientation')).toBe('good');
  });

  it('device_orientation 20deg → acceptable (inverted)', () => {
    expect(pipe.transform(20, 'device_orientation')).toBe('acceptable');
  });

  it('device_orientation 40deg → poor (inverted)', () => {
    expect(pipe.transform(40, 'device_orientation')).toBe('poor');
  });
});
