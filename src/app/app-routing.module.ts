import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MainMenuComponent} from './main-menu/main-menu.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'main', component: MainMenuComponent, data: { state: 'main-menu' }},
  { path: 'storybook', loadChildren: () => import('./storybook/storybook.module').then(m => m.StorybookModule)},
  { path: 'speaking', loadChildren: () => import('./speaking/speaking.module').then(m => m.SpeakingModule)},
  { path: 'finaltest', loadChildren: () => import('./finaltest/finaltest.module').then(m => m.FinaltestModule)},
  { path: 'page-not-found', component: PageNotFoundComponent },

  // routes get parsed from top to bottom so  always put this double asterisk at the end
  { path: '**', redirectTo: '/page-not-found' }
];

// only call forRoot in app module. call forChild anywhere else
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, paramsInheritanceStrategy: 'always', preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
