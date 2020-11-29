import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SideNavComponent } from "./components/side-nav/side-nav.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { MaterialModule } from "../shared/material.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { InvoiceListingComponent } from "../invoices/components/invoice-listing/invoice-listing.component";
import { InvoicesModule } from "../invoices/invoices.module";
import { ClientsModule } from "../clients/clients.module";

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    InvoicesModule,
    ClientsModule
  ],
  declarations: [DashboardComponent, SideNavComponent, ToolbarComponent]
})
export class DashboardModule {}
