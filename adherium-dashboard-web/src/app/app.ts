import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PatientHeaderComponent } from './features/dashboard/components/patient-header/patient-header.component';
import { AdherenceOverviewComponent } from './features/dashboard/components/adherence-overview/adherence-overview.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, PatientHeaderComponent, AdherenceOverviewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Adherium Dashboard';
}
