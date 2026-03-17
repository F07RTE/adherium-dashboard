import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PatientHeaderComponent } from './features/dashboard/components/patient-header/patient-header.component';
import { AdherenceOverviewComponent } from './features/dashboard/components/adherence-overview/adherence-overview.component';
import { EventListComponent } from './features/dashboard/components/event-list/event-list.component';
import { EventDetailPanelComponent } from './features/dashboard/components/event-detail-panel/event-detail-panel.component';
import { DoseEventRow } from './features/dashboard/models/dose-event-row.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, PatientHeaderComponent, AdherenceOverviewComponent, EventListComponent, EventDetailPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Adherium Dashboard';
  protected readonly selectedEvent = signal<DoseEventRow | null>(null);
  protected readonly detailVisible = signal(false);

  openDetail(event: DoseEventRow): void {
    this.selectedEvent.set(event);
    this.detailVisible.set(true);
  }

  closeDetail(): void {
    this.detailVisible.set(false);
  }
}
