export class Book {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishDate: string;
    description: string;
    averageRating: number;
    ratingsCount: number;
    pageCount: number;
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    };
  };
  price: number;

  constructor(book: Book) {
    this.id = book.id;
    this.volumeInfo = book.volumeInfo;
    this.price = this.volumeInfo.pageCount/10 || 10;
  }

}
