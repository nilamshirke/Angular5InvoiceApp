import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { InvoiceService } from "../../service/invoice.service";
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { ThrowStmt } from "@angular/compiler";
import { Invoice } from "../../models/invoice";
import { ClientService } from "../../../clients/services/client.service";
import { Client } from "../../../clients/models/client";

@Component({
  selector: "app-invoice-form",
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.scss"]
})
export class InvoiceFormComponent implements OnInit {
  private invoice: Invoice;
  invoiceForm: FormGroup;
  clients: Client[] = [];
  title = "New Invoice";
  selectedClientId;
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.createForm();
    this.setInvoiceToForm();
    this.setClients();
  }
  onSubmit() {
    if (this.invoice) {
      this.invoiceService
        .updateInvoice(this.invoice._id, this.invoiceForm.value)
        .subscribe(
          invoice => {
            this.snackBar.open("Invoice updated", "Success", {
              duration: 2000
            });
            this.router.navigate(["dashboard", "invoices"]);
          },
          err => this.errorHandler(err, "Fail to update invoice.")
        );
    } else {
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
        invoice => {
          this.snackBar.open("Invoice created", "Success", { duration: 1000 });
          this.invoiceForm.reset();
          this.router.navigate(["dashboard", "invoices"]);
          console.log(`${invoice}`);
        },
        err => {
          this.errorHandler(err, "Fail to create invoice");
        }
      );
    }
  }
  private setClients() {
    this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients;
      },
      err => {
        this.errorHandler(err, "Error while fetching clients.");
      }
    );
  }
  private createForm() {
    this.invoiceForm = this.fb.group({
      item: ["", Validators.required],
      date: ["", Validators.required],
      due: ["", Validators.required],
      qty: ["", Validators.required],
      client: ["", Validators.required],
      rate: "",
      tax: ""
    });
  }
  private setInvoiceToForm() {
    //Get the id of invoice
    this.route.params.subscribe(params => {
      let id = params["id"];
      console.log(id);
      if (!id) return;

      this.title = "Edit Invoice";
      //Below code commented as we get invoice from resolver service
      // this.invoiceService.getInvoice(id).subscribe(
      //   invoice => {
      //     this.invoice = invoice;
      //     this.invoiceForm.patchValue(this.invoice);
      //   },
      //   err => this.errorHandler(err, "Fail to get invoice.")
      // );
      this.route.data.subscribe(
        (data: { invoice: Invoice }) => {
          this.invoice = data.invoice;
          if (this.invoice.client) {
            this.invoiceForm.patchValue({
              client: this.invoice.client._id
            });
          }
          this.invoiceForm.patchValue({
            item: this.invoice.item,
            qty: this.invoice.qty,
            rate: this.invoice.rate,
            tax: this.invoice.tax,
            date: this.invoice.date,
            due: this.invoice.due
          });
        },
        error => {}
      );
    });
  }
  private errorHandler(err, message) {
    console.log(err);
    this.snackBar.open(message, "Error", { duration: 2000 });
  }
}
