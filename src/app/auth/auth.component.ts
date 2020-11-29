import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../core/services/auth.service";
import { JwtService } from "../core/services/jwt.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  title = "";
  isResultsLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();
    this.title = this.router.url === "/login" ? "Login" : "Signup";
  }
  googleAuthHandler() {
    this.authService.googleAuth().subscribe(
      data => {
        console.log(data);
      },
      error => {
        this.errorHandler(error,"Ooops!!! Something went wrong.");
      }
    );
  }
  public onSubmit() {
    debugger;
    // console.log(this.authForm.value);
    //Send req to backnd server
    if (this.title === "Login") {
      this.isResultsLoading = true;
      this.authService.login(this.authForm.value).subscribe(
        data => {
          // console.log(data);
          this.jwtService.setToken(data.token);
          this.router.navigate(["dashboard", "invoices"]);
        },
        error => {
          // console.log(error);
          this.errorHandler(error, "Ooops !! Something went wrong!!");
        },
        () => {
          this.isResultsLoading = false;
        }
      );
    } else {
      this.isResultsLoading = true;
      this.authService.signup(this.authForm.value).subscribe(
        data => {
          this.router.navigate(["dashboard", "invoices"]); //TODO:: token doesnot get created after sign up
        },
        error => {
          // console.log("Error while creating user!!!");
          this.errorHandler(error, "Error while creating user!!!");
        },
        () => {
          this.isResultsLoading = false;
        }
      );
    }
  }
  private initForm(): any {
    this.authForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  private errorHandler(err, message) {
    this.isResultsLoading = false;
    console.log(err);
    this.snackBar.open(message, "Error", { duration: 2000 });
  }
}
