import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Task } from '../model/task.model';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { task } from '../../../__mocks__/tasck';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _httpClient = inject(HttpClient);

  public tasks = signal<Task[]>([]);

  public numberOfTasks = computed(() => {
    this.tasks().length;
  });

  public readonly _apiUrl = environment.apiUrl;

  public getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>(`${this._apiUrl}/tasks`).pipe(
      tap(tasks => {
        this.tasks.set(tasks);
      })
    );
  }

  public createTasck(task: Task): Observable<Task> {
    return this._httpClient
      .post<Task>(`${this._apiUrl}/tasks`, task)
      .pipe(tap(tasks => this.insertATasksInTheTasksList(tasks)));
  }

  public insertATasksInTheTasksList(newTask: Task): void {
    const updatedTasks = [...this.tasks(), newTask];
    const sortedTasks = this.getSortedTasks(updatedTasks);

    this.tasks.set(sortedTasks);
  }

  public updateTask(updatedTask: Task): Observable<Task> {
    return this._httpClient
      .put<Task>(`${this._apiUrl}/tasks/${updatedTask.id}`, updatedTask)
      .pipe(tap(task => this.updateATasksInTheTasksList(task)));
  }

  public updateIsComplitedStatus(
    taskId: string,
    isCompleted: boolean
  ): Observable<Task> {
    return this._httpClient
      .patch<Task>(`${this._apiUrl}/tasks/${taskId}`, {
        isCompleted,
      })
      .pipe(tap(task => this.updateATasksInTheTasksList(task)));
  }

  public updateATasksInTheTasksList(updatedTask: Task): void {
    this.tasks.update(tasks => {
      const allTaksWithUpdatedTaskRemoved = tasks.filter(
        task => task.id != updatedTask.id
      );
      const updateTaskList = [...allTaksWithUpdatedTaskRemoved, updatedTask];
      return this.getSortedTasks(updateTaskList);
    });
  }

  public deletedTask(taskId: string): Observable<Task> {
    return this._httpClient
      .delete<Task>(`${this._apiUrl}/tasks/${taskId}`)
      .pipe(tap(() => this.deleteATasksInTheTasksList));
  }

  public deleteATasksInTheTasksList(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id != taskId));
  }

  public getSortedTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.title?.localeCompare(b.title));
  }
}
