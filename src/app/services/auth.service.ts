import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore/';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, Observable, of, switchMap, tap } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface sortParams {
  columnName: string;
  sortOrder: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  users$: Observable<User[]>;
  sortFilter$: BehaviorSubject<sortParams|null>;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  private readonly TOKEN_NAME = 'auth-token';

  test:any

  constructor(
    public auth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router,
    private toastr: ToastrService) {

    auth.onAuthStateChanged((user) => {
     this._isLoggedIn$.next(!!user)
    })

    auth.user.subscribe(result=>this.test = result)

    auth.idToken.subscribe(token=>{
      if(token) localStorage.setItem(this.TOKEN_NAME, token);
    })

    this.sortFilter$ = new BehaviorSubject<sortParams|null>(null);
    this.users$ = combineLatest(
      [this.sortFilter$]
    ).pipe(
      switchMap(([ sort]) =>
        store.collection<User>('users', ref => {
          let query : CollectionReference | Query = ref;
          if (sort) { query = query.orderBy(sort.columnName, sort.sortOrder) };
          return query
        }).valueChanges()
      )
    );
  }


  addUser(user:User){
    this.store.doc(`users/${user.email.toLowerCase()}`).set({
      ...user
    }).then(()=>
      this.toastr.success(`${user.firstName}`, 'Welcome'))
  }

  delete(email:string){
    this.store.doc('/users/'+email).delete().then(()=>
      this.toastr.success('Success', 'User Added'))
  }

  signUp = (user: User, password: string) => {
    this.auth.createUserWithEmailAndPassword(user.email, password)
    .then(() => {
      this.addUser(user)
      this.router.navigate(['admin'])
    })
    .catch((error) => {
      console.log(error.code, error.message)
      this.toastr.error('Error', `${error.message}`)
    });
  }

  signIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['admin'])
        this.toastr.success('Login successful')

      })
      .catch((error) => {
        console.log(error.code, error.message)
        this.toastr.error('Error', `${error.message}`)

      });
  }

  logOut(){
    this.auth.signOut()
    this.router.navigate(['home'])
    this.toastr.warning('Logged out')
  }

}
