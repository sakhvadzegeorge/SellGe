import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  token = '';
  email = '';
  submitted = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ?? '';
      this.email = params['email'] ?? '';
    });

    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid || !this.token || !this.email) return;

    this.loading = true;

    this.auth.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.form.value.newPassword
    }).subscribe({
      next: () => {
        alert('Password reset successfully');
        this.form.reset();
        this.loading = false;
      },
      error: err => {
        alert('Reset link is invalid or expired');
        this.loading = false;
      }
    });
  }
}
