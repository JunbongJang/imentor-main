import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {ChatModule} from './chat/chat.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import 'bootstrap';
import {MDBBootstrapModule} from 'angular-bootstrap-md'; // these imports work!!! use them elsewhere too


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    NgbModule,
    MDBBootstrapModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
