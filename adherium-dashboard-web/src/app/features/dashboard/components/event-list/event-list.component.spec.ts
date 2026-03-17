import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventListComponent } from './event-list.component';
import { DashboardService } from '../../services/dashboard.service';
import { DoseEventRow } from '../../models/dose-event-row.model';
import { DailyBreakdown } from '../../models/daily-breakdown.model';
import type { EChartsOption } from 'echarts';

vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });

function makeDoseRow(id: string, score: number, type: 'controller' | 'rescue' = 'controller'): DoseEventRow {
  return {
    id,
    dateTime: `2025-01-06T08:00:00Z`,
    medicationType: type,
    scheduledTime: type === 'controller' ? '08:00' : null,
    techniqueScore: score,
    telemetry: {
      shake_duration: { value: 3200, unit: 'ms' },
      inspiratory_time: { value: 2900, unit: 'ms' },
      peak_inspiratory_flow_rate: { value: 65, unit: 'L/min' },
      device_orientation: { value: 10, unit: 'degrees' },
      estimated_delivered_volume: { value: 2.1, unit: 'L' },
      technique_score: score,
    },
  };
}

const mockBreakdown: DailyBreakdown[] = [
  { date: '2025-01-06', morningDose: makeDoseRow('c1', 82), eveningDose: makeDoseRow('c2', 64), rescueDoses: [], missedEvening: false },
  { date: '2025-01-07', morningDose: makeDoseRow('c3', 91), eveningDose: makeDoseRow('c4', 85), rescueDoses: [makeDoseRow('r1', 45, 'rescue')], missedEvening: false },
  { date: '2025-01-08', morningDose: makeDoseRow('c5', 73), eveningDose: null, rescueDoses: [], missedEvening: true },
];

describe('EventListComponent (dose heatmap)', () => {
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: { getDailyBreakdown: () => of(mockBreakdown) },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EventListComponent);
    await fixture.whenStable();
  });

  it('renders one heatmap cell per date+slot combination (3 dates × 3 slots = 9)', () => {
    const el: HTMLElement = fixture.nativeElement;
    const cells = el.querySelectorAll('[data-heatmap-cell]');
    expect(cells.length).toBe(9);
  });

  it('emits the selected event when an AM cell is clicked', () => {
    const comp = fixture.componentInstance;
    let emitted: DoseEventRow | undefined;
    comp.eventSelected.subscribe((e: DoseEventRow) => (emitted = e));

    const el: HTMLElement = fixture.nativeElement;
    const amCell = el.querySelector<HTMLElement>('[data-heatmap-cell="2025-01-06-AM"]')!;
    amCell.click();

    expect(emitted).toBeDefined();
    expect(emitted!.id).toBe('c1');
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
