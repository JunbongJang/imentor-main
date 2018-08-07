import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {StorybookComponent} from './storybook/storybook.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'main', component: MainMenuComponent, data: { state: 'main-menu' }},
  { path: 'storybook', component: StorybookComponent, data: { state: 'storybook' }},
  { path: 'page-not-found', component: PageNotFoundComponent },

  // routes get parsed from top to bottom so  always put this double asterisk at the end
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, paramsInheritanceStrategy: 'always'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
