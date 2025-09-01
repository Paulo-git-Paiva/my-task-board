import { inject, Injectable, signal } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private _snackBar = inject(MatSnackBar);
  private _openSnackBar(): void {
    this._snackBar.open(this.message(), 'Close', {
      duration: this.durationInMiliSeconds,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  public message = signal('');
  public durationInMiliSeconds = 3000;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';
  public showSnackBar(
    message: string,
    duration: number,
    horizontalPosition: MatSnackBarHorizontalPosition,
    verticalPosition: MatSnackBarVerticalPosition
  ): void {
    this.message.set(message);
    this.durationInMiliSeconds = duration;
    this.horizontalPosition = horizontalPosition;
    this.verticalPosition = verticalPosition;

    this._openSnackBar();
  }
}
