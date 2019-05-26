import * as pnp from 'sp-pnp-js';
import { from, Observable } from 'rxjs';

/** 
 * search for items by stringt against the sharepoint search service 
 */
export const searchBooks = (searchString: string): Observable<any> => {
    const cleanSearchString = searchString.trim();
    
    return from(pnp.sp.search({
        Querytext: cleanSearchString ? `*${searchString}*` : `*`,
        SourceId: '3b4ffe81-63e2-45ec-861c-87176b27ca4e'
    }));
}

/**
 * Get item by id
 * @param id : list item id
 * @param listName : name of the list
 */
export const getBookById = (id: number, listName: string) : Observable<any> => {
    return from(pnp.sp.web.lists.getByTitle(listName).items.getById(id).get());
}

/**
 * Request a book, basically change the state of the book to requested in order to  
 * trigger the workflow
 * @param id: list item id
 * @param listName: list name
 */
export const requestABook = (id: number, listName: string) : Observable<any> => {
    return from(pnp.sp.web.lists.getByTitle(listName).items
                    .getById(id)
                    .update({
                        Status: 'Requested'
                    }));
}