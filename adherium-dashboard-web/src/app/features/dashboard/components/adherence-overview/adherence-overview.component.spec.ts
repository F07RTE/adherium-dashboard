import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdherenceOverviewComponent } from './adherence-overview.component';
import { DashboardService } from '../../services/dashboard.service';

// ngx-echarts uses ResizeObserver internally; polyfill for jsdom test env
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });

const mockSummary = {
  adherencePct: 89.5,
  controllerTaken: 34,
  controllerScheduled: 38,
  missedCount: 4,
  rescueCount: 6,
  avgTechniqueScore: 72.3,
  morningAvgScore: 84.6,
  eveningAvgScore: 67.1,
};

describe('AdherenceOverviewComponent', () => {
  let fixture: ComponentFixture<AdherenceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdherenceOverviewComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getSummary: () => of(mockSummary),
            getDailyBreakdown: () => of([]),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AdherenceOverviewComponent);
    await fixture.whenStable();
  });

  it('displays adherence percentage KPI', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('89.5%');
  });

  it('displays rescue count KPI', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('6');
  });
});
