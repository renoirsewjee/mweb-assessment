import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketingApiService {
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
  getPromosByPromoCodeList(arr): Observable<any> {
    return this.http.get(`${this.promosURL}/${arr.join(',')}`).pipe(
      map((array) => {
        return [].concat(...this.summarizeProductList(array as any[]));
      })
    );
  }

  summarizeProductList(array): any[] {
    const tempArr = array.slice();
    return tempArr.map((arrItem) => {
      return arrItem['products'].map((product) => {
        return this.getSummarizedProduct(product);
      });
    });
  }

  getSummarizedProduct({
    productCode,
    productName,
    productRate,
    subcategory,
  }): any {
    const provider = subcategory
      .replace('Uncapped', '')
      .replace('Capped', '')
      .trim();

    return { productCode, productName, productRate, provider };
  }
}
