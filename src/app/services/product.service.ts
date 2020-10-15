import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketingApiService } from './marketing-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productSubject = new ReplaySubject();
  priceRanges = [
    { min: 0, max: 699, label: 'R0 - R699' },
    { min: 700, max: 999, label: 'R700 - R999' },
    { min: 1000, max: 9999, label: 'R1000+' },
  ];
  summarisedProducts = [];

  constructor(private marketingAPI: MarketingApiService) {}

  getCampaignByCode(code): any {
    return this.marketingAPI.campaignArr.find((item) => item.code === code);
  }

  getPromoCodesByCode(code): any[] {
    return this.getCampaignByCode(code)['promocodes'];
  }

  getPromosByPromoCodeList(arr): void {
    this.marketingAPI.getPromosByPromoCodeList(arr).subscribe((res) => {
      this.productSubject.next(res);
      this.summarisedProducts = res;
      this.getProvidersList(this.summarisedProducts);
    });
  }

  getProvidersList(arr): any[] {
    const tempArr = arr.slice();
    const providers = new Set();

    tempArr.forEach((element) => {
      return providers.add(element.provider);
    });
    return Array.from(providers);
  }

  productFilters(providers, prices): any[] {
    const products = this.filterByProvider(providers);
    return this.filterByPriceRanges(prices, products);
  }

  filterByProvider(selectedProviders): any {
    console.log('selectedProviders', selectedProviders);
    const tempList = this.summarisedProducts.slice();
    const filteredProducts = [];
    if (selectedProviders.length === 0) {
      return this.summarisedProducts;
    } else {
      selectedProviders.forEach((sp) => {
        console.log('sp', sp);
        tempList.forEach((product) => {
          console.log('provider', product.provider);
          if (product.provider === sp) {
            filteredProducts.push(product);
          }
        });
      });
      console.log('filtered', filteredProducts);
      return filteredProducts;
    }
  }

  filterByPriceRanges(prArr, productList): any {
    console.log('price ranges', prArr);
    const tempList = productList.slice();
    const filteredProducts = [];
    if (prArr.length === 0) {
      return productList;
    } else {
      prArr.forEach((prItem) => {
        tempList.forEach((product) => {
          if (
            prItem.max > product.productRate &&
            prItem.min < product.productRate
          ) {
            filteredProducts.push(product);
          }
        });
      });
      return filteredProducts;
    }
  }

  sortProducts(arr): any[] {
    const tempArr = arr.slice();
    return tempArr.sort((pa, pb) => pa.productRate - pb.productRate);
  }
}
