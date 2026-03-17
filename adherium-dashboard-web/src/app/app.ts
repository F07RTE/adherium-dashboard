import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PatientHeaderComponent } from './features/dashboard/components/patient-header/patient-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, PatientHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Adherium Dashboard';
}
