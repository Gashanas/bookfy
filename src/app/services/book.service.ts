import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';
import { Book } from '../models/book';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class BookService {
    private book: any;

    constructor(private http: Http) {
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json');
    }

    getBooks(): Observable<Book> {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(
            `${environment.apiUrl}/v1/books`, { headers })
            .map((res: Response) => this.book = res.json())
            .catch(this.handleError);
    }

    deleteBook(id: number) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(
            `${environment.apiUrl}/v1/book`,
            id, { headers })
            .map((res: Response) => res.json().data)
            .catch(this.handleError);
    }

    addBook(book: Book) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(
            `${environment.apiUrl}/v1/book`, book, { headers })
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        try {
            return Observable.throw(error.json().message);
        } catch (e) {
            return Observable.throw('Sorry, something went wrong');
        }
    }

}