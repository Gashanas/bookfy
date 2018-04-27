import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy , OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import { Book } from '../models/book';
import { StoreService } from '../store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card>
      <md-card-title>My Collection</md-card-title>
    </md-card>

    <bc-book-preview-list [books]="books"></bc-book-preview-list>
    
    <md-card style="text-align: center">
      <p style="margin: 5px; color: #274343">Price: {{price}} €</p>
      <p style="margin: 5px; color: #274343">Discount: {{discount}} €</p>
      <md-card-title style="margin: 10px; color: #5d2e33">Total price: {{totalPrice}} €</md-card-title>
      <button *ngIf="!isPressed" md-raised-button color="warn" (click)="confirm()">
        Create receipt
      </button>
    </md-card>
    
    <div style="justify-content: center; 
      display: flex;
      flex-wrap: wrap;" *ngIf="isPressed">
    <md-card *ngIf="true" style = "width: 600px; margin: 15px">
          <md-card-title style="margin: 10px; color: #5d2e33">Fill in your information: </md-card-title>
       <form [formGroup]="signInForm" class="form ">
      <div style="text-align: center" class="form-item">
          
      <md-input-container>
        <input mdInput type="text" name="name" formControlName="name" maxlength="30"
               placeholder="First Name" required>
      </md-input-container>
      <div id="error" *ngIf="signInForm.controls['name'].hasError('required') && signInForm.controls['name'].touched" class="error">
            Please fill your first name
          </div >
          <div id="error" *ngIf="signInForm.controls['name'].hasError('minlength') && signInForm.controls['name'].touched && !signInForm.controls['name'].hasError('required') "  class="error" >
            Your input is to short
          </div>
      </div>
      <div class="form-item" style="text-align: center">
          <md-input-container>
        <input mdInput type="text" name="lastName" formControlName="lastName" maxlength="40"
               placeholder="Last name" required>
               </md-input-container>
          <div id="error" *ngIf="signInForm.controls['lastName'].hasError('required') && signInForm.controls['lastName'].touched" class="error" >
            Please fill in your last name
          </div>
          <div id="error" *ngIf="signInForm.controls['lastName'].hasError('minlength') && signInForm.controls['lastName'].touched && !signInForm.controls['lastName'].hasError('required') " class="error" >
            Your input is to short
          </div>
      </div>
    </form>
    <div style="text-align: center">
    <button [disabled]="!signInForm.controls['lastName'].valid && !signInForm.controls['name'].valid" md-raised-button color="warn" (click)="createReceipt()">
        Confirm
      </button>
      </div>
    </md-card>
    </div>
    
    
    
    
    
    
    
    
    <div style="justify-content: center; 
      display: flex;
      flex-wrap: wrap;">
    <md-card *ngIf="showReceipt" style = "width: 600px; margin: 15px">
      <md-card-title-group style="margin: 20px;">
          <img src="https://image.ibb.co/dez71b/galutinis_png.png"/>
          <md-card-title style="margin-right: 10px"> Your receipt: </md-card-title>
          <md-card-subtitle> Customer: {{signInForm.controls['name'].value}} {{signInForm.controls['lastName'].value}}</md-card-subtitle>
      </md-card-title-group>
      <div style="margin: 10px;" id="divider"></div>
      <div style="margin: 20px;">
      <div><span style="font-weight: 800; font-size: large">Books: </span><span style="float: right;">Price:</span></div>
      <p *ngFor="let book of books" style="margin: 10px, 20px;">
         {{book.volumeInfo.title}}
         <span *ngIf="book.price" style=" font-weight: 300; float: right">{{book.price}} €</span>
         <span *ngIf="!book.price" style=" font-weight: 300; float: right">{{getBookPrice(book)}} €</span>
      </p>
      </div>
      <div style="margin: 10px;" id="divider"></div>
      <h4>
      <span style="float: right;">Price: {{price}} €</span>
      </h4>
      <br/>
      <div *ngIf="discount>0">
           <h4>
              <span style="float: right;">Discount: {{discount}} €</span>
          </h4>
          <br/>
          <h3>
              <span style="float: right; font-weight: 600">Total Price: {{totalPrice}} €</span>
          </h3>
      </div>

    </md-card>
    </div>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [`
    md-card-title {
      display: flex;
      justify-content: center;
    }
    #divider {
    margin: 10px, 10px;
  border-top:1px solid #44454A;
  border-bottom:1px solid #44454A;
}
#error {
    font-size: 13px;
    color: red;
    margin: 0 10px;
}
  `]
})
export class CollectionPageComponent implements OnInit {
  books$: Observable<Book[]>;
  books : Book[];
  purchase: any;
  price: number;
  totalPrice : number = 0;
  showReceipt: boolean = false;
  discount: number = 0;
  signInForm : FormGroup;
  isPressed = false;

  confirm(){
    this.isPressed = true;
  }

  constructor(store: Store<fromRoot.State>, private storeService: StoreService,
              private fb: FormBuilder,) {
    this.books$ = store.select(fromRoot.getBookCollection);
    this.books$.subscribe(
      books => this.books = books
    );
    for(let book of this.books){
      if(!book.price){
        book = new Book(book);
      }
      this.totalPrice += book.price;
      console.log(this.totalPrice);
      console.log(book.price);
    }
    this.price = this.totalPrice;
    if(this.books.length>1){
      this.discount = this.books.length * 2;
    }
    this.totalPrice = this.totalPrice - this.discount;
  }

  getBookPrice(book: any){
    return new Book(book).price;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.signInForm = this.fb.group({
      'name': ['', [Validators.required, Validators.minLength(3)]],
      'lastName': ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  // login(): void {
  //   this.showLoader();
  //   this.authService.login(new LoginUser(this.signInForm.value))
  //     .finally(() => this.hideLoader())
  //     .subscribe(
  //       response => this.router.navigate(['']),
  //       error => this.setErrorMessage(error)
  //     );
  // }


  createReceipt(){
    this.isPressed = false;
    this.showReceipt = true;
    this.purchase = {
      totalPrice: this.totalPrice,
      price: this.price,
      discount: this.discount,
      date: "2018.01.06",
      books: this.books
    };
    this.storeService.purchase.push(this.purchase);
    console.log(this.storeService.purchase)
  }
}
