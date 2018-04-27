import { Component, Input , OnInit} from '@angular/core';
import { Book } from '../models/book';

@Component({
  selector: 'bc-book-preview-list',
  template: `
    <bc-book-preview *ngFor="let book of books" [book]="book"></bc-book-preview>
  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `]
})
export class BookPreviewListComponent implements OnInit{
  @Input() books: Book[];



  ngOnInit(): void {
    setTimeout(function() {
      console.log("list", this.books);
    }, 5000);
  }
}
