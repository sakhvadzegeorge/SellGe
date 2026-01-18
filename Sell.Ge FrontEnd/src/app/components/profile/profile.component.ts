import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { User } from '../../get/user';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user?: User;
  isOnline = true;
  terminating = false;
  loading = false;
  processing = false;  // Added for button states
  message = '';
  messageType: 'success' | 'error' | '' = '';
  errorMessage = '';  // Added for error display

  showEdit = false;
  showPassword = false;

  private messageTimeout?: any;
  private onlineCheckInterval?: Subscription;

  editForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadUser();
    this.startOnlineCheck();
  }

  ngOnDestroy(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    if (this.onlineCheckInterval) {
      this.onlineCheckInterval.unsubscribe();
    }
  }

  private initForms(): void {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: [0, [Validators.min(0), Validators.max(120)]],
      address: [''],
      phone: [''],
      zipCode: [''],
      avatar: [''],
      gender: [0]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  private startOnlineCheck(): void {
    this.onlineCheckInterval = timer(0, 30000).subscribe(() => {
      this.isOnline = navigator.onLine;
    });
  }

  private showMessage(text: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.message = text;
    this.messageType = type;
    
    // Clear any existing error message when showing a success message
    if (type === 'success') {
      this.errorMessage = '';
    }

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    this.messageTimeout = setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, duration);
  }

  loadUser(): void {
    this.loading = true;
    this.profileService.getMe().subscribe({
      next: (user) => {
        this.user = user;
        this.editForm.patchValue(user);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  logout(): void {
    this.processing = true;
    this.authService.logout();
    this.showMessage('Logged out successfully');
    setTimeout(() => {
      this.router.navigateByUrl('/log-in', { replaceUrl: true });
      this.processing = false;
    }, 1000);
  }

  toggleEdit(): void {
    this.showEdit = !this.showEdit;
    if (this.showEdit) {
      this.showPassword = false;
      this.editForm.patchValue(this.user || {});
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.showEdit = false;
      this.passwordForm.reset();
    }
  }

  cancelEdit(): void {
    this.showEdit = false;
    this.editForm.patchValue(this.user || {});
  }

  cancelPassword(): void {
    this.showPassword = false;
    this.passwordForm.reset();
  }

  save(): void {
    if (this.editForm.invalid) {
      this.showMessage('Please fill in all required fields correctly', 'error');
      return;
    }

    this.processing = true;
    this.profileService.editMe(this.editForm.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.processing = false;
        this.showEdit = false;
        this.showMessage('Profile updated successfully!');
      },
      error: (error) => {
        this.processing = false;
        this.showMessage('Failed to update profile. Please try again.', 'error');
        console.error('Error updating profile:', error);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.showMessage('Please fill in all password fields correctly', 'error');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.showMessage('New passwords do not match', 'error');
      return;
    }

    this.processing = true;
    this.profileService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.processing = false;
        this.showMessage('Password changed successfully!');
        this.passwordForm.reset();
        this.showPassword = false;
      },
      error: (error) => {
        this.processing = false;
        this.showMessage(error.error?.message || 'Password change failed. Please try again.', 'error');
      }
    });
  }

  terminateAccount(): void {
    if (!confirm('⚠️ WARNING: This action is irreversible!\n\nAre you sure you want to terminate your account? All your data will be permanently deleted.')) {
      return;
    }

    this.terminating = true;
    this.processing = true;
    this.profileService.terminateAccount().subscribe({
      next: () => {
        this.terminating = false;
        this.processing = false;
        this.showMessage('Account terminated successfully');
        this.authService.logout();
        setTimeout(() => {
          this.router.navigate(['/log-in']);
        }, 1000);
      },
      error: (error) => {
        this.terminating = false;
        this.processing = false;
        this.showMessage('Failed to terminate account. Please try again.', 'error');
        console.error('Error terminating account:', error);
      }
    });
  }

  getRoleText(role?: number): string {
    if (role === undefined) return 'Not specified';
    switch (role) {
      case 1: return 'Admin';
      case 0: return 'Member';
      default: return 'Not specified';
    }
  }
}