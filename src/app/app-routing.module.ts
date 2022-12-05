import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '',pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomepageComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
