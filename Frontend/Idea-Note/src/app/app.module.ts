import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HeaderComponent } from './header/header.component';
import { NoteBoxComponent } from './note-box/note-box.component';
import { TaskComponent } from './task/task.component';
import { ArchiveComponent } from './archive/archive.component';
import { TrashComponent } from './trash/trash.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskDetailsDialogComponent } from './task-details-dialog/task-details-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingViewComponent } from './landing-view/landing-view.component';
import { AuthInterceptor } from './auth.interceptor';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { TaskStatusDialogComponent } from './task-status-dialog/task-status-dialog.component';
import { TaskPriorityDialogComponent } from './task-priority-dialog/task-priority-dialog.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    SideNavComponent,
    HeaderComponent,
    NoteBoxComponent,
    TaskComponent,
    ArchiveComponent,
    TrashComponent,
    DashboardComponent,
    TaskDetailsDialogComponent,
    FooterComponent,
    PageNotFoundComponent,
    LandingViewComponent,
    ConfirmationDialogComponent,
    TaskStatusDialogComponent,
    TaskPriorityDialogComponent,
    LogoutDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    FormsModule, 
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
