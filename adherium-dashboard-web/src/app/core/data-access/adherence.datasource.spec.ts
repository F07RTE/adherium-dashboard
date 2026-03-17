import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdherenceDataSource } from './adherence.datasource';

const mockData = {
  patient: { external_id: 'PATIENT-123' },
  medications: [],
  dose_events: Array.from({ length: 40 }, (_, i) => ({ header: { id: `EVT-${i + 1}` }, body: {} })),
  missed_dose_events: Array.from({ length: 4 }, (_, i) => ({ header: { id: `MISS-${i + 1}` }, body: {} })),
  technique_thresholds: {},
};

describe('AdherenceDataSource', () => {
  let datasource: AdherenceDataSource;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdherenceDataSource,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    datasource = TestBed.inject(AdherenceDataSource);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('getData() returns patient data', () => {
    let result: any;
    datasource.getData().subscribe(data => (result = data));
    httpTesting.expectOne('assets/adherence-data.json').flush(mockData);
    expect(result.patient).toBeDefined();
    expect(result.patient.external_id).toBe('PATIENT-123');
  });

  it('getData() returns 40 dose events', () => {
    let result: any;
    datasource.getData().subscribe(data => (result = data));
    httpTesting.expectOne('assets/adherence-data.json').flush(mockData);
    expect(result.dose_events).toHaveLength(40);
  });

  it('getData() returns 4 missed dose events', () => {
    let result: any;
    datasource.getData().subscribe(data => (result = data));
    httpTesting.expectOne('assets/adherence-data.json').flush(mockData);
    expect(result.missed_dose_events).toHaveLength(4);
  });
});
