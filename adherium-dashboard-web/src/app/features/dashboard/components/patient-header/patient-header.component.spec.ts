import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { PatientHeaderComponent } from './patient-header.component';
import { AdherenceDataSource } from '../../../../core/data-access/adherence.datasource';

const mockData = {
  patient: {
    external_id: 'PAT-2847',
    demographics: { initials: 'J.M.', age: { value: 42, unit: 'yr' } },
    condition: { name: 'Moderate Persistent Asthma', code: { system: 'SNOMED-CT', value: '195967001', display: 'Asthma' } },
  },
  medications: [
    { body: { medication_id: 'MED-001', medication_name: 'Fluticasone/Salmeterol', medication_type: 'controller' } },
    { body: { medication_id: 'MED-002', medication_name: 'Albuterol HFA', medication_type: 'rescue' } },
  ],
  dose_events: [],
  missed_dose_events: [],
  technique_thresholds: {},
};

describe('PatientHeaderComponent', () => {
  let fixture: ComponentFixture<PatientHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientHeaderComponent],
      providers: [
        { provide: AdherenceDataSource, useValue: { getData: () => of(mockData) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PatientHeaderComponent);
    await fixture.whenStable();
  });

  it('renders patient initials and age', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('J.M.');
    expect(el.textContent).toContain('42');
  });

  it('renders condition name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Moderate Persistent Asthma');
  });
});
