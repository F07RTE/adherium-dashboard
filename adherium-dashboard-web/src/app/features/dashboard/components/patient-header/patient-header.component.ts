import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AdherenceDataSource } from '../../../../core/data-access/adherence.datasource';
import { Patient } from '../../../../domain/patient.model';
import { Medication } from '../../../../domain/medication.model';

@Component({
  selector: 'app-patient-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  template: `
    @if (patient()) {
      <mat-card class="patient-header-card">
        <mat-card-content>
          <div class="patient-row">
            <div class="patient-avatar">{{ patient()!.demographics.initials }}</div>
            <div class="patient-info">
              <div class="patient-meta">
                <span class="initials">{{ patient()!.demographics.initials }}</span>
                <span class="age">{{ patient()!.demographics.age.value }} {{ patient()!.demographics.age.unit }}</span>
              </div>
              <div class="condition">{{ patient()!.condition.name }}</div>
              <div class="medication-pills">
                @for (med of medications(); track med.body.medication_id) {
                  <mat-chip [class]="med.body.medication_type">
                    {{ med.body.medication_name }}
                  </mat-chip>
                }
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .patient-header-card { margin-bottom: 16px; }
    .patient-row { display: flex; align-items: center; gap: 16px; }
    .patient-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 1rem; flex-shrink: 0;
    }
    .patient-info { display: flex; flex-direction: column; gap: 4px; }
    .patient-meta { display: flex; gap: 12px; align-items: baseline; }
    .initials { font-size: 1.25rem; font-weight: 600; }
    .age { color: var(--mat-sys-on-surface-variant); font-size: 0.9rem; }
    .condition { color: var(--mat-sys-on-surface-variant); font-size: 0.85rem; }
    .medication-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
    mat-chip.controller { --mdc-chip-label-text-color: #1565c0; background: #e3f2fd; }
    mat-chip.rescue    { --mdc-chip-label-text-color: #b71c1c; background: #fce4ec; }
  `],
})
export class PatientHeaderComponent implements OnInit {
  readonly patient = signal<Patient | null>(null);
  readonly medications = signal<Medication[]>([]);

  constructor(private readonly datasource: AdherenceDataSource) {}

  ngOnInit(): void {
    this.datasource.getData().subscribe(data => {
      this.patient.set(data.patient);
      this.medications.set(data.medications);
    });
  }
}
