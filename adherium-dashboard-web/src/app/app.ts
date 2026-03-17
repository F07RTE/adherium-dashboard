import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PatientHeaderComponent } from './features/dashboard/components/patient-header/patient-header.component';
import { AdherenceOverviewComponent } from './features/dashboard/components/adherence-overview/adherence-overview.component';
import { TechniqueQualityComponent } from './features/dashboard/components/technique-quality/technique-quality.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, PatientHeaderComponent, AdherenceOverviewComponent, TechniqueQualityComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Adherium Dashboard';
}
