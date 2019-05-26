import * as React from 'react';
import styles from './BookingService.module.scss';
import { IBookingServiceProps } from './IBookingServiceProps';
import { connect } from 'react-redux';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import actions from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faCheckCircle, faTag } from '@fortawesome/free-solid-svg-icons'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

export class BookingService extends React.Component<any, any> {

  public unsubscribeStore: any;

  get showMessage() {
    return (this.state && this.state.globalMessage) ? <Dialog
              open={true}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
                <DialogContent>
                  <div>{this.state.globalMessage}</div>
                </DialogContent>
                <Button color="primary" onClick={this.closeDialog}>Ok</Button>
           </Dialog> : null;
  }

  get taggedSection() {
    return (this.state && this.state.selectedBook && this.state.selectedBook.TaxKeyword) ? this.state.selectedBook.TaxKeyword.map(tag =>
          <span>
            <span>{tag.Label}</span>
            <FontAwesomeIcon icon={faTag} />
          </span>
    ) : null;
  }

  get bookList() {
    return (this.state && this.state.bookList) ? this.state.bookList.map(book =>
        <div className={styles["book-item"]} onClick={(e) => this.showBook(book.ID)}>
          <h4>{book.Title}</h4>
          <div className={styles["image-container"]}>
            <img src={book.Image.Url}></img>
          </div>
          <div className={styles.author}>Author: {book.Writer}</div>
          <div className={styles.status}>{book.Status? book.Status : 'Shelved'}</div>
        </div>) : null;
  }

  get actions() {
    return (this.state && (!this.state.selectedBook.Status || this.state.selectedBook.Status === 'Shelved')) ?
      <div className={styles.actions}>
        <Button variant="contained" color="default" onClick={(e) => this.requestBook(this.state.selectedBook.ID)}>
          Request Book
          <FontAwesomeIcon icon={faCheckCircle} />
        </Button>
      </div> : null;
  }

  get detail() {
    return (this.state && this.state.selectedBook) ? 
      <div className={styles["item-container"]}>
        <div className={styles["image-container"]}>
          <img src={this.state.selectedBook.Image.Url}></img>
          <span className={styles.status}>{this.state.selectedBook.Status? this.state.selectedBook.Status : 'Shelved'}</span>
        </div>
        <div className={styles.title}>
          <span>{this.state.selectedBook.Title}</span>
          {this.likeDetailSection}
        </div>
        <div className={styles.author}>Author: {this.state.selectedBook.Writer}</div>
        <div className={styles["tagged-section"]}>
          {this.taggedSection}
        </div>
        <div className={styles.description}>{this.state.selectedBook.Description}</div>
        {this.actions}
      </div> : null;
  }

  get likeDetailSection(){
    return this.state.selectedBook.LikesCount ? 
      <span className={styles.like}>
        <FontAwesomeIcon icon={faThumbsUp} />
        {this.state.selectedBook.LikesCount}
      </span>
     : null;
  }

  public render(): React.ReactElement<IBookingServiceProps> {
    return (
    <div className={styles.webpart}>
      <h3>Loan Books</h3>
      <div className={styles.contaier}>
        {this.showMessage}
          <div className={styles.master}>
            <div className={styles.header}>
              <input></input>
            </div>
            <div className={styles["master-body"]}>
              {this.bookList}
            </div>
          </div>
          <div className={styles["detail"]}>
              {this.detail}
          </div>
      </div>
      </div>
    );
  }

  updateStateFromStore = () => {
    const currentState = this.props.store.getState();
    if (this.state !== currentState) {
      this.setState(currentState);
    }
  }

  componentDidMount() {
    // setting app state
    this.unsubscribeStore = this.props.store.subscribe(this.updateStateFromStore);
    // setting listeners
    this.startListeners();
  }

  private startListeners = () => {
    const searchBox = document.getElementsByTagName('input')[0];
    fromEvent(searchBox,'keyup')
      .pipe(
        debounceTime(200)
      )
      .subscribe((evt: any) => this.searchBooks(evt.target.value));
  }

  private searchBooks = (searchString) => {
    this.props.store.dispatch(actions.searchBook(searchString));
  } 

  private showBook = (bookId) => {
    this.props.store.dispatch(actions.getBookDetail(bookId));
  }

  private requestBook = (bookId) => {
    this.props.store.dispatch(actions.requestBook(bookId));
  }

  private closeDialog = () => {
    this.props.store.dispatch(actions.resetGlobalMessage());
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }
}

export default connect()(BookingService);