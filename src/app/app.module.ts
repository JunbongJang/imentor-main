import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import {AppRoutingModule} from './app-routing.module';
import {StorybookComponent} from './storybook/storybook.component';
import {ChatModule} from './chat/chat.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MainMenuComponent,
    StorybookComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
