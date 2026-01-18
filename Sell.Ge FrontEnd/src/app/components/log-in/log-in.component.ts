import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  returnUrl = '/profile';
  email: string = '';
  password: string = '';
  isForgotMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.returnUrl = '/profile';
  }

  toggleForgot() {
    this.isForgotMode = !this.isForgotMode;
    this.password = '';
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl], { replaceUrl: true });
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer',
            confirmButton: 'swal-glass-confirbutton'
          }
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'EMAIL OR PASSWORD IS WRONG',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer',
            confirmButton: 'swal-glass-confirbutton'
          }
        });
        console.error('Login failed', err);
      }
    });
  }

  sendReset() {
    this.authService.passwordResetRequest(this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Password reset email sent',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer',
            confirmButton: 'swal-glass-confirbutton'
          }
        });
        this.isForgotMode = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: err?.error || 'Failed to send reset email',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'swal-glass-popup',
            title: 'swal-glass-title',
            footer: 'swal-glass-footer',
            confirmButton: 'swal-glass-confirbutton'
          }
        });
        console.error('Password reset failed', err);
      }
    });
  }
}
