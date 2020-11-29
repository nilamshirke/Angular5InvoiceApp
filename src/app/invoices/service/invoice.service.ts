import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Invoice, InvoicePaginationRsp } from "../models/invoice";
import { Observable } from "rxjs/Observable";

const BASE_URL = "http://localhost:3000/api";

@Injectable()
export class InvoiceService {
  constructor(private httpClient: HttpClient) {}

  getInvoices({
    page,
    perPage,
    sortField,
    sortDir,
    filter
  }): Observable<InvoicePaginationRsp> {
    debugger;
    let queryString = `${BASE_URL}/invoices?page=${page +
      1}&perpage=${perPage}`;
    if (sortField && sortDir) {
      queryString = `${queryString}&sortField=${sortField}&sortDir=${sortDir}`;
    }
    if (filter) {
      queryString = `${queryString}&filter=${filter}`;
    }
    return this.httpClient.get<InvoicePaginationRsp>(queryString);
  }

  createInvoice(body: Invoice): Observable<Invoice> {
    return this.httpClient.post<Invoice>(`${BASE_URL}/invoices`, body);
  }

  deleteInvoice(id: string) {
    return this.httpClient.delete<Invoice>(`${BASE_URL}/invoices/${id}`);
  }
  getInvoice(id: string): Observable<Invoice> {
    return this.httpClient.get<Invoice>(`${BASE_URL}/invoices/${id}`);
  }
  updateInvoice(id: string, body: Invoice) {
    return this.httpClient.put<Invoice>(`${BASE_URL}/invoices/${id}`, body);
  }
}
