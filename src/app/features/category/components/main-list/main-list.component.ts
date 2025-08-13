import { CategoryService } from './../../service/category.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-main-list',
  standalone: true,
  imports: [],
  template: `<section class="mt-16 mx-12 pl-8">
    <span class="text-2xl font-semibold">Categorias</span>
    <ul class="mt-4 space-y-4">
      @for (category of categories(); track category.id) {
        <li class="text2xl font-medium">{{ category.name }}</li>
      }
    </ul>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainListComponent {
  private readonly CategoryService = inject(CategoryService);
  public categories = this.CategoryService.categories;
}
