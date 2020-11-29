import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { JwtService } from "./jwt.service";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private jwtService: JwtService,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    //if user id logged in return true
    //else navigate to login OR return false

    if (this.jwtService.getToken()) {
      return Observable.of(true);
    }
    /**
     * extract the token and authenticate from backend by using this token
     * if  authenticated save token to localstorage
     * and navigate to dashboard/invoices
     */
    const token = route.queryParamMap.get("token");
    if (token) {
      return this.authService.isAuthenticated(token).pipe(
        map(authenticated => {
          if (authenticated === true) {
            this.jwtService.setToken(token);
            this.router.navigate(["/dashboard", "invoices"]);
            return true;
          }
          this.router.navigate(["/login"]);
          return false;
        }),
        catchError((error: any) => {
          this.router.navigate(["/login"]);
          return Observable.of(false);
        })
      );
    } else {
      this.router.navigate(["/login"]);
      return Observable.of(false);
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
