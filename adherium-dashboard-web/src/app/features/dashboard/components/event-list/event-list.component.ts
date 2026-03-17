import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TechniqueRatingPipe } from '../../../../shared/pipes/technique-rating.pipe';
import { MetricBadgeComponent } from '../../../../shared/components/metric-badge/metric-badge.component';
import { DashboardService } from '../../services/dashboard.service';
import { DoseEventRow } from '../../models/dose-event-row.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [MatTableModule, TechniqueRatingPipe, MetricBadgeComponent],
  template: `
    <table mat-table [dataSource]="events()" class="event-table mat-elevation-z2">
      <ng-container matColumnDef="dateTime">
        <th mat-header-cell *matHeaderCellDef>Date / Time</th>
        <td mat-cell *matCellDef="let row">{{ formatDate(row.dateTime) }}</td>
      </ng-container>

      <ng-container matColumnDef="medicationType">
        <th mat-header-cell *matHeaderCellDef>Medication</th>
        <td mat-cell *matCellDef="let row">
          <span [class]="'med-tag med-' + row.medicationType">{{ row.medicationType }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="techniqueScore">
        <th mat-header-cell *matHeaderCellDef>Score</th>
        <td mat-cell *matCellDef="let row">
          <app-metric-badge
            [rating]="row.techniqueScore | techniqueRating:'shake_duration'">
          </app-metric-badge>
          {{ row.techniqueScore }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row
          *matRowDef="let row; columns: displayedColumns;"
          data-event-row
          (click)="selectEvent(row)"
          class="event-row">
      </tr>
    </table>
  `,
  styles: [`
    .event-table { width: 100%; margin-bottom: 16px; }
    .event-row { cursor: pointer; }
    .event-row:hover { background: var(--mat-sys-surface-variant, #f5f5f5); }
    .med-tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
    .med-controller { background: #e3f2fd; color: #1565c0; }
    .med-rescue     { background: #fce4ec; color: #880e4f; }
  `],
})
export class EventListComponent implements OnInit {
  @Output() readonly eventSelected = new EventEmitter<DoseEventRow>();

  private readonly dashboardService = inject(DashboardService);
  readonly events = signal<DoseEventRow[]>([]);
  readonly displayedColumns = ['dateTime', 'medicationType', 'techniqueScore'];

  ngOnInit(): void {
    this.dashboardService.getDoseEvents().subscribe(rows => this.events.set(rows));
  }

  selectEvent(row: DoseEventRow): void {
    this.eventSelected.emit(row);
  }

  formatDate(iso: string): string {
    return iso.substring(0, 16).replace('T', ' ');
  }
}
