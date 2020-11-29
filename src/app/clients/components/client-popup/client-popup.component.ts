import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-client-popup",
  templateUrl: "./client-popup.component.html",
  styleUrls: ["./client-popup.component.scss"]
})
export class ClientPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ClientPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
