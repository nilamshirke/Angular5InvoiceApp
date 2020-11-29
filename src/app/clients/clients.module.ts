import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientsListingComponent } from "./components/clients-listing/clients-listing.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";
import { ClientService } from "./services/client.service";
import { ClientPopupComponent } from "./components/client-popup/client-popup.component";
import { FormDialogComponent } from "./components/form-dialog/form-dialog.component";

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [ClientsListingComponent],
  declarations: [
    ClientsListingComponent,
    ClientPopupComponent,
    FormDialogComponent
  ],
  providers: [ClientService],
  entryComponents: [FormDialogComponent]
})
export class ClientsModule {}
