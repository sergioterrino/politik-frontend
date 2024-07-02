import { ComponentsModule } from './../components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { ExploreComponent } from './explore/explore.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    SignupComponent,
    StartComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ExploreComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HomeComponent,
    LandingComponent,
    SignupComponent,
    StartComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ExploreComponent,
  ]
})
export class PagesModule { }
