import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AuthService, User } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit{

  dataSource: User[] = []
  tableDataSource!: MatTableDataSource<User>
  displayedColumns = ['email','firstName','lastName','phone','delete']

  constructor(
    public auth: AuthService,
    public fa: AngularFireAuth
  ) {}

  userEmail:string | null | undefined = ''

  @ViewChild(MatPaginator) paginator!: MatPaginator;

   ngAfterViewInit():void {
    this.auth.users$.subscribe(data=>
      {
        this.dataSource = data
        this.tableDataSource = new MatTableDataSource(data.slice(0,5))
        this.paginator.firstPage();
      }
     )
    this.auth.auth.user.subscribe(user=>
      this.userEmail = user?.email)

   }

  paginate(page:PageEvent){
    let from = page.pageIndex*page.pageSize
    let to = page.pageIndex*page.pageSize + page.pageSize
    this.tableDataSource = new MatTableDataSource(this.dataSource.slice(from,to))
   }

  searchData(term:string){
    if(!term){
      this.tableDataSource = new MatTableDataSource(this.dataSource.slice(0,5))
      this.paginator.length=this.dataSource.length
    }
    else
    {
      const filteredArray = this.dataSource.filter(
        (user=> Object.values(user).includes(term)))
      this.tableDataSource = new MatTableDataSource(filteredArray)
      this.paginator.firstPage();
      this.paginator.length = filteredArray.length
    }
  }

  sortData(event: Sort){
    if (event.direction) {
      this.auth.sortFilter$.next({
        columnName: event.active,
        sortOrder: event.direction
      })
    }
    else {
      this.auth.sortFilter$.next(null)
    }
  }

  deleteUser(email:string){
    this.auth.delete(email.toLowerCase())
  }

}
