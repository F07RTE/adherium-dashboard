import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdherenceData } from '../../domain/adherence-data.model';

@Injectable({ providedIn: 'root' })
export class AdherenceDataSource {
  constructor(private readonly http: HttpClient) {}

  getData(): Observable<AdherenceData> {
    return this.http.get<AdherenceData>('assets/adherence-data.json');
  }
}
