export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  address?: string;
  phone?: string;
  zipCode?: string;
  avatar?: string;
  gender?: number;
  role?: number;
  password?: string;
}
