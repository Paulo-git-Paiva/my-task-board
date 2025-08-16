import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  template: `<p>Task words!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {}
