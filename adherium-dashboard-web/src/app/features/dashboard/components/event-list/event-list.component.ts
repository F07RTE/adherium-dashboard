import { Component, EventEmitter, inject, OnInit, Output, signal, computed } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from '../../services/dashboard.service';
import { DailyBreakdown } from '../../models/daily-breakdown.model';
import { DoseEventRow } from '../../models/dose-event-row.model';

export interface HeatCell {
  event: DoseEventRow | null;
  missed: boolean;
  slot: 'AM' | 'PM' | 'Rescue';
  date: string;
}

function scoreClass(score: number): string {
  if (score >= 80) return 'good';
  if (score >= 60) return 'acceptable';
  return 'poor';
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [SlicePipe, MatCardModule, MatTooltipModule],
  template: `
    <mat-card class="heatmap-card">
      <mat-card-content>
        <div class="heatmap-title">Dose Technique Heatmap</div>
        <div class="heatmap-scroll">
        <div class="heatmap-grid" [style.grid-template-columns]="gridCols()">
            <!-- date header row -->
            <div class="cell label-cell corner"></div>
            @for (date of dates(); track date) {
              <div class="cell date-header">{{ date | slice:5 }}</div>
            }

            <!-- AM row -->
            <div class="cell slot-label">AM</div>
            @for (date of dates(); track date) {
              @let cell = getCell(date, 'AM');
              <div
                class="cell dose-cell"
                [class]="cellClass(cell)"
                [matTooltip]="cellTooltip(cell)"
                [attr.data-heatmap-cell]="date + '-AM'"
                (click)="cell.event && selectEvent(cell.event)">
                {{ cell.event ? cell.event.techniqueScore : '' }}
              </div>
            }

            <!-- PM row -->
            <div class="cell slot-label">PM</div>
            @for (date of dates(); track date) {
              @let cell = getCell(date, 'PM');
              <div
                class="cell dose-cell"
                [class]="cellClass(cell)"
                [matTooltip]="cellTooltip(cell)"
                [attr.data-heatmap-cell]="date + '-PM'"
                (click)="cell.event && selectEvent(cell.event)">
                {{ cell.missed ? 'missed' : (cell.event ? cell.event.techniqueScore : '') }}
              </div>
            }

            <!-- Rescue row -->
            <div class="cell slot-label">Rescue</div>
            @for (date of dates(); track date) {
              @let cell = getCell(date, 'Rescue');
              <div
                class="cell dose-cell"
                [class]="cellClass(cell)"
                [matTooltip]="cellTooltip(cell)"
                [attr.data-heatmap-cell]="date + '-Rescue'"
                (click)="cell.event && selectEvent(cell.event)">
                {{ cell.event ? cell.event.techniqueScore : '' }}
              </div>
            }
          </div>
        </div>

        <div class="legend">
          <span class="legend-swatch good"></span>Good ≥80
          <span class="legend-swatch acceptable"></span>Acceptable ≥60
          <span class="legend-swatch poor"></span>Poor &lt;60
          <span class="legend-swatch missed"></span>Missed
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .heatmap-card { margin-bottom: 16px; }
    .heatmap-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mat-sys-on-surface-variant); margin-bottom: 8px; }
    .heatmap-scroll { overflow-x: auto; }
    .heatmap-grid { display: grid; gap: 3px; width: max-content; }
    .cell { display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 0.7rem; font-weight: 500; height: 36px; }
    .corner, .date-header, .slot-label { background: transparent; color: var(--mat-sys-on-surface-variant); }
    .date-header { min-width: 44px; font-size: 0.65rem; }
    .slot-label { min-width: 52px; justify-content: flex-end; padding-right: 6px; }
    .dose-cell { min-width: 44px; cursor: default; }
    .dose-cell:not(.empty):not(.missed-cell) { cursor: pointer; }
    .good     { background: #e6f4ea; color: #1e7e34; }
    .acceptable { background: #fff8e1; color: #a16200; }
    .poor     { background: #fce8e6; color: #c5221f; }
    .missed-cell { background: #eeeeee; color: #9e9e9e; font-size: 0.6rem; }
    .empty    { background: transparent; }
    .legend { display: flex; align-items: center; gap: 12px; margin-top: 10px; font-size: 0.72rem; color: var(--mat-sys-on-surface-variant); flex-wrap: wrap; }
    .legend-swatch { display: inline-block; width: 12px; height: 12px; border-radius: 2px; }
    .legend-swatch.good { background: #e6f4ea; border: 1px solid #1e7e34; }
    .legend-swatch.acceptable { background: #fff8e1; border: 1px solid #a16200; }
    .legend-swatch.poor { background: #fce8e6; border: 1px solid #c5221f; }
    .legend-swatch.missed { background: #eeeeee; border: 1px solid #9e9e9e; }
  `],
})
export class EventListComponent implements OnInit {
  @Output() readonly eventSelected = new EventEmitter<DoseEventRow>();

  private readonly dashboardService = inject(DashboardService);
  private readonly breakdown = signal<DailyBreakdown[]>([]);
  readonly dates = signal<string[]>([]);
  readonly gridCols = computed(() => `52px repeat(${this.dates().length}, 44px)`);

  private cellMap = new Map<string, HeatCell>();

  ngOnInit(): void {
    this.dashboardService.getDailyBreakdown().subscribe(days => {
      this.breakdown.set(days);
      this.dates.set(days.map(d => d.date));
      this.buildCellMap(days);
    });
  }

  private buildCellMap(days: DailyBreakdown[]): void {
    const map = new Map<string, HeatCell>();
    for (const day of days) {
      map.set(`${day.date}-AM`, { event: day.morningDose, missed: false, slot: 'AM', date: day.date });
      map.set(`${day.date}-PM`, { event: day.eveningDose, missed: day.missedEvening, slot: 'PM', date: day.date });
      // for rescue: store first rescue event for the day (if any)
      map.set(`${day.date}-Rescue`, { event: day.rescueDoses[0] ?? null, missed: false, slot: 'Rescue', date: day.date });
    }
    this.cellMap = map;
  }

  getCell(date: string, slot: 'AM' | 'PM' | 'Rescue'): HeatCell {
    return this.cellMap.get(`${date}-${slot}`) ?? { event: null, missed: false, slot, date };
  }

  cellClass(cell: HeatCell): string {
    if (cell.missed) return 'dose-cell missed-cell';
    if (!cell.event) return 'dose-cell empty';
    return `dose-cell ${scoreClass(cell.event.techniqueScore)}`;
  }

  cellTooltip(cell: HeatCell): string {
    if (cell.missed) return `${cell.date} ${cell.slot}: Missed`;
    if (!cell.event) return '';
    return `${cell.date} ${cell.slot}: Score ${cell.event.techniqueScore}`;
  }

  selectEvent(event: DoseEventRow): void {
    this.eventSelected.emit(event);
  }
}
