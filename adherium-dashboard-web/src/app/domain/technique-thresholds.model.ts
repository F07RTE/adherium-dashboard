export interface ThresholdBand {
  value: number;
  unit: string;
}

export interface MetricThreshold {
  good: ThresholdBand;
  acceptable: ThresholdBand;
  description: string;
}

export interface TechniqueThresholds {
  shake_duration: MetricThreshold;
  inspiratory_time: MetricThreshold;
  peak_inspiratory_flow_rate: MetricThreshold;
  device_orientation: MetricThreshold;
  estimated_delivered_volume: MetricThreshold;
}
