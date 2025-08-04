import { Component, inject, OnInit } from '@angular/core';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <div class="relative min-h-screen w-full">
      <app-theme-toggle />
    </div>
  `,
  styles: ``,
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  public ngOnInit(): void {
    const currentColorTheme = this.themeService.getPreferredColorTheme();

    this.themeService.setColorTheme(currentColorTheme);
  }
}
