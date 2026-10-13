import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResult, toResult } from '../../core/api/api-problem';
import { Category, CategoryInput, Product, ProductInput } from './catalog.models';

const BASE = '/api/v1/admin/catalog';

@Injectable({ providedIn: 'root' })
export class CatalogApi {
  private readonly http = inject(HttpClient);

  categories(): Promise<Category[]> {
    return firstValueFrom(this.http.get<Category[]>(`${BASE}/categories`));
  }

  products(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`${BASE}/products`));
  }

  saveCategory(id: string | null, input: CategoryInput): Promise<ApiResult<Category>> {
    return toResult(
      id
        ? this.http.put<Category>(`${BASE}/categories/${id}`, input)
        : this.http.post<Category>(`${BASE}/categories`, input),
    );
  }

  saveProduct(id: string | null, input: ProductInput): Promise<ApiResult<Product>> {
    return toResult(
      id ? this.http.put<Product>(`${BASE}/products/${id}`, input) : this.http.post<Product>(`${BASE}/products`, input),
    );
  }

  setAvailability(id: string, isAvailable: boolean): Promise<ApiResult<Product>> {
    return toResult(this.http.put<Product>(`${BASE}/products/${id}/availability`, { isAvailable }));
  }
}
