
import { searchBooks, getBookById, requestABook } from '../services/booking.api';
import { flatMap } from 'rxjs/operators';
import { from, forkJoin } from 'rxjs';

const LIST_NAME = 'Biblioteca';

// types of action
const Types = {
    SEARCH_BOOK: 'SEARCH_BOOK',
    SEARCH_BOOK_START: 'SEARCH_BOOKS_START',
    SEARCH_BOOK_END: 'SEARCH_BOOK_END',
    GET_BOOK_DETAIL_START: 'GET_BOOK_BY_ID_START',
    GET_BOOK_DETAIL_END: 'GET_BOOK_BY_ID_END',
    REQUEST_BOOK_START: 'REQUEST_BOOK_START', 
    REQUEST_BOOK_END: 'REQUEST_BOOK_END',
    CLEAR_GLOBAL_MESSAGE: 'RESET_GLOBAL_MESSAGE'
  };
  // actions

  const searchBook = (searchString) => {
    return (dispatch) => {
        dispatch(triggerSearchBook(searchString));  
        searchBooks(searchString)
        .subscribe(response => {
            let observersArray = response.PrimarySearchResults.map(book=> getBookById(getUrlIdParameter(book.Path), LIST_NAME));
            forkJoin(
                observersArray
            )
            .subscribe(books => dispatch(responseSearchBook(books)));
        });
    }
  }

  const triggerSearchBook = searchString => ({
    type: Types.SEARCH_BOOK_START,
    payload: searchString
  });

  const responseSearchBook = books => ({
    type: Types.SEARCH_BOOK_END,
    payload: books
  });

  const getBookDetail = (bookId: number) => {  
    return (dispatch) => {
        dispatch(triggerGetBookDetail(bookId));
        return getBookById(bookId, LIST_NAME)
        .subscribe(response => dispatch(responseGetBookDetail(response)));
    }
  }

  const triggerGetBookDetail = bookId => ({
    type: Types.GET_BOOK_DETAIL_START,
    payload: bookId
  });

  const responseGetBookDetail = book => ({
    type: Types.GET_BOOK_DETAIL_END,
    payload: book
  });

  const requestBook = (bookId: number) => {
    return (dispatch) => {
        dispatch(triggerRequestBook(bookId));
        return requestABook(bookId, LIST_NAME)
        .subscribe(response => dispatch(responseRequestBook(response)));
    }
  }

  const triggerRequestBook = bookId => ({
    type: Types.REQUEST_BOOK_START,
    payload: bookId
  });

  const responseRequestBook = bookingResponse => ({
    type: Types.REQUEST_BOOK_END,
    payload: bookingResponse
  });

  const getUrlIdParameter = (rawUrl: string) => {
    const url = new URL(rawUrl);    
    const id = new URLSearchParams(url.search).get('ID'); 
    return parseInt(id);
  }

  const resetGlobalMessage = () => ({
    type: Types.CLEAR_GLOBAL_MESSAGE
  });


  export default {
    searchBook,
    triggerSearchBook,
    responseSearchBook,
    getBookDetail,
    triggerGetBookDetail,
    responseGetBookDetail,
    requestBook,
    triggerRequestBook,
    responseRequestBook,
    Types,
    resetGlobalMessage
  };