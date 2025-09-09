import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryComponent } from '../../features/category/view/category/category.component';
import { MatDividerModule } from '@angular/material/divider';
import { TaskComponent } from '../../features/task/view/task/task.component';
const COMPONENTS = [CategoryComponent, TaskComponent];
const MODULES = [MatDividerModule];
@Component({
    selector: 'app-main',
    imports: [...COMPONENTS, ...MODULES],
    template: ` <div class="h-screen flex w-full">
    <app-category class="w-1/4" />
    <mat-divider vertical class="h-full opacity-50" />
    <app-task class="w-3/4 pt-10" />
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {}
