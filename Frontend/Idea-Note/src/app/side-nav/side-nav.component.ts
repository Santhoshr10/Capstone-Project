import { Component, Input, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  @Input() sideNavStatus: boolean = false;
  @Input() loggedInUser: string | null = null;

  list = [
    {
      number: '1',
      name: 'Task',
      icon: 'fa-solid fa-book',
      route: '/task'
    },
    {
      number: '2',
      name: 'Archive',
      icon: 'fa-solid fa-box-archive',
      route: '/archive'
    },
    {
      number: '3',
      name: 'Trash',
      icon: 'fa-solid fa-trash',
      route: '/trash'
    }
  ];

  constructor(private authService: AuthserviceService, public dialog: MatDialog) { }

  ngOnInit(): void { }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.authService.clearAuthToken();
        window.location.href = '/login';
      }
    });
  }
}
