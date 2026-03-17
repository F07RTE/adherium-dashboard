import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DashboardService } from '../../services/dashboard.service';
import { DailyBreakdown } from '../../models/daily-breakdown.model';

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-technique-quality',
  standalone: true,
  imports: [MatCardModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    <mat-card class="chart-card">
      <mat-card-content>
        <div class="chart-title">Technique Quality</div>
        <div
          echarts
          [options]="chartOptions()"
          style="height: 360px; width: 100%;">
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .chart-card { margin-bottom: 16px; }
    .chart-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 8px;
    }
  `],
})
export class TechniqueQualityComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly chartOptions = signal<EChartsOption>({});

  ngOnInit(): void {
    this.dashboardService.getDailyBreakdown().subscribe(breakdown => {
      this.chartOptions.set(this.buildChartOptions(breakdown));
    });
  }

  private buildChartOptions(breakdown: DailyBreakdown[]): EChartsOption {
    const dates = breakdown.map(d => d.date);
    const amScores = breakdown.map(d => d.morningDose?.techniqueScore ?? 0);
    const pmScores = breakdown.map(d =>
      d.missedEvening ? 0 : (d.eveningDose?.techniqueScore ?? 0),
    );

    const rescueData: [string, number][] = breakdown.flatMap(day =>
      day.rescueDoses.map(r => [day.date, r.techniqueScore] as [string, number]),
    );

    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Morning (AM)', 'Evening (PM)', 'AM Trend', 'Rescue'] },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { rotate: 45, fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: 'Score',
      },
      series: [
        {
          name: 'Morning (AM)',
          type: 'bar',
          data: amScores,
          itemStyle: { color: '#1976D2' },
        },
        {
          name: 'Evening (PM)',
          type: 'bar',
          data: pmScores,
          itemStyle: { color: '#42A5F5' },
        },
        {
          name: 'AM Trend',
          type: 'line',
          data: amScores,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: '#0D47A1' },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: 80,
                name: 'Good (≥80)',
                lineStyle: { color: '#2E7D32', type: 'dashed', width: 1 },
                label: { formatter: 'Good ≥80', position: 'end' },
              },
              {
                yAxis: 60,
                name: 'Acceptable (≥60)',
                lineStyle: { color: '#F57F17', type: 'dashed', width: 1 },
                label: { formatter: 'Acceptable ≥60', position: 'end' },
              },
            ],
          },
        },
        {
          name: 'Rescue',
          type: 'scatter',
          data: rescueData,
          symbolSize: 12,
          itemStyle: { color: '#E53935' },
        },
      ],
    };
  }
}
