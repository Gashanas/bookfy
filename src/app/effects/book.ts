import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { GoogleBooksService } from '../services/google-books';
import * as book from '../actions/book';


@Injectable()
export class BookEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(book.SEARCH)
    .debounceTime(300)
    .map(toPayload)
    .switchMap(query => {
      if (query === '') {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(book.SEARCH).skip(1);

      return this.googleBooks.searchBooks(query)
        .takeUntil(nextSearch$)
        .map(books => new book.SearchCompleteAction(books))
        .catch(() => of(new book.SearchCompleteAction([])));
    });

    constructor(private actions$: Actions, private googleBooks: GoogleBooksService) { }
}
