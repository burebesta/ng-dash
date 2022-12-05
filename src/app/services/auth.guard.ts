import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  canActivate():  Observable<boolean>  {
    // return this.authService.isLoggedIn$.pipe(
    //   tap((isLoggedIn) => {
    //     if (!isLoggedIn) {
    //       this.router.navigate(['home']);
    //     }
    //   })
    // )
    return of(true)
  }
}
