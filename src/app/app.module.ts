import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { BooksPageComponent } from './books-page/books-page.component';
import { InfoComponent } from './info/info.component';
import { BookOverviewComponent } from './book-overview/book-overview.component';
import { CartComponent } from './cart/cart.component';
import { PortalComponent } from './portal/portal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    BooksPageComponent,
    InfoComponent,
    BookOverviewComponent,
    CartComponent,
    PortalComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
