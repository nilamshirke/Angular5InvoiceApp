import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtService } from "./jwt.service";
import "rxjs/add/operator/do";
import { Router } from "@angular/router";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private jwtService: JwtService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headerConfig = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    debugger;
    const token = this.jwtService.getToken();
    if (token) {
      headerConfig["Authorization"] = `bearer ${token}`;
    }
    const _req = req.clone({ setHeaders: headerConfig });

    return (
      next
        .handle(_req)
        // if JWT token expires below code will  destroy the existing one and navigate to login
        .do(
          (event: HttpEvent<any>) => {},
          err => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this.jwtService.destroyToken();
                this.router.navigate(["/login"]);
              }
            }
          }
        )
    );
  }
}
