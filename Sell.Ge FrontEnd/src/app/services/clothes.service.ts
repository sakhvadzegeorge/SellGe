import { Injectable } from '@angular/core';
import { Clothes } from '../get/Clothes';
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
export class ClothesService {

  private urlAll = 'https://localhost:7208/api/Clothes/all';
  private urlBase = 'https://localhost:7208/api/Clothes';
  private urlFiltered = 'https://localhost:7208/api/Clothes/filtered';

  constructor(private http: HttpClient) {}

  getClothes(): Promise<Clothes[]> {
    return firstValueFrom(this.http.get<Clothes[]>(this.urlAll));
  }

  async getClothesByGender(gender: string): Promise<Clothes[]> {
    const all = await this.getClothes();
    return all.filter(i =>
      String(i.gender).toLowerCase() === gender.toLowerCase()
    );
  }

  getClothesById(id: string): Promise<Clothes> {
    return firstValueFrom(this.http.get<Clothes>(`${this.urlBase}/${id}`));
  }

  getFilteredClothes(filters: FilterParams): Promise<Clothes[]> {
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
      this.http.get<Clothes[]>(this.urlFiltered, { params })
    );
  }
}
