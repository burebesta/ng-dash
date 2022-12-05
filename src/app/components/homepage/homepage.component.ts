import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, User } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent{
      // this.toastr.success('Hello world!', 'Toastr fun!');


  showLogin: boolean = true
  public signUpForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  })
  public signInForm = this.fb.group( {
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public dialog: MatDialog,
    public toastr: ToastrService
    ) {}

  onSignIn(){
    this.auth.signIn(
      this.signInForm.controls.email.value!,
      this.signInForm.controls.password.value!)
  }

  onSignUp(){
    if(!this.signUpForm.valid){
      return
    }
    const user: User  = {
      firstName : this.signUpForm.controls.firstName.value!,
      lastName : this.signUpForm.controls.lastName.value!,
      email : this.signUpForm.controls.email.value!,
      phone : this.signUpForm.controls.phone.value!,
    }
    this.auth.signUp(user, this.signUpForm.controls.password.value!)
  }

  addUser(){
    this.auth.addUser({
      email: this.signUpForm.controls.email.value!,
      firstName: this.signUpForm.controls.firstName.value!,
      lastName: this.signUpForm.controls.lastName.value!,
      phone: this.signUpForm.controls.phone.value!,
    })
  }

  delete(user:any){
    this.auth.delete(user.id)
  }



  openDialog() {
    const dialogRef = this.dialog.open(TermsConditionsComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.signUpForm.controls.terms.setValue(true)
      }
    });
  }
}
