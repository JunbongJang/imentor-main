import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class ServerInterceptor implements  HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const copiedReq = req.clone({responseType: 'text', withCredentials: true}); // because php returns xml data, not json.
    // console.log('intercepted!!: ', copiedReq);
    return next.handle(copiedReq);
  }

}
