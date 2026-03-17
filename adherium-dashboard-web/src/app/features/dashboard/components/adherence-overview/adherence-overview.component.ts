import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, MarkLineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DashboardService } from '../../services/dashboard.service';
import { AdherenceSummary } from '../../models/adherence-summary.model';
import { DailyBreakdown } from '../../models/daily-breakdown.model';

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent, CanvasRenderer]);

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
            style="height: 240px; width: 100%;">
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
    if (!breakdown.length) return {};

    const dates      = breakdown.map(d => d.date.slice(5));
    const amTaken    = breakdown.map(d => d.morningDose ? 1 : 0);
    const pmTaken    = breakdown.map(d => (!d.missedEvening && d.eveningDose) ? 1 : 0);
    const pmMissed   = breakdown.map(d => d.missedEvening ? 1 : 0);
    const rescueFlag = breakdown.map(d => d.rescueDoses.length > 0 ? 1 : 0);
    const amScores   = breakdown.map(d => d.morningDose?.techniqueScore ?? null);
    const pmScores   = breakdown.map(d => (!d.missedEvening && d.eveningDose) ? d.eveningDose.techniqueScore : null);

    const dailyMean: (number | null)[] = breakdown.map(d => {
      const vals = [d.morningDose?.techniqueScore, d.eveningDose?.techniqueScore].filter((v): v is number => v != null);
      return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length * 10) / 10 : null;
    });

    return {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['AM Taken', 'PM Taken', 'PM Missed', 'Rescue', 'AM Score', 'PM Score', 'Daily Avg'],
        bottom: 0,
        itemHeight: 10,
        textStyle: { fontSize: 11 },
      },
      grid: { top: 16, left: 48, right: 56, bottom: 52 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { fontSize: 10, rotate: 45 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Doses',
          min: 0, max: 2, interval: 1,
          nameTextStyle: { fontSize: 10 },
          axisLabel: { fontSize: 10 },
        },
        {
          type: 'value',
          name: 'Score',
          min: 0, max: 100,
          nameTextStyle: { fontSize: 10 },
          axisLabel: { fontSize: 10 },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'AM Taken',
          type: 'bar',
          stack: 'doses',
          data: amTaken,
          itemStyle: { color: '#2e7d32' },
          barMaxWidth: 20,
        },
        {
          name: 'PM Taken',
          type: 'bar',
          stack: 'doses',
          data: pmTaken,
          itemStyle: { color: '#81c784' },
          barMaxWidth: 20,
        },
        {
          name: 'PM Missed',
          type: 'bar',
          stack: 'doses',
          data: pmMissed,
          itemStyle: { color: '#ef9a9a' },
          barMaxWidth: 20,
        },
        {
          name: 'Rescue',
          type: 'bar',
          data: rescueFlag,
          yAxisIndex: 0,
          itemStyle: { color: '#ff9800' },
          barMaxWidth: 8,
          barGap: '20%',
        },
        {
          name: 'AM Score',
          type: 'line',
          yAxisIndex: 1,
          data: amScores,
          smooth: true,
          showSymbol: false,
          lineStyle: { color: '#1565c0', width: 1.5, opacity: 0.5 },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              { yAxis: 80, lineStyle: { color: '#2e7d32', type: 'dashed', width: 1 }, label: { formatter: '80', fontSize: 9 } },
              { yAxis: 60, lineStyle: { color: '#f57f17', type: 'dashed', width: 1 }, label: { formatter: '60', fontSize: 9 } },
            ],
          },
        },
        {
          name: 'PM Score',
          type: 'line',
          yAxisIndex: 1,
          data: pmScores,
          smooth: true,
          showSymbol: false,
          lineStyle: { color: '#42a5f5', width: 1.5, type: 'dashed', opacity: 0.5 },
        },
        {
          name: 'Daily Avg',
          type: 'line',
          yAxisIndex: 1,
          data: dailyMean,
          smooth: true,
          showSymbol: false,
          lineStyle: { color: '#6a1b9a', width: 2.5 },
          z: 10,
        },
      ],
    };
  }
}
