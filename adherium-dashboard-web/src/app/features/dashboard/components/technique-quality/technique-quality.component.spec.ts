import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { TechniqueQualityComponent } from './technique-quality.component';
import { DashboardService } from '../../services/dashboard.service';
import { DailyBreakdown } from '../../models/daily-breakdown.model';
import { DoseEventRow } from '../../models/dose-event-row.model';
import type { EChartsOption } from 'echarts';

// ngx-echarts uses ResizeObserver internally; polyfill for jsdom test env
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });

function makeDose(id: string, score: number, type: 'controller' | 'rescue' = 'controller'): DoseEventRow {
  return {
    id,
    dateTime: '2025-01-06T08:00:00Z',
    medicationType: type,
    scheduledTime: type === 'controller' ? '08:00' : null,
    techniqueScore: score,
    telemetry: {} as never,
  };
}

const mockBreakdown: DailyBreakdown[] = [
  { date: '2025-01-06', morningDose: makeDose('c1', 82), eveningDose: makeDose('c2', 64), rescueDoses: [], missedEvening: false },
  { date: '2025-01-07', morningDose: makeDose('c3', 91), eveningDose: makeDose('c4', 85), rescueDoses: [makeDose('r1', 45, 'rescue')], missedEvening: false },
  { date: '2025-01-08', morningDose: makeDose('c5', 73), eveningDose: null, rescueDoses: [], missedEvening: true },
];

describe('TechniqueQualityComponent', () => {
  let fixture: ComponentFixture<TechniqueQualityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechniqueQualityComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: { getDailyBreakdown: () => of(mockBreakdown) },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechniqueQualityComponent);
    await fixture.whenStable();
  });

  it('AM series average is higher than PM series average', () => {
    const comp = fixture.componentInstance;
    const opts = comp.chartOptions() as EChartsOption;
    const series = opts.series as Array<{ name: string; data: number[] }>;

    const amSeries = series.find(s => s.name === 'Morning (AM)')!;
    const pmSeries = series.find(s => s.name === 'Evening (PM)')!;

    const amAvg = amSeries.data.filter(v => v > 0).reduce((s, v) => s + v, 0)
      / amSeries.data.filter(v => v > 0).length;
    const pmAvg = pmSeries.data.filter(v => v > 0).reduce((s, v) => s + v, 0)
      / pmSeries.data.filter(v => v > 0).length;

    // AM: [82, 91, 73] avg=82  PM: [64, 85] avg=74.5
    expect(amAvg).toBeGreaterThan(pmAvg);
  });

  it('rescue event days have a distinct entry in the rescue scatter series', () => {
    const comp = fixture.componentInstance;
    const opts = comp.chartOptions() as EChartsOption;
    const series = opts.series as Array<{ name: string; data: unknown[] }>;

    const rescueSeries = series.find(s => s.name === 'Rescue')!;

    expect(rescueSeries.data).toHaveLength(1);
    const point = rescueSeries.data[0] as [string, number];
    expect(point[0]).toBe('2025-01-07');
    expect(point[1]).toBe(45);
  });
});
