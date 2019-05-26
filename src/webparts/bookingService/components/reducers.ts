import ACTIONS from "./actions";
import * as _ from "lodash";

export const defaultState = {
    searchKey: null,
    selectedBook: null,
    selectedBookId: null,
    bookList: [],
    loadingMaster: false,
    loadingDetail: false,
    globalMessage: null
};

export const BookingReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CLEAR_GLOBAL_MESSAGE: {
        return _.assign({}, state, {
          globalMessage: null,
          selectedBook: null
        });
    }

    case ACTIONS.Types.SEARCH_BOOK_START: {
        return _.assign({}, state, {
            searchKey: action.payload,
            loadingMaster: true
        });
    }

    case ACTIONS.Types.SEARCH_BOOK_END: {
        return _.assign({}, state, {
            bookList: action.payload,
            loadingMaster: false
        });
    }

    case ACTIONS.Types.GET_BOOK_DETAIL_START: {
        return _.assign({}, state, {
            selectedBookId: action.payload,
            loadingDetail: true
        });
    }

    case ACTIONS.Types.GET_BOOK_DETAIL_END: {
        return _.assign({}, state, {
            selectedBook: action.payload,
            loadingDetail: true
        });
    }

    case ACTIONS.Types.REQUEST_BOOK_START: {
        return _.assign({}, state, {
            loadingMaster: true
        });
    }

    case ACTIONS.Types.REQUEST_BOOK_END: {
        return _.assign({}, state, {
            loadingMaster: false,
            globalMessage: 'Book was requested sucesfully'
        });
    }

    default:
      return state;
  }
};

