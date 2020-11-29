import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { InvoiceService } from "../../service/invoice.service";
import { Invoice } from "../../models/invoice";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import {
  MatSnackBar,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { remove } from "lodash";
import "rxjs/Rx";
import { of as observableOf } from "rxjs/observable/of";
import { catchError } from "rxjs/operators/catchError";
import { map } from "rxjs/operators/map";
import { startWith } from "rxjs/operators/startWith";
import { switchMap } from "rxjs/operators/switchMap";
import { merge } from "rxjs/observable/merge";

@Component({
  selector: "app-invoice-listing",
  templateUrl: "./invoice-listing.component.html",
  styleUrls: ["./invoice-listing.component.scss"]
})
export class InvoiceListingComponent implements OnInit, AfterViewInit {
  color = "primary";
  mode = "indeterminate";
  value = 50;
  displayedColumns = [
    "item",
    "date",
    "due",
    // "qty",
    // "rate",
    // "tax",
    "client",
    "action"
  ];
  dataSource = new MatTableDataSource<Invoice>();
  resultsLength = 0;
  isResultsLoading = false;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  saveButtonHandler() {
    this.router.navigate(["dashboard", "invoices", "new"]);
  }

  deleteBtnHandler(id) {
    this.invoiceService.deleteInvoice(id).subscribe(
      invoice => {
        const removeItems = remove(this.dataSource.data, item => {
          return item._id === invoice._id;
        });
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open("Invoice Deleted", "Success", {
          duration: 2000
        });
      },
      err => {
        this.errorHandler(err, "Fail to delete invoice.");
      }
    );
  }
  editBtnHandler(id) {
    this.router.navigate(["dashboard", "invoices", id]);
  }
  filterText(filterValue: string) {
    this.isResultsLoading = true;
    this.paginator.pageIndex = 0;
    filterValue = filterValue.trim();

    this.invoiceService
      .getInvoices({
        page: this.paginator.pageIndex,
        perPage: this.paginator.pageSize,
        sortField: this.sort.active,
        sortDir: this.sort.direction,
        filter: filterValue
      })
      .subscribe(
        data => {
          this.dataSource.data = data.docs;
          this.resultsLength = data.total;
          this.isResultsLoading = false;
        },
        err => {
          this.errorHandler("Fail to filter invoices", "Error");
        }
      );
  }
  ngOnInit() {
    // this.paginator.page.subscribe(data => {
    //   this.invoiceService
    //     .getInvoices({
    //       page: ++data.pageIndex,
    //       perPage: data.pageSize
    //     })
    //     .subscribe(
    //       data => {
    //         console.log(data);
    //         this.dataSource = data.docs;
    //         this.resultsLength = data.total;
    //       },
    //       err => {
    //         this.errorHandler(err, "Fail to fetch invoices.");
    //       }
    //     );
    // });
  }
  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.ref.detectChanges();
  }
  ngAfterViewInit() {
    // this.paginator.page
    //   .flatMap(() => {
    //     this.isResultsLoading = true;
    //     return this.invoiceService.getInvoices({
    //       page: this.paginator.pageIndex,
    //       perPage: this.paginator.pageSize,
    //       sortField: this.sort.active,
    //       sortDir: this.sort.direction
    //     });
    //   })
    //   .subscribe(
    //     data => {
    //       this.dataSource = data.docs;
    //       this.resultsLength = data.total;
    //       this.isResultsLoading = false;
    //     },
    //     err => this.errorHandler(err, "Fail to fetch invoices.")
    //   );
    // this.sort.sortChange
    //   .flatMap(() => {
    //     this.isResultsLoading = true;
    //     return this.invoiceService.getInvoices({
    //       page: this.paginator.pageIndex,
    //       perPage: this.paginator.pageSize,
    //       sortField: this.sort.active,
    //       sortDir: this.sort.direction
    //     });
    //   })
    //   .subscribe(data => {
    //     this.dataSource = data.docs;
    //     this.resultsLength = data.total;
    //     this.isResultsLoading = false;
    //   });
    // this.populateInvoices();
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isResultsLoading = true;
          return this.invoiceService.getInvoices({
            page: this.paginator.pageIndex,
            perPage: this.paginator.pageSize,
            sortField: this.sort.active,
            sortDir: this.sort.direction,
            filter: ""
          });
        }),
        map(data => {
          this.isResultsLoading = false;
          this.resultsLength = data.total;
          return data.docs;
        }),
        catchError(() => {
          this.isResultsLoading = false;
          this.errorHandler("Fail to fetch invoices", "Error");
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }
  private populateInvoices() {
    this.isResultsLoading = true;
    this.invoiceService
      .getInvoices({
        page: this.paginator.pageIndex,
        perPage: this.paginator.pageSize,
        sortField: this.sort.active,
        sortDir: this.sort.direction,
        filter: ""
      })
      .subscribe(
        data => {
          this.dataSource.data = data.docs;
          this.resultsLength = data.total;
          console.log(data);
        },
        err => {
          this.errorHandler(err, "Fail to fetch invoices.");
        },
        () => {
          this.isResultsLoading = false;
        }
      );
  }

  private errorHandler(err, message) {
    this.isResultsLoading = false;
    console.log(err);
    this.snackBar.open(message, "Error", { duration: 2000 });
  }
}
