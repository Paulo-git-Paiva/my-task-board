import { Component, inject } from '@angular/core';
import {
  MatButtonModule,
  MatIconButton,
  MatAnchor,
  MatButton,
} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatIconButton,
    MatAnchor,
    MatButton,
    MatTooltipModule,
  ],
  template: `
    <div class="fixed top-0 right-0">
      <button
        type="button"
        mat-icon-button
        class="m-1 p-0"
        (click)="themeService.toggleColorTheme()"
        [matTooltip]="themeService.isCurrentThemeDark() ? 'Claro' : 'Escuro'">
        @if (themeService.isCurrentThemeDark()) {
          <mat-icon class="font-icon text-amber-500">light_mode</mat-icon>
        } @else {
          <mat-icon class="font-icon text-sky-500">dark_mode</mat-icon>
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
}
