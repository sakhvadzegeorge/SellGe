import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(105)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+995\d{9}$/)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{3,6}$/)]],
      avatar: ['', [Validators.required, Validators.pattern('https?://.+')]],
      gender: ['', Validators.required]
    });
  }

  signUp() {
    if (this.signUpForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'FILL IN WITH PROPER INFORMATION',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    const controls = this.signUpForm.value;

    const dto = {
      firstName: controls.firstName,
      lastName: controls.lastName,
      age: Number(controls.age),
      email: controls.email,
      password: controls.password,
      address: controls.address,
      phone: controls.phone,
      zipCode: String(controls.zipCode),
      avatar: controls.avatar,
      gender: controls.gender === 'MALE' ? 1 : 2
    };

    this.authService.signUpService(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'REGISTRATION SUCCESSFUL',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['log-in']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'REGISTRATION FAILED',
          html: `<span class="swal-text">${err.error?.message || 'Unknown error'}</span>`
        });
      }
    });
  }
}
