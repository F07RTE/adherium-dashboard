import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { HeatmapChart } from 'echarts/charts';
import { CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DashboardService } from '../../services/dashboard.service';
import { AdherenceSummary } from '../../models/adherence-summary.model';
import { DailyBreakdown } from '../../models/daily-breakdown.model';

echarts.use([HeatmapChart, CalendarComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

type HeatmapValue = 0 | 1 | 2 | 3; // 0=green(taken), 1=amber(partial miss), 2=red(all missed), 3=rescue

function dayColor(day: DailyBreakdown): HeatmapValue {
  if (day.rescueDoses.length > 0) return 3;
  if (day.missedEvening) return day.morningDose ? 1 : 2;
  return 0;
}

@Component({
  selector: 'app-adherence-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    @if (summary()) {
      <div class="kpi-row">
        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-label">Adherence</div>
            <div class="kpi-value">{{ summary()!.adherencePct }}%</div>
            <div class="kpi-sub">{{ summary()!.controllerTaken }}/{{ summary()!.controllerScheduled }} doses</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-label">Avg Technique Score</div>
            <div class="kpi-value">{{ summary()!.avgTechniqueScore }}</div>
            <div class="kpi-sub">AM {{ summary()!.morningAvgScore }} · PM {{ summary()!.eveningAvgScore }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card rescue">
          <mat-card-content>
            <div class="kpi-label">Rescue Uses</div>
            <div class="kpi-value">{{ summary()!.rescueCount }}</div>
            <div class="kpi-sub">{{ summary()!.missedCount }} missed doses</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="chart-card">
        <mat-card-content>
          <div
            echarts
            [options]="chartOptions()"
            style="height: 180px; width: 100%;">
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .kpi-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
    .kpi-card { flex: 1; min-width: 160px; }
    .kpi-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mat-sys-on-surface-variant); }
    .kpi-value { font-size: 2rem; font-weight: 700; line-height: 1.2; margin: 4px 0; }
    .kpi-sub   { font-size: 0.8rem; color: var(--mat-sys-on-surface-variant); }
    .kpi-card.rescue .kpi-value { color: #b71c1c; }
    .chart-card { margin-bottom: 16px; }
  `],
})
export class AdherenceOverviewComponent implements OnInit {
  readonly summary = signal<AdherenceSummary | null>(null);
  readonly chartOptions = signal<EChartsOption>({});

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe(s => this.summary.set(s));
    this.dashboardService.getDailyBreakdown().subscribe(breakdown => {
      this.chartOptions.set(this.buildChartOptions(breakdown));
    });
  }

  private buildChartOptions(breakdown: DailyBreakdown[]): EChartsOption {
    const colorMap: Record<HeatmapValue, string> = {
      0: '#4caf50',  // green — all taken
      1: '#ff9800',  // amber — partial miss
      2: '#f44336',  // red   — all missed
      3: '#2196f3',  // blue  — rescue used
    };

    const data = breakdown.map(day => [day.date, dayColor(day)]);

    if (!data.length) return {};

    return {
      tooltip: { formatter: (p: any) => `${p.data[0]}: ${['Taken', 'Partial miss', 'Missed', 'Rescue'][p.data[1]]}` },
      visualMap: {
        type: 'piecewise',
        show: true,
        orient: 'horizontal',
        left: 'center',
        top: 0,
        pieces: [
          { value: 0, label: 'Taken',        color: colorMap[0] },
          { value: 1, label: 'Partial miss', color: colorMap[1] },
          { value: 2, label: 'All missed',   color: colorMap[2] },
          { value: 3, label: 'Rescue used',  color: colorMap[3] },
        ],
      },
      calendar: {
        top: 60,
        left: 40,
        right: 20,
        range: ['2025-01-06', '2025-01-24'],
        cellSize: ['auto', 20],
        dayLabel: { nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
        monthLabel: { show: true },
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data,
      }],
    };
  }
}
