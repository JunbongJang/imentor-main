import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {ChatModule} from './chat/chat.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ServerInterceptor} from './shared/server.interceptor';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    AppRoutingModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ServerInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
