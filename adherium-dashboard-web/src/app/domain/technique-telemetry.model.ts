export interface MeasuredValue {
  value: number;
  unit: string;
}

export interface InhalerTechniqueTelemetry {
  shake_duration: MeasuredValue;
  inspiratory_time: MeasuredValue;
  peak_inspiratory_flow_rate: MeasuredValue;
  device_orientation: MeasuredValue;
  estimated_delivered_volume: MeasuredValue;
  technique_score: number;
}
