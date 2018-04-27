import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as book from '../actions/book';
import { Book } from '../models/book';


@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-search [query]="searchQuery$ | async" [searching]="loading$ | async" (search)="search($event)"></bc-book-search>
    <bc-book-preview-list [books]="newBooks"></bc-book-preview-list>
  `
})
export class FindBookPageComponent {
  searchQuery$: Observable<string>;
  books$: Observable<Book[]>;
  newBooks: Book[] =[];
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.searchQuery$ = store.select(fromRoot.getSearchQuery).take(1);
    this.books$ = store.select(fromRoot.getSearchResults);
    console.log(this.books$);
    this.loading$ = store.select(fromRoot.getSearchLoading);
    this.books$.subscribe(
      books => {
        console.log(books);
        this.setPrices(books);
        console.log(this.newBooks);
      }
    )
  }

  setPrices(books: Book[]){
    for(let book of books){
      this.newBooks.push(new Book(book));
      Object.preventExtensions(book);
      if(this.newBooks.length >10){
        break;
      }
    }
  }

  search(query: string) {
    this.store.dispatch(new book.SearchAction(query));
  }
}
