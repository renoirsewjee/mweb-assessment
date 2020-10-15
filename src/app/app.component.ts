import { ProductService } from './services/product.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  campaigns: any;
  campaignCodes = ['FTTH-PREPAID', 'FTTH-FREESETUP-FREEROUTER'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.campaignSubject.subscribe((cmpArr) => {
      this.campaigns = cmpArr;
      this.campaignCodes.forEach((code) => {
        this.getCampaignByCode(code);
        this.getPromoCodesByCode(code);
      });
    });
    this.productService.getAllCampaigns().subscribe();
  }

  getCampaignByCode(code): any {
    console.log('Get campaign by code');
    const tempObj = this.productService.getCampaignByCode(code);
    console.log('tempObj', tempObj);
  }

  getPromoCodesByCode(code): any {
    console.log('Get promo codes');
    const tempArr = this.productService.getPromoCodesByCode(code);
    console.log('tempArr', code, tempArr);
    this.getPromosByPromoCodeList(tempArr);
  }

  getPromosByPromoCodeList(arr): void {
    this.productService.getPromosByPromoCodeList(arr);
  }
}
