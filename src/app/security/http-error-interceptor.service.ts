import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppModalService } from '../modals/app-modal.service';

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor{

  constructor(private appModalService : AppModalService ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // log anything here if required
        }
      }), catchError(_err => {
        if (_err.status == 400) {
          let msg = _err.error || 'Http req has failed. Please contact admin.';
          this.appModalService.ack("Error", msg);
        } else if (_err.status == 500) {
          let msg = _err.error || 'Backend server has errored. Please contact admin.';
          this.appModalService.ack("Error", msg);
        }
        let msg = _err.error || '';
        return throwError(msg);
      })
    )
  }
}
