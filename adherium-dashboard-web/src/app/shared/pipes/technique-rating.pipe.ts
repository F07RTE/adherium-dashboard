import { Pipe, PipeTransform } from '@angular/core';

export type TechniqueRating = 'good' | 'acceptable' | 'poor';

type MetricName =
  | 'shake_duration'
  | 'inspiratory_time'
  | 'peak_inspiratory_flow_rate'
  | 'device_orientation'
  | 'estimated_delivered_volume';

// Thresholds from assets/adherence-data.json -> technique_thresholds
// good = minimum value for "good" (or maximum for inverted metrics)
// acceptable = minimum value for "acceptable" (or maximum for inverted metrics)
const THRESHOLDS: Record<MetricName, { good: number; acceptable: number; inverted: boolean }> = {
  shake_duration:               { good: 3000, acceptable: 2000, inverted: false },
  inspiratory_time:             { good: 2800, acceptable: 2000, inverted: false },
  peak_inspiratory_flow_rate:   { good: 60,   acceptable: 45,   inverted: false },
  device_orientation:           { good: 15,   acceptable: 30,   inverted: true  },
  estimated_delivered_volume:   { good: 1.8,  acceptable: 1.2,  inverted: false },
};

@Pipe({ name: 'techniqueRating', pure: true, standalone: true })
export class TechniqueRatingPipe implements PipeTransform {
  transform(value: number, metric: MetricName): TechniqueRating {
    const t = THRESHOLDS[metric];
    if (!t) return 'poor';
    if (t.inverted) {
      if (value <= t.good) return 'good';
      if (value <= t.acceptable) return 'acceptable';
      return 'poor';
    }
    if (value >= t.good) return 'good';
    if (value >= t.acceptable) return 'acceptable';
    return 'poor';
  }
}
