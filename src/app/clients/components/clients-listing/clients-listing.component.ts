import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../services/client.service";
import { Client } from "../../models/client";
import { MatTableDataSource, MatDialog, MatSnackBar } from "@angular/material";
import { ClientPopupComponent } from "../client-popup/client-popup.component";
import { FormDialogComponent } from "../form-dialog/form-dialog.component";
import "rxjs/add/operator/mergeMap";
import { remove } from "lodash";

@Component({
  selector: "app-clients-listing",
  templateUrl: "./clients-listing.component.html",
  styleUrls: ["./clients-listing.component.scss"]
})
export class ClientsListingComponent implements OnInit {
  displayedColumns = ["firstName", "lastName", "email", "action"];
  dataSource = new MatTableDataSource<Client>();
  isResultsLoading = false;
  color = "primary";
  mode = "indeterminate";
  value = 50;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isResultsLoading = true;
    this.clientService.getClients().subscribe(
      clients => {
        this.dataSource.data = clients;
      },
      error => {
        console.log(error);
      },
      () => {
        this.isResultsLoading = false;
      }
    );
  }
  openDialog(clientId: string): void {
    const options = {
      width: "400px",
      height: "300px",
      data: {}
    };
    if (clientId) {
      options.data = {
        clientId: clientId
      };
    }
    let dialogRef = this.dialog.open(FormDialogComponent, options);
    dialogRef
      .afterClosed()
      .filter(clientParam => typeof clientParam === "object")
      // .takeWhile(clientParam => typeof clientParam === "object")
      .flatMap(result => {
        return clientId
          ? this.clientService.updateClient(clientId, result)
          : this.clientService.createClient(result);
      })
      .subscribe(
        client => {
          // console.log(client);
          let successMsg = "";
          if (clientId) {
            const index = this.dataSource.data.findIndex(
              client => client._id === clientId
            );
            this.dataSource.data[index] = client; // Below line works same as this line
            // this.dataSource.data.splice(index, 1, client);
            successMsg = "Client updated!!!";
          } else {
            this.dataSource.data.push(client);
            successMsg = "Client created!!!";
          }
          this.dataSource.data = [...this.dataSource.data];
          this.snackBar.open(successMsg, "Success", {
            duration: 2000
          });
        },
        error => {
          console.log(error);
          this.errorHandler(error, "Error while creating Client");
        }
      );

    /**
     * .subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      this.clientService.createClient(result).subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error)
      );
    });
     */
  }
  saveButtonHandler() {}

  private errorHandler(err, message) {
    // this.isResultsLoading = false;
    console.log(err);
    this.snackBar.open(message, "Error", { duration: 2000 });
  }
  deleteBtnHandler(clientId) {
    // console.log(clientId);
    this.clientService.deleteClient(clientId).subscribe(
      client => {
        const removeItems = remove(this.dataSource.data, item => {
          return item._id === client._id;
        });
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open("Client Deleted", "Success", {
          duration: 2000
        });
      },
      err => {
        this.errorHandler(err, "Fail to delete client.");
      }
    );
  }
}
