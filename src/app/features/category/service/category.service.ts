import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Category } from '../model/categoryModel';
import { toSignal } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _apiUrl = environment.apiUrl;

  private httpClient = inject(HttpClient);

  public categories$ = this.httpClient.get<Category[]>(
    `${this._apiUrl}/categories`
  );

  public categories = toSignal(this.categories$, {
    initialValue: [] as Category[],
  });

  public selectedCategoryId = signal('1');
}
