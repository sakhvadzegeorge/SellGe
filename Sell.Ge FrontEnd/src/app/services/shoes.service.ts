import { Injectable } from '@angular/core';
import { Shoes } from '../get/Shoes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface FilterParams {
  gender?: string | number;
  brandName?: string;
  productTypeName?: string;
  clothSize?: number;
  priceFrom?: number;
  priceTo?: number;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoesService {

  private urlAll = 'https://localhost:7208/api/Shoes/all';
  private urlBase = 'https://localhost:7208/api/Shoes';
  private urlFiltered = 'https://localhost:7208/api/Shoes/filtered';

  constructor(private http: HttpClient) {}

  getShoes(): Promise<Shoes[]> {
    return firstValueFrom(this.http.get<Shoes[]>(this.urlAll));
  }

  async getShoesByGender(gender: string): Promise<Shoes[]> {
    const all = await this.getShoes();
    return all.filter(i =>
      String(i.gender).toLowerCase() === gender.toLowerCase()
    );
  }

  getShoesById(id: string): Promise<Shoes> {
    return firstValueFrom(this.http.get<Shoes>(`${this.urlBase}/${id}`));
  }

  getFilteredShoes(filters: FilterParams): Promise<Shoes[]> {
    let params = new HttpParams();

    if (filters.gender !== undefined) 
      params = params.set('gender', filters.gender.toString());

    if (filters.brandName)
      params = params.set('brandName', filters.brandName);

    if (filters.productTypeName)
      params = params.set('productTypeName', filters.productTypeName);

    if (filters.clothSize !== undefined)
      params = params.set('clothSize', String(filters.clothSize));

    if (filters.priceFrom !== undefined)
      params = params.set('priceFrom', String(filters.priceFrom));

    if (filters.priceTo !== undefined)
      params = params.set('priceTo', String(filters.priceTo));

    if (filters.name)
      params = params.set('name', filters.name);

    return firstValueFrom(
      this.http.get<Shoes[]>(this.urlFiltered, { params })
    );
  }
}
