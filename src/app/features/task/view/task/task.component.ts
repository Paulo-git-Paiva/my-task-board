import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  template: `<p>task works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {}
