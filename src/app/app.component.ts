import { ProductService } from './services/product.service';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MarketingApiService } from './services/marketing-api.service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  campaigns: any;
  campaignCodes = [
    {
      label: 'Prepaid Fibre',
      code: 'FTTH-PREPAID',
    },
    {
      label: 'FREE Set up + Router',
      code: 'FTTH-FREESETUP-FREEROUTER',
    },
  ];
  providers = [];
  selectedProviders = [];
  products = [];
  prices = [];
  priceRange = this.productService.priceRanges;
  fibreForm = new FormGroup({
    campaignType: new FormControl(),
    providersList: new FormControl(),
    priceRanges: new FormControl(),
  });

  constructor(
    private productService: ProductService,
    private marketingAPI: MarketingApiService
  ) {
    this.marketingAPI.getAllCampaigns().subscribe();
  }

  ngOnInit(): void {
    this.marketingAPI.campaignSubject.subscribe(() => {
      this.initialFormSetting();
      this.fibreForm
        .get('campaignType')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((formValues) => {
          if (formValues) {
            this.resetValues();
            this.getCampaignByCode(formValues);
            this.getPromoCodesByCode(formValues);
            this.fibreForm.get('providersList').setValue(false);
            this.fibreForm.get('priceRanges').setValue(false);
          }
        });
    });

    this.productService.productSubject.subscribe((products) => {
      this.providers = this.productService.getProvidersList(products);
    });
  }

  resetValues(): void {
    this.selectedProviders.length = 0;
    this.products.length = 0;
    this.prices.length = 0;
  }

  selectProvider(provider): void {
    this.products.length = 0;
    if (this.selectedProviders.indexOf(provider) === -1) {
      this.selectedProviders.push(provider);
    } else {
      this.selectedProviders.splice(
        this.selectedProviders.indexOf(provider),
        1
      );
    }
    if (this.selectedProviders.length > 0) {
      const productList = this.productService.productFilters(
        this.selectedProviders,
        this.prices
      );

      this.products = productList;
    }
  }

  selectPrice(price): void {
    this.products.length = 0;
    const foundIndex = this.prices.findIndex((item) => {
      return item.label === price.label;
    });

    if (foundIndex !== -1) {
      this.prices.splice(foundIndex, 1);
    } else {
      this.prices.push(price);
    }
    const productList = this.productService.productFilters(
      this.selectedProviders,
      this.prices
    );

    this.products = productList;
  }

  initialFormSetting(): void {
    this.fibreForm.get('campaignType').setValue(this.campaignCodes[0].code);
    this.getCampaignByCode(this.campaignCodes[0].code);
    this.getPromoCodesByCode(this.campaignCodes[0].code);
  }

  getCampaignByCode(code): any {
    this.productService.getCampaignByCode(code);
  }

  getPromoCodesByCode(code): any {
    const tempArr = this.productService.getPromoCodesByCode(code);
    this.getPromosByPromoCodeList(tempArr);
  }

  getPromosByPromoCodeList(arr): void {
    this.productService.getPromosByPromoCodeList(arr);
  }
}
