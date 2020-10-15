import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  campaignURL = `${environment.api.base}/campaigns/fibre?channels=120&visibility=public`;
  promosURL = `${environment.api.base}/products/promos`;
  campaignSubject = new ReplaySubject<any[]>();
  campaignArr = [];
  constructor(private http: HttpClient) {}

  getAllCampaigns(): Observable<any> {
    return this.http.get(this.campaignURL).pipe(
      map((res) => {
        return res['campaigns'] as any[];
      }),
      map((arr) => {
        this.campaignArr = arr;
        this.campaignSubject.next(arr);
      })
    );
  }

  getCampaignByCode(code): any {
    return this.campaignArr.find((item) => item.code === code);
  }

  getPromoCodesByCode(code): any[] {
    return this.getCampaignByCode(code)['promocodes'];
  }

  getPromosByPromoCodeList(arr): void {
    this.http.get(`${this.promosURL}/${arr.join(',')}`).subscribe((res) => {
      console.log('Promos', res);
    });
  }
}
