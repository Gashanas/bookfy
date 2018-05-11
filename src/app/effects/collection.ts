import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import * as collection from '../actions/collection';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';


@Injectable()
export class CollectionEffects {
    // @Effect({dispatch: false})
    // openDB$: Observable<any> = defer(() => {
    //     return this.db.open('books_app');
    // });
    @Effect()
    loadCollection$: Observable<Action> = this.actions$
        .ofType(collection.LOAD)
        .startWith(new collection.LoadAction())
        // .debounceTime(3000)
        .switchMap(() =>{
                return this.bookService.getBooks()
                    .map((books: Book[]) => new collection.LoadSuccessAction(books))
                    .catch(() => of(new collection.LoadFailAction([])));
            }
        );

    @Effect()
    addBookToCollection$: Observable<Action> = this.actions$
        .ofType(collection.ADD_BOOK)
        .map((action: collection.AddBookAction) => action.payload)
        .debounceTime(300)
        .mergeMap(book =>{
                return this.bookService.addBook(book)
                    .map((books: Book[]) => new collection.AddBookSuccessAction(book))
                    .catch(() => of(new collection.AddBookFailAction(book)));
            }
        );


    @Effect()
    removeBookFromCollection$: Observable<Action> = this.actions$
        .ofType(collection.REMOVE_BOOK)
        .map((action: collection.RemoveBookAction) => action.payload)
        .debounceTime(300)
        .mergeMap(book =>{
                return this.bookService.deleteBook(book.id)
                    .map((books: Book[]) => new collection.RemoveBookSuccessAction(book))
                    .catch(() => of(new collection.RemoveBookFailAction(book)));
            }
        );

    constructor(private actions$: Actions,  private bookService: BookService) {
    }
}
