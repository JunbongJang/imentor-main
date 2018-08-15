import { NgModule } from '@angular/core';
import {ServerService} from './server.service';
import {UserService} from './user.service';
import {GeneralUtilityService} from './general-utility.service';
import {ViewStateService} from './view-state.service';
import {HTTP_INTERCEPTORS} from '../../../node_modules/@angular/common/http';
import {ServerInterceptor} from './server.interceptor';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
  ],
  providers: [ServerService, UserService,
    GeneralUtilityService, ViewStateService,
    {provide: HTTP_INTERCEPTORS, useClass: ServerInterceptor, multi: true}
    ]
})
export class CoreModule {

}
