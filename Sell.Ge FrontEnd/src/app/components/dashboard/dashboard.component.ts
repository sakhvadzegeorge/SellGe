import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Clothes } from '../../get/Clothes';
import { Shoes } from '../../get/Shoes';
import { User } from '../../get/user';
import { AuthService } from '../../services/auth.service';
import { Clothes2Service } from '../../services/clothes2.service';
import { Shoes2Service } from '../../services/shoes2.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Data Arrays
  clothes: Clothes[] = [];
  shoes: Shoes[] = [];
  users: User[] = [];

  // Selected Items
  selectedClothes?: Clothes;
  selectedShoes?: Shoes;
  selectedUser?: User;

  // UI State
  activeTab: 'clothes' | 'shoes' | 'users' = 'clothes';
  loading = false;  // Added for loader
  processing = false;  // Added for button states
  errorMessage = '';  // Added for error display

  // Pagination
  itemsPerPage = 10;
  clothesPage = 1;
  shoesPage = 1;
  usersPage = 1;

  // Math reference for template
  Math = Math;

  // Form Models
  newClothes: Partial<Clothes> = {
    picture: '',
    name: '',
    brandName: '',
    productTypeName: '',
    clothSize: '',
    gender: '',
    description: '',
    price: 0,
    quantity: 0
  };

  newShoes: Partial<Shoes> = {
    picture: '',
    name: '',
    brandName: '',
    productTypeName: '',
    shoeSize: '',
    gender: '',
    description: '',
    price: 0,
    quantity: 0
  };

  newUser: Partial<User> = {
    firstName: '',
    lastName: '',
    age: 0,
    email: '',
    password: '',
    address: '',
    phone: '',
    zipCode: '',
    avatar: '',
    gender: 0
  };

  // Search Filters
  clothesSearch = '';
  shoesSearch = '';
  usersSearch = '';

  // Modal States
  showClothesModal = false;
  showShoesModal = false;
  showUserModal = false;
  isEditing = false;

  constructor(
    private authService: AuthService,
    private clothesService: Clothes2Service,
    private shoesService: Shoes2Service,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.closeModals();
  }

  loadAllData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Load clothes
    this.clothesService.getClothes().subscribe({
      next: (res) => {
        this.clothes = res;
        // Load shoes after clothes
        this.shoesService.getShoes().subscribe({
          next: (shoesRes) => {
            this.shoes = shoesRes;
            // Load users after shoes
            this.profileService.getUsers().subscribe({
              next: (usersRes) => {
                this.users = usersRes;
                this.loading = false;
              },
              error: (err) => {
                this.handleError('Failed to load users', err);
                this.loading = false;
              }
            });
          },
          error: (err) => {
            this.handleError('Failed to load shoes', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.handleError('Failed to load clothes', err);
        this.loading = false;
      }
    });
  }

  private handleError(title: string, error: any): void {
    this.errorMessage = `${title}: ${error.message || 'Unknown error'}`;
    console.error(title, error);
  }

  get filteredClothes(): Clothes[] {
    if (!this.clothesSearch) return this.clothes;
    return this.clothes.filter(c =>
      c.name.toLowerCase().includes(this.clothesSearch.toLowerCase()) ||
      c.brandName.toLowerCase().includes(this.clothesSearch.toLowerCase())
    );
  }

  get filteredShoes(): Shoes[] {
    if (!this.shoesSearch) return this.shoes;
    return this.shoes.filter(s =>
      s.name.toLowerCase().includes(this.shoesSearch.toLowerCase()) ||
      s.brandName.toLowerCase().includes(this.shoesSearch.toLowerCase())
    );
  }

  get filteredUsers(): User[] {
    if (!this.usersSearch) return this.users;
    return this.users.filter(u =>
      u.firstName.toLowerCase().includes(this.usersSearch.toLowerCase()) ||
      u.lastName.toLowerCase().includes(this.usersSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(this.usersSearch.toLowerCase())
    );
  }

  get pagedClothes(): Clothes[] {
    const start = (this.clothesPage - 1) * this.itemsPerPage;
    return this.filteredClothes.slice(start, start + this.itemsPerPage);
  }

  get pagedShoes(): Shoes[] {
    const start = (this.shoesPage - 1) * this.itemsPerPage;
    return this.filteredShoes.slice(start, start + this.itemsPerPage);
  }

  get pagedUsers(): User[] {
    const start = (this.usersPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  onPriceInput(value: string | number | null): void {
    if (value === '' || value === null) {
      this.newClothes.price = 0;
      return;
    }
    const n = Number(value);
    this.newClothes.price = isNaN(n) ? 0 : n;
  }

  onQuantityInput(value: string | number | null): void {
    if (value === '' || value === null) {
      this.newClothes.quantity = 0;
      return;
    }
    const n = Number(value);
    this.newClothes.quantity = isNaN(n) ? 0 : n;
  }

  get totalClothesPages(): number {
    return Math.ceil(this.filteredClothes.length / this.itemsPerPage);
  }

  get totalShoesPages(): number {
    return Math.ceil(this.filteredShoes.length / this.itemsPerPage);
  }

  get totalUsersPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  nextPage(type: 'clothes' | 'shoes' | 'users'): void {
    if (type === 'clothes' && this.clothesPage < this.totalClothesPages) this.clothesPage++;
    else if (type === 'shoes' && this.shoesPage < this.totalShoesPages) this.shoesPage++;
    else if (type === 'users' && this.usersPage < this.totalUsersPages) this.usersPage++;
  }

  prevPage(type: 'clothes' | 'shoes' | 'users'): void {
    if (type === 'clothes' && this.clothesPage > 1) this.clothesPage--;
    if (type === 'shoes' && this.shoesPage > 1) this.shoesPage--;
    if (type === 'users' && this.usersPage > 1) this.usersPage--;
  }

  // --------- CLOTHES OPERATIONS ---------
  getClothes(): void {
    this.clothesService.getClothes().subscribe({
      next: (res) => this.clothes = res,
      error: (err) => this.showError('Failed to load clothes', err)
    });
  }

  openClothesModal(clothes?: Clothes): void {
    this.isEditing = !!clothes;
    this.selectedClothes = clothes;

    if (clothes) {
      this.newClothes = { ...clothes };
    } else {
      this.resetClothesForm();
    }

    this.showClothesModal = true;
  }

  saveClothes(): void {
    if (!this.validateClothesForm()) return;

    this.processing = true;
    if (this.isEditing && this.selectedClothes) {
      this.clothesService.editClothes(this.selectedClothes.id!, this.newClothes).subscribe({
        next: () => {
          this.showSuccess('Clothes updated successfully!');
          this.closeModals();
          this.getClothes();
          this.processing = false;
        },
        error: (err) => {
          this.showError('Failed to update clothes', err);
          this.processing = false;
        }
      });
    } else {
      this.clothesService.addClothes(this.newClothes as Clothes).subscribe({
        next: () => {
          this.showSuccess('Clothes added successfully!');
          this.closeModals();
          this.getClothes();
          this.processing = false;
        },
        error: (err) => {
          this.showError('Failed to add clothes', err);
          this.processing = false;
        }
      });
    }
  }

  deleteClothes(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete these clothes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e1e1e',
      color: '#eee',
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title',
        confirmButton: 'swal-glass-confirbutton'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.clothesService.deleteAll(id).subscribe({
          next: () => {
            this.showSuccess('Clothes deleted successfully!');
            this.getClothes();
            this.processing = false;
          },
          error: (err) => {
            this.showError('Failed to delete clothes', err);
            this.processing = false;
          }
        });
      }
    });
  }

  addClothesStock(id: number): void {
    this.processing = true;
    this.clothesService.addStock(id, 1).subscribe({
      next: () => {
        this.showSuccess('Stock added successfully!');
        this.getClothes();
        this.processing = false;
      },
      error: (err) => {
        this.showError('Failed to add stock', err);
        this.processing = false;
      }
    });
  }

  reduceClothesStock(id: number): void {
    this.processing = true;
    this.clothesService.reduceStock(id, 1).subscribe({
      next: () => {
        this.showSuccess('Stock reduced successfully!');
        this.getClothes();
        this.processing = false;
      },
      error: (err) => {
        this.showError('Failed to reduce stock', err);
        this.processing = false;
      }
    });
  }

  // --------- SHOES OPERATIONS ---------
  getShoes(): void {
    this.shoesService.getShoes().subscribe({
      next: (res) => this.shoes = res,
      error: (err) => this.showError('Failed to load shoes', err)
    });
  }

  openShoesModal(shoes?: Shoes): void {
    this.isEditing = !!shoes;
    this.selectedShoes = shoes;

    if (shoes) {
      this.newShoes = { ...shoes };
    } else {
      this.resetShoesForm();
    }

    this.showShoesModal = true;
  }

  saveShoes(): void {
    if (!this.validateShoesForm()) return;

    this.processing = true;
    if (this.isEditing && this.selectedShoes) {
      this.shoesService.editShoes(this.selectedShoes.id!, this.newShoes).subscribe({
        next: () => {
          this.showSuccess('Shoes updated successfully!');
          this.closeModals();
          this.getShoes();
          this.processing = false;
        },
        error: (err) => {
          this.showError('Failed to update shoes', err);
          this.processing = false;
        }
      });
    } else {
      this.shoesService.addShoes(this.newShoes as Shoes).subscribe({
        next: () => {
          this.showSuccess('Shoes added successfully!');
          this.closeModals();
          this.getShoes();
          this.processing = false;
        },
        error: (err) => {
          this.showError('Failed to add shoes', err);
          this.processing = false;
        }
      });
    }
  }

  deleteShoes(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete these shoes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e1e1e',
      color: '#eee',
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title',
        confirmButton: 'swal-glass-confirbutton'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.shoesService.deleteAll(id).subscribe({
          next: () => {
            this.showSuccess('Shoes deleted successfully!');
            this.getShoes();
            this.processing = false;
          },
          error: (err) => {
            this.showError('Failed to delete shoes', err);
            this.processing = false;
          }
        });
      }
    });
  }

  addShoesStock(id: number): void {
    this.processing = true;
    this.shoesService.addStock(id, 1).subscribe({
      next: () => {
        this.showSuccess('Stock added successfully!');
        this.getShoes();
        this.processing = false;
      },
      error: (err) => {
        this.showError('Failed to add stock', err);
        this.processing = false;
      }
    });
  }

  reduceShoesStock(id: number): void {
    this.processing = true;
    this.shoesService.reduceStock(id, 1).subscribe({
      next: () => {
        this.showSuccess('Stock reduced successfully!');
        this.getShoes();
        this.processing = false;
      },
      error: (err) => {
        this.showError('Failed to reduce stock', err);
        this.processing = false;
      }
    });
  }

  // --------- USER OPERATIONS ---------
  getUsers(): void {
    this.profileService.getUsers().subscribe({
      next: (res) => this.users = res,
      error: (err) => this.showError('Failed to load users', err)
    });
  }

  openUserModal(user?: User): void {
    this.isEditing = !!user;
    this.selectedUser = user;

    if (user) {
      this.newUser = { ...user };
      this.newUser.password = '';
    } else {
      this.resetUserForm();
    }

    this.showUserModal = true;
  }

  saveUser(): void {
    if (!this.validateUserForm()) return;

    this.processing = true;
    if (this.isEditing && this.selectedUser?.id) {
      this.profileService.updateUser(this.selectedUser.id, this.newUser).subscribe({
        next: () => {
          this.showSuccess('User updated successfully!');
          this.closeModals();
          this.getUsers();
          this.processing = false;
        },
        error: (err) => {
          this.showError('Failed to update user', err);
          this.processing = false;
        }
      });
    }
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this user account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e1e1e',
      color: '#eee',
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title',
        confirmButton: 'swal-glass-confirbutton'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.profileService.deleteUser(id).subscribe({
          next: () => {
            this.showSuccess('User deleted successfully!');
            this.getUsers();
            this.processing = false;
          },
          error: (err) => {
            this.showError('Failed to delete user', err);
            this.processing = false;
          }
        });
      }
    });
  }

  promoteUser(id: number): void {
    this.processing = true;
    this.profileService.promoteUser(id).subscribe({
      next: () => {
        this.showSuccess('User promoted successfully!');
        this.getUsers();
        this.processing = false;
      },
      error: (err) => {
        this.showError('Failed to promote user', err);
        this.processing = false;
      }
    });
  }

  // --------- VALIDATION ---------
  validateClothesForm(): boolean {
    if (!this.newClothes.name?.trim()) {
      this.showError('Validation Error', 'Name is required');
      return false;
    }
    if (!this.newClothes.brandName?.trim()) {
      this.showError('Validation Error', 'Brand name is required');
      return false;
    }
    if (this.newClothes.price! <= 0) {
      this.showError('Validation Error', 'Price must be greater than 0');
      return false;
    }
    return true;
  }

  validateShoesForm(): boolean {
    if (!this.newShoes.name?.trim()) {
      this.showError('Validation Error', 'Name is required');
      return false;
    }
    if (!this.newShoes.brandName?.trim()) {
      this.showError('Validation Error', 'Brand name is required');
      return false;
    }
    if (this.newShoes.price! <= 0) {
      this.showError('Validation Error', 'Price must be greater than 0');
      return false;
    }
    return true;
  }

  validateUserForm(): boolean {
    if (!this.newUser.firstName?.trim()) {
      this.showError('Validation Error', 'First name is required');
      return false;
    }
    if (!this.newUser.lastName?.trim()) {
      this.showError('Validation Error', 'Last name is required');
      return false;
    }
    if (!this.newUser.email?.trim()) {
      this.showError('Validation Error', 'Email is required');
      return false;
    }
    if (!this.isEditing && !this.newUser.password?.trim()) {
      this.showError('Validation Error', 'Password is required for new users');
      return false;
    }
    return true;
  }

  // --------- UI HELPERS ---------
  closeModals(): void {
    this.showClothesModal = false;
    this.showShoesModal = false;
    this.showUserModal = false;
    this.isEditing = false;
    this.resetClothesForm();
    this.resetShoesForm();
    this.resetUserForm();
  }

  resetClothesForm(): void {
    this.newClothes = {
      picture: '',
      name: '',
      brandName: '',
      productTypeName: '',
      clothSize: '',
      gender: '',
      description: '',
      price: 0,
      quantity: 0
    };
  }

  resetShoesForm(): void {
    this.newShoes = {
      picture: '',
      name: '',
      brandName: '',
      productTypeName: '',
      shoeSize: '',
      gender: '',
      description: '',
      price: 0,
      quantity: 0
    };
  }

  resetUserForm(): void {
    this.newUser = {
      firstName: '',
      lastName: '',
      age: 0,
      email: '',
      password: '',
      address: '',
      phone: '',
      zipCode: '',
      avatar: '',
      gender: 0
    };
  }

  showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: '#1e1e1e',
      color: '#eee',
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title'
      }
    });
  }

  showError(title: string, error: any): void {
    this.errorMessage = `${title}: ${error.message || 'An error occurred'}`;
    Swal.fire({
      icon: 'error',
      title: title,
      text: error.message || 'An error occurred',
      background: '#1e1e1e',
      color: '#eee',
      customClass: {
        popup: 'swal-glass-popup',
        title: 'swal-glass-title',
        confirmButton: 'swal-glass-confirbutton'
      }
    });
  }

  logout(): void {
    this.processing = true;
    this.authService.logout();
    setTimeout(() => {
      this.processing = false;
    }, 1000);
  }
}