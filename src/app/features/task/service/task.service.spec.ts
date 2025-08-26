import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  task,
  TASK_INTERNAL_SERVER_ERROR_RESPONSE,
  TASK_UNPROCESSIBLE_ENTITY_RESPONSE,
  tasks,
} from '../../../__mocks__/tasck';
import { Task } from '../model/task.model';

describe('TascService', () => {
  let taskService: TaskService;
  let httpTestingController: HttpTestingController;

  const MOCKED_TASKS = tasks;
  const MOCKED_TASK = task;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    taskService = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('creates service', () => {
    expect(taskService).toBeTruthy();
  });
  it('getSortedTasks', () => {
    const sortedTasks = taskService.getSortedTasks(tasks);
    expect(sortedTasks[0].title).toEqual('Comprar pao na padaria');
  });
  describe('getTasks', () => {
    it('should return a list of tasks', waitForAsync(() => {
      taskService.getTasks().subscribe(response => {
        expect(response).toEqual(MOCKED_TASKS);
        expect(taskService.tasks()).toEqual(MOCKED_TASKS);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

      req.flush(MOCKED_TASKS);

      expect(req.request.method).toEqual('GET');
    }));

    it('should throw and error when server return Internal server error', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.getTasks().subscribe({
        next: () => {
          fail('Failed to fetch the tasks list');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

      req.flush('Internal Serve error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(500);
      expect(httpErrorResponse.statusText).toEqual('Internal Server Error');
    }));
  });
  describe('createTasks', () => {
    it('should create a new tasks', () => {
      let task: Task | undefined;

      taskService.createTasck(MOCKED_TASK).subscribe(response => {
        task = response;
      });

      const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

      req.flush(MOCKED_TASK);

      expect(task).toEqual(MOCKED_TASK);
      expect(taskService.tasks()[0]).toEqual(MOCKED_TASK);
      expect(taskService.tasks().length).toEqual(1);
      expect(req.request.method).toEqual('POST');
    });
    it('should throw unprocessible entity with invalid body when cerate a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.createTasck(MOCKED_TASK).subscribe({
        next: () => {
          fail('Failed to add a new task');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('updateTask', () => {
    it('should update a task', waitForAsync(() => {
      taskService.tasks.set([MOCKED_TASK]);

      const updatedTask = MOCKED_TASK;
      updatedTask.title = 'Ir na academia malhar perna';

      taskService.updateTask(updatedTask).subscribe(() => {
        expect(taskService.tasks()[0].title).toEqual(
          'Ir na academia malhar perna'
        );
      });

      const req = httpTestingController.expectOne(
        `${apiUrl}/tasks/${updatedTask.id}`
      );

      req.flush(MOCKED_TASK);

      expect(req.request.method).toEqual('PUT');
    }));

    it('should throw unprocessible entity with invalid body when update a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.tasks.set([MOCKED_TASK]);
      const updatedTask = MOCKED_TASK;
      updatedTask.title = 'Ir na academia treinar perna';

      taskService.updateTask(MOCKED_TASK).subscribe({
        next: () => {
          fail('Failed to update a task');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(
        `${apiUrl}/tasks/${updatedTask.id}`
      );
      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('updateIsComplitedStatus', () => {
    it('should updateIsComplitedStatus of a task', waitForAsync(() => {
      const updatedTask = MOCKED_TASK;
      const methodUrl = `${apiUrl}/tasks/${updatedTask.id}`;

      taskService.tasks.set(MOCKED_TASKS);

      taskService
        .updateIsComplitedStatus(updatedTask.id, true)
        .subscribe(() => {
          expect(taskService.tasks()[0].isCompleted).toBeTruthy();
        });

      const req = httpTestingController.expectOne(methodUrl);

      req.flush({ isCompleted: true });

      expect(req.request.method).toEqual('PATCH');
    }));

    it('should throw and error when update a tasks isCompleted status', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      const updatedTask = MOCKED_TASK;

      const methodUrl = `${apiUrl}/tasks/${updatedTask.id}`;

      taskService.tasks.set(MOCKED_TASKS);

      taskService.updateIsComplitedStatus(updatedTask.id, true).subscribe({
        next: () => {
          fail('Failed to update a task isCompleted status');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(methodUrl);
      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  // describe('deleteTask', () => {
  //   it('should delete a task', waitForAsync(() => {
  //     taskService.tasks.set([MOCKED_TASK]);

  //     taskService.deletedTask(MOCKED_TASK.id).subscribe(() => {
  //       expect(taskService.tasks().length).toEqual(0);
  //     });

  //     const req = httpTestingController.expectOne(
  //       `${apiUrl}/tasks/${MOCKED_TASK.id}`
  //     );

  //     req.flush(null);

  //     expect(req.request.method).toEqual('DELETE');
  //   }));

  //   it('should throw unprocessible entity with invalid body when delete a task', waitForAsync(() => {
  //     let httpErrorResponse: HttpErrorResponse | undefined;

  //     taskService.tasks.set([MOCKED_TASK]);

  //     taskService.deletedTask(MOCKED_TASK.id).subscribe({
  //       next: () => {
  //         fail('Failed to delete a task');
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         httpErrorResponse = error;
  //       },
  //     });

  //     const req = httpTestingController.expectOne(
  //       `${apiUrl}/tasks/${MOCKED_TASK.id}`
  //     );
  //     req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

  //     if (!httpErrorResponse) {
  //       throw new Error('Error needs to be defined');
  //     }

  //     expect(httpErrorResponse.status).toEqual(422);
  //     expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
  //   }));
  // });
});
