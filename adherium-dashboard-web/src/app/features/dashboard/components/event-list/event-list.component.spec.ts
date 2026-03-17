import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventListComponent } from './event-list.component';
import { DashboardService } from '../../services/dashboard.service';
import { DoseEventRow } from '../../models/dose-event-row.model';

function makeDoseRow(id: string, score: number, type: 'controller' | 'rescue' = 'controller'): DoseEventRow {
  return {
    id,
    dateTime: `2025-01-${id.padStart(2, '0')}T08:00:00Z`,
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

const mockEvents: DoseEventRow[] = Array.from({ length: 40 }, (_, i) =>
  makeDoseRow(String(i + 1), 70 + (i % 30)),
);

describe('EventListComponent', () => {
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: { getDoseEvents: () => of(mockEvents) },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EventListComponent);
    await fixture.whenStable();
  });

  it('renders 40 rows in the event table', () => {
    const el: HTMLElement = fixture.nativeElement;
    const rows = el.querySelectorAll('tr[data-event-row]');
    expect(rows.length).toBe(40);
  });

  it('emits the selected event when a row is clicked', () => {
    const comp = fixture.componentInstance;
    let emitted: DoseEventRow | undefined;
    comp.eventSelected.subscribe((e: DoseEventRow) => (emitted = e));

    const el: HTMLElement = fixture.nativeElement;
    const row = el.querySelector<HTMLElement>('tr[data-event-row]')!;
    row.click();

    expect(emitted).toBeDefined();
    expect(emitted!.id).toBe(mockEvents[0].id);
  });
});
