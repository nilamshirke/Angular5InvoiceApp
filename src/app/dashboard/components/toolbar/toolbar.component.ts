import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { JwtService } from "../../../core/services/jwt.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  constructor(
    private jwtService: JwtService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}
  @Output()
  toggleSideNav = new EventEmitter<void>();

  logout() {
    this.authService.logout().subscribe(
      success => {
        console.log(success);
      },
      error => {
        this.errorHandler(error, "Something wet wrong!!!");
      },
      () => {
        this.jwtService.destroyToken();
        this.router.navigate(["/login"]);
      }
    );
  }
  private errorHandler(err, message) {
    console.log(err);
    this.snackBar.open(message, "Error", { duration: 2000 });
  }
}
