import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { AdherenceDataSource } from '../../../core/data-access/adherence.datasource';
import { DailyBreakdown } from '../models/daily-breakdown.model';

// Use the real JSON data to verify both the algorithm and the data properties
import adherenceData from '../../../../assets/adherence-data.json';

const mockDatasource = {
  getData: () => of(adherenceData as any),
};

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: AdherenceDataSource, useValue: mockDatasource },
      ],
    });
    service = TestBed.inject(DashboardService);
  });

  it('adherence rate is 34/38 = 89.5%', () => {
    let summary: any;
    service.getSummary().subscribe(s => (summary = s));
    expect(summary.adherencePct).toBe(89.5);
    expect(summary.controllerTaken).toBe(34);
    expect(summary.controllerScheduled).toBe(38);
  });

  it('morning avg technique score is higher than evening avg', () => {
    let summary: any;
    service.getSummary().subscribe(s => (summary = s));
    expect(summary.morningAvgScore).toBeGreaterThan(summary.eveningAvgScore);
  });

  it('all rescue events have scheduledTime null', () => {
    let rows: any[] = [];
    service.getDoseEvents().subscribe(r => (rows = r));
    const rescue = rows.filter(r => r.medicationType === 'rescue');
    expect(rescue.length).toBe(6);
    expect(rescue.every((r: any) => r.scheduledTime === null)).toBe(true);
  });

  it('all 4 missed events have scheduled time 20:00', () => {
    let breakdown: DailyBreakdown[] = [];
    service.getDailyBreakdown().subscribe(d => (breakdown = d));
    const missedDays = breakdown.filter(d => d.missedEvening);
    expect(missedDays.length).toBe(4);
  });

  it('all rescue events have technique score ≤ 45', () => {
    let rows: any[] = [];
    service.getDoseEvents().subscribe(r => (rows = r));
    const rescue = rows.filter(r => r.medicationType === 'rescue');
    expect(rescue.every((r: any) => r.techniqueScore <= 45)).toBe(true);
  });

  it('every rescue event is on the same day or day after a missed or low-scoring evening controller dose', () => {
    let breakdown: DailyBreakdown[] = [];
    service.getDailyBreakdown().subscribe(d => (breakdown = d));

    const dateMap = new Map(breakdown.map(d => [d.date, d]));
    const isTriggerDay = (d: DailyBreakdown | null | undefined): boolean => {
      if (!d) return false;
      return d.missedEvening || (d.eveningDose !== null && d.eveningDose.techniqueScore < 70);
    };

    const rescueDays = breakdown.filter(d => d.rescueDoses.length > 0);
    for (const day of rescueDays) {
      const prev = new Date(day.date);
      prev.setDate(prev.getDate() - 1);
      const prevDateStr = prev.toISOString().substring(0, 10);
      const prevDay = dateMap.get(prevDateStr);
      expect(
        isTriggerDay(dateMap.get(day.date)) || isTriggerDay(prevDay),
        `rescue on ${day.date} should follow a poor/missed evening dose`,
      ).toBe(true);
    }
  });
});
