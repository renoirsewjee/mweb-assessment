import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  campaignURL = `${environment}/campaigns/fibre?channels=120&visibility=public`;
  constructor(private http: HttpClient) {}

  getAllCampaigns(): Observable<any> {
    return this.http.get(this.campaignURL);
  }
}
