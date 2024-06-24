import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { SearchService } from '../search.service';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false; 
  dropdownOpen: boolean = false;
  searchQuery: string = '';
  loggedInUser: string | null = null ;

  constructor(private router: Router, 
    private searchService: SearchService,
    public UserDataService: UserDataService, 
    private authService: AuthserviceService) {}

    ngOnInit(): void {
      this.loggedInUser = this.authService.getUserEmail(); 
      this.authService.isLoggedInEmitter.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.loggedInUser = this.authService.getUserEmail(); 
        } else {
          this.loggedInUser = null; 
        }
      });
    }

  SideNavToogle() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus )
  }

  rotateIcon() {
    location.reload();
  }

  onSearch(): void {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  loginUser(email: string) {
    this.authService.login({ email, password: '' }); 
  }

  logoutUser() {

    this.loggedInUser = null;
    localStorage.removeItem('userEmail'); 
  }
}
