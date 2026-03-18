import { Component, EventEmitter, input, OnChanges, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TechniqueRatingPipe } from '../../../../shared/pipes/technique-rating.pipe';
import { MetricBadgeComponent } from '../../../../shared/components/metric-badge/metric-badge.component';
import { DoseEventRow } from '../../models/dose-event-row.model';
import { InhalerTechniqueTelemetry, MeasuredValue } from '../../../../domain/technique-telemetry.model';

echarts.use([RadarChart, RadarComponent, TooltipComponent, CanvasRenderer]);

type MetricKey = keyof Omit<InhalerTechniqueTelemetry, 'technique_score'>;

const METRIC_LABELS: Record<MetricKey, string> = {
  shake_duration:             'Shake Duration',
  inspiratory_time:           'Inspiratory Time',
  peak_inspiratory_flow_rate: 'Peak Flow Rate',
  device_orientation:         'Device Orientation',
  estimated_delivered_volume: 'Delivered Volume',
};

const METRIC_MAX: Record<MetricKey, number> = {
  shake_duration:             5000,
  inspiratory_time:           5000,
  peak_inspiratory_flow_rate: 100,
  device_orientation:         90,
  estimated_delivered_volume: 3,
};

const METRICS: MetricKey[] = [
  'shake_duration',
  'inspiratory_time',
  'peak_inspiratory_flow_rate',
  'device_orientation',
  'estimated_delivered_volume',
];

@Component({
  selector: 'app-event-detail-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDividerModule, NgxEchartsDirective, TechniqueRatingPipe, MetricBadgeComponent],
  providers: [provideEchartsCore({ echarts })],
  template: `
    @if (visible()) {
      <div class="panel-overlay" (click)="close()"></div>
      <aside class="detail-panel">
        <div class="panel-header">
          <span class="panel-title">Event Detail</span>
          <button mat-icon-button data-close-btn (click)="close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        @if (event()) {
          <div class="panel-body">
            <div class="score-label">Technique Score: <strong>{{ event()!.techniqueScore }}</strong></div>
            <div class="date-label">{{ formatDate(event()!.dateTime) }} · {{ event()!.medicationType }}</div>

            <mat-divider class="divider" />

            <div echarts [options]="radarOptions()" style="height: 240px; width: 100%;"></div>

            <mat-divider class="divider" />

            @for (metric of metrics; track metric) {
              <div class="metric-row" data-metric-row>
                <span class="metric-name">{{ metricLabel(metric) }}</span>
                <span class="metric-value">
                  {{ event()!.telemetry[metric].value }}
                  <small>{{ event()!.telemetry[metric].unit }}</small>
                </span>
                <app-metric-badge
                  [rating]="event()!.telemetry[metric].value | techniqueRating:metric">
                </app-metric-badge>
              </div>
            }
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    .panel-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.2); z-index: 100;
    }
    .detail-panel {
      position: fixed; top: 0; right: 0; bottom: 0; width: 400px;
      background: white; z-index: 101; overflow-y: auto; box-shadow: -4px 0 16px rgba(0,0,0,0.12);
      display: flex; flex-direction: column;
    }
    .panel-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-bottom: 1px solid var(--mat-sys-outline-variant, #ddd);
      position: sticky; top: 0; background: white; z-index: 1;
    }
    .panel-title { font-size: 1rem; font-weight: 600; }
    .panel-body { padding: 16px; }
    .score-label { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; }
    .date-label { font-size: 0.8rem; text-transform: capitalize; color: var(--mat-sys-on-surface-variant, #666); margin-bottom: 12px; }
    .divider { margin: 12px 0; }
    .metric-row {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 0; border-bottom: 1px solid var(--mat-sys-outline-variant, #eee);
    }
    .metric-name { flex: 1; font-size: 0.85rem; }
    .metric-value { font-size: 0.85rem; font-weight: 500; text-align: right; min-width: 80px; }
    .metric-value small { font-size: 0.7rem; color: var(--mat-sys-on-surface-variant, #888); margin-left: 2px; }
  `],
})
export class EventDetailPanelComponent implements OnChanges {
  readonly event = input<DoseEventRow | null>(null);
  readonly visible = input<boolean>(false);
  @Output() readonly closed = new EventEmitter<void>();

  readonly radarOptions = signal<EChartsOption>({});
  readonly metrics = METRICS;

  ngOnChanges(): void {
    const ev = this.event();
    if (ev) {
      this.radarOptions.set(this.buildRadarOptions(ev.telemetry));
    }
  }

  close(): void {
    this.closed.emit();
  }

  metricLabel(key: MetricKey): string {
    return METRIC_LABELS[key];
  }

  formatDate(iso: string): string {
    return iso.substring(0, 16).replace('T', ' ');
  }

  private buildRadarOptions(t: InhalerTechniqueTelemetry): EChartsOption {
    return {
      tooltip: {},
      radar: {
        indicator: METRICS.map(m => ({ name: METRIC_LABELS[m], max: METRIC_MAX[m] })),
      },
      series: [{
        type: 'radar',
        data: [{
          value: METRICS.map(m => (t[m] as MeasuredValue).value),
          name: 'Technique',
          areaStyle: { opacity: 0.2 },
        }],
      }],
    };
  }
}
