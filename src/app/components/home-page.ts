import { Component, Input , OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import { Book } from '../models/book';
import { StoreService } from '../store.service';


@Component({
  selector: 'home-page',
  template: `
<md-card style="text-align: center">
      <md-card-title>Home page</md-card-title>
    </md-card>
    <div style = "
      display: flex;
      flex-wrap: wrap;
      justify-content: center;">
   <md-card style="
      width: 500px;
      min-height: 300px;
      margin: 15px; ">
        <md-card-title-group>
          <md-card-title>Collection</md-card-title>
          <md-card-subtitle *ngIf="subtitle"></md-card-subtitle>
        </md-card-title-group>
        <div *ngIf="!books.length" style="margin: 40px; text-align: center; background-color: #4e90bf; border: 2px solid rgba(0, 0, 0, 0.2);">
        <span style="margin: 60px 20px; color: #ebebec">There is no books</span>
</div>
<div *ngIf="books.length">
<div style="margin: 10px; text-align: center">
        <span style="font-weight: 800">Title</span>
        <span style="font-weight: 800; float: right;">Price</span>
        </div>
        <tr style="margin: 10px; height: 40px" *ngFor="let book of books">
        <th><img md-card-sm-image [src]="
    book.volumeInfo.imageLinks
      && book.volumeInfo.imageLinks.smallThumbnail"/></th>
        <th><span>{{book.volumeInfo.title}} </span></th>
        <th><span style="float: right;">{{book.price}} €</span></th>
</tr>
</div>
        
<span style=" margin: 20px; float: right; font-size: 20px"> Total Price: {{calculateTotalPrice()}} €</span>
      </md-card>
      <md-card style = " 
      width: 500px;
      min-height: 300px;
      margin: 15px;"> 
        <md-card-title-group>
          <md-card-title>Purchases</md-card-title>
          <md-card-subtitle *ngIf="subtitle"></md-card-subtitle>
        </md-card-title-group>
        <div *ngIf="!purchases.length" style="margin: 40px; text-align: center; background-color: #4e90bf; border: 2px solid rgba(0, 0, 0, 0.2);">
        <span style="margin: 60px 20px; color: #ebebec">There is no purcheses</span>
</div>
<div *ngIf="purchases.length">
<div style="margin: 10px">
        <span style="font-weight: 800">Price</span>
        <span style="font-weight: 800; float: right;">Date</span>
        </div>
        <div style="margin: 10px" *ngFor="let purchase of purchases">
        
        <span>{{purchase.totalPrice}} €</span>
        <span style="float: right;">{{purchase.date}}</span>
</div>
</div>
        <!--<p *ngIf="book.price" style="margin: 0 0">Price: {{ book.price }} € </p>-->
        <!--<p *ngIf="!book.price" style="margin: 0 0">Price: {{getBookPrice(book)}} € </p>-->
        <md-card-content>
          <!--<p *ngIf="description">{{ description | bcEllipsis }}</p>-->
        </md-card-content>
        <md-card-footer>
          <!--<bc-book-authors [book]="book"></bc-book-authors>-->
          <!--<-->
        </md-card-footer>
      </md-card>
      </div>
      
      <md-card style=":hover {background-color: #00bcd4;
    }; text-align: center" (click)="showHelpCard()">
      <md-card-title>Help</md-card-title>
    </md-card>
    
    <div *ngIf="showHelp" style = "
      display: flex;
      flex-wrap: wrap;
      justify-content: center;">
   <md-card style="
      width: 500px;
      min-height: 300px;
      margin: 15px; ">
      <md-card-title-group>
          <md-card-title>Pagalba</md-card-title>
          </md-card-title-group>
          <p>Dabar jūs esate pradiniame puslapyje, kuriame matote savo knygų kolekcija. Kolekcija tai tas pats kaip krepšelis, joje saugomos knygos , kurias jus pasirinkote ar pasirinksite veliau.
          <p>Kitoje korteleje parodyti jūsų įvykdyti pirkimai. </p>
          <p>Noritn keliauti į kitus puslapius pauskite trys brūksnelius kairiajame virsutiniame ekrano kampe. Atsidarys meniu, kuriame galesite pasitinkit kur norite keliaute.</p>
          <p>Be pagrindinio puslapio, dar yra kolekcijos (galima vadinti ir krepšelio) puslapis, bei paieškos puslapis.</p>
          <p>Norint ieškoti knygų, tereikia nueiti į paieškos puslapį ir į laukelį įrašyti knygos pavadinimą.</p>
          <p>Pasirinktas knygas galima apžiūrėti kolekcijos puslapyje bei sugeneruoti sąskaitą už pasirinktas knygas<p>
      </md-card>
      </div>
  `,
  styles: [`
    md-card {
    }
    @media only screen and (max-width: 768px) {
      md-card {
        margin: 15px 0 !important;
      }
    }
    md-card:hover {
      box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
    }
    md-card-title {
      margin-right: 10px;
    }
    md-card-title-group {
      margin: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    span {
      display: inline-block;
      font-size: 13px;
    }
    md-card-footer {
      padding: 0 25px 25px;
    }
  `]
})
export class HomePage implements OnInit{

  ngOnInit(): void {
  }

  purchases : any;
  books$: Observable<Book[]>;
  books : Book[];
  showHelp = false;
  subtitle : any = undefined;

  constructor(store: Store<fromRoot.State>,private storeService: StoreService){
    this.books$ = store.select(fromRoot.getBookCollection);
    this.purchases = storeService.purchase;
    this.books$.subscribe(
      books => this.books = books
    )
  }

  showHelpCard(){
    this.showHelp = !this.showHelp;
  }

  calculateTotalPrice(){
    let price =0;
    for(let book of this.books){
      price += book.price-2;
    }
    return price;
  }

}
