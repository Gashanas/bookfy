import { createSelector } from 'reselect';
import { Book } from '../models/book';
import * as book from '../actions/book';
import * as collection from '../actions/collection';


export interface State {
  ids: string[];
  entities: { [id: string]: Book };
  selectedBookId: string | null;
};

export const initialState: State = {
  ids: [],
  entities: {},
  selectedBookId: null,
};

function mapResponse(res: any){
  let newArrayOfBooks: any[] = [];
  res.forEach((response: any) => {
    let mappedResponse: any;
    let imageLinks = {
      smallThumbnail: response.smallThumbnail,
      thumbnail: response.thumbnail
    };
    let volumeInfo = Object.assign({}, response, {imageLinks: imageLinks});
    mappedResponse = {
      volumeInfo: volumeInfo,
      id: response.bookid,
      price: parseInt(response.pageCount) / 10
    };
    // mappedResponse.volumeInfo= res;
    // mappedResponse.id = res.bookid;
    // mappedResponse.price = parseInt(res.pageCount) / 100;
    // mappedResponse.volumeInfo.imageLinks ={
    //   smallThumbnail: res.smallThumbnail,
    //   thumbnail: res.thumbnail
    // };
    console.log(mappedResponse);
    newArrayOfBooks.push(mappedResponse);
  });
  console.log(newArrayOfBooks);
  return newArrayOfBooks;
}

export function reducer(state = initialState, action: book.Actions | collection.Actions): State {
  switch (action.type) {
    case book.SEARCH_COMPLETE:
    case collection.LOAD_SUCCESS: {
      let booksList = action.payload;
      if(booksList.length && !booksList[0].volumeInfo){
        booksList = mapResponse(booksList);
      }
      const books = booksList;
      console.log(books);
      const newBooks = books.filter(book => !state.entities[book.id]);

      const newBookIds = newBooks.map(book => book.id);
      const newBookEntities = newBooks.reduce((entities: { [id: string]: Book }, book: Book) => {
        return Object.assign(entities, {
          [book.id]: book
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newBookIds ],
        entities: Object.assign({}, state.entities, newBookEntities),
        selectedBookId: state.selectedBookId
      };
    }

    case book.LOAD: {
      const book = action.payload;

      if (state.ids.indexOf(book.id) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, book.id ],
        entities: Object.assign({}, state.entities, {
          [book.id]: book
        }),
        selectedBookId: state.selectedBookId
      };
    }

    case book.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedBookId: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedBookId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
