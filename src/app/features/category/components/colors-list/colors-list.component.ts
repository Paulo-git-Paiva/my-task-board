import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CategoryService } from '../../service/category.service';
import { categoryBackgroudColors } from '../../constants/category-colors';

const MODULES = [MatDivider];
@Component({
    selector: 'app-colors-list',
    imports: [...MODULES],
    template: `<section class="flex flex-col gap-4 w-full h-auto mb-4">
    <mat-divider class="opacity-50" />
    <div class="flex flex-wrap justify-center item-center mt-4 px-2 gap-4">
      @for (category of categories(); track category.id) {
        <span
          class=" select-none opacity-80 hover:opacity-100 flex items-center justify-center {{
            categoryBackgroudColors[category.color]
          }} px-4 py-2 rounded-2xl w-[80] text-center text-whit font-semibold"
          >{{ category.name }}</span
        >
      }
    </div>
  </section>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsListComponent {
  private readonly CategoryService = inject(CategoryService);
  public categories = this.CategoryService.categories;
  public categoryBackgroudColors = categoryBackgroudColors;
}
