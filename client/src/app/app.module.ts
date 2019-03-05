import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import {AngularFontAwesomeModule} from 'angular-font-awesome';


import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/security/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/security/register/register.component';
import { EditProfileComponent } from './components/actor/displayProfile/editProfile.component';
import { AppRoutingModule } from './app-routing.module';
import { ActorService } from './services/actor.service';


export const firebaseConfig = {
  apiKey: "AIzaSyDd_Fx-hyr9nRvXitFgYeCqtHLGmuPj87M",
  authDomain: "acme-explorer-14440.firebaseapp.com",
  databaseURL: "https://acme-explorer-14440.firebaseio.com",
  projectId: "acme-explorer-14440",
  storageBucket: "acme-explorer-14440.appspot.com",
  messagingSenderId: "517457166664"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    HttpClientModule
  ],
  providers: [AngularFireAuth, ActorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
