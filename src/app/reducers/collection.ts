import * as collection from '../actions/collection';


export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
};

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export function reducer(state = initialState, action: collection.Actions): State {
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
      console.log(mappedResponse);
      newArrayOfBooks.push(mappedResponse);
    });
    console.log(newArrayOfBooks);
    return newArrayOfBooks;
  }

  switch (action.type) {
    case collection.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case collection.LOAD_SUCCESS: {
      const newBooksArray = mapResponse(action.payload);
      const books = newBooksArray;
      console.log("collection books", books);

      return {
        loaded: true,
        loading: false,
        ids: books.map(book => book.id)
      };
    }

    case collection.ADD_BOOK_SUCCESS:
    case collection.REMOVE_BOOK_FAIL: {
      // console.log(action.payload);
      const book = action.payload;
      console.log(book);

      if (state.ids.indexOf(book.id) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [ ...state.ids, book.id ]
      });
    }

    case collection.REMOVE_BOOK_SUCCESS:
    case collection.ADD_BOOK_FAIL: {
      const book = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== book.id)
      });
    }

    default: {
      return state;
    }
  }
}


export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
