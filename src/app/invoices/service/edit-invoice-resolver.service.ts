import { Injectable } from "@angular/core";
import { Invoice } from "../models/invoice";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { InvoiceService } from "./invoice.service";
import { take, map } from "rxjs/operators";

@Injectable()
export class EditInvoiceResolverService implements Resolve<Invoice> {
  constructor(private invoiceService: InvoiceService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Invoice> {
    let id = route.paramMap.get("id");
    return this.invoiceService.getInvoice(id).pipe(
      take(1),
      map(
        invoice => {
          if (invoice) return invoice;
        },
        error => {
          this.router.navigate(["dashboard", "invoices"]);
          return null;
        }
      )
    );
  }
}
