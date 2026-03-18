import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EventDetailPanelComponent } from './event-detail-panel.component';
import { DoseEventRow } from '../../models/dose-event-row.model';

// ngx-echarts uses ResizeObserver internally; polyfill for jsdom test env
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });

const mockEvent: DoseEventRow = {
  id: 'test-001',
  dateTime: '2025-01-07T08:00:00Z',
  medicationType: 'controller',
  scheduledTime: '08:00',
  techniqueScore: 91,
  telemetry: {
    shake_duration:             { value: 3500, unit: 'ms' },
    inspiratory_time:           { value: 3100, unit: 'ms' },
    peak_inspiratory_flow_rate: { value: 68,   unit: 'L/min' },
    device_orientation:         { value: 8,    unit: 'degrees' },
    estimated_delivered_volume: { value: 2.3,  unit: 'L' },
    technique_score:            91,
  },
};

describe('EventDetailPanelComponent', () => {
  let fixture: ComponentFixture<EventDetailPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailPanelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(EventDetailPanelComponent);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();
  });

  it('emits closed output when close button is clicked', () => {
    let emitted = false;
    fixture.componentInstance.closed.subscribe(() => (emitted = true));

    const el: HTMLElement = fixture.nativeElement;
    const closeBtn = el.querySelector<HTMLElement>('[data-close-btn]')!;
    closeBtn.click();

    expect(emitted).toBe(true);
  });

  it('renders a metric row for each of the 5 telemetry metrics', () => {
    const el: HTMLElement = fixture.nativeElement;
    const metricRows = el.querySelectorAll('[data-metric-row]');
    expect(metricRows.length).toBe(5);
  });
});
