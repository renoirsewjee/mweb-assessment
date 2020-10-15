import { ProductService } from './services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mweb-assessment';
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllCampaigns().subscribe((res) => {
      console.log('campaigns', res);
    });
  }
}
