import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authServiceSub: Subscription;

    constructor(public authService: AuthService) {}

    ngOnInit() {
      this.authServiceSub = this.authService.getUserAuthStatusListener().subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );
    }

    onLogin(form: NgForm) {
      if (!form) {
        return;
      }
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
    }

    ngOnDestroy() {
      this.authServiceSub.unsubscribe();
    }
}
