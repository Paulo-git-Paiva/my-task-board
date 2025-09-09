import { SnackBarService } from './../../../../../shared/services/snack-bar.service';
import { TaskService } from './../../../service/task.service';
import { CategoryService } from '../../../../category/service/category.service';
import { IncludeTaskFormComponent } from './include-task-form.component';
import { task } from '../../../../../__mocks__/tasck';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
describe('IncludeTaskFoemComponent', () => {
  let component: IncludeTaskFormComponent;
  let fixture: ComponentFixture<IncludeTaskFormComponent>;
  let categoryService: CategoryService;
  let taskService: TaskService;
  let snackBarService: SnackBarService;

  const MOCKED_TASK = task;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IncludeTaskFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncludeTaskFormComponent);

    categoryService = TestBed.inject(CategoryService);
    taskService = TestBed.inject(TaskService);
    snackBarService = TestBed.inject(SnackBarService);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Creates a component', () => {
    expect(component).toBeTruthy();
  });

  describe('visibility', () => {
    it('Render initial newTaskForm state value', () => {
      const newTaskForm = component.newTaskForm;

      expect(newTaskForm.controls.title.value).toEqual('');
      expect(newTaskForm.controls.categoryId.value).toEqual('1');
    });

    it('Render initial newTaskForm label  values', () => {
      const titleLabel = fixture.debugElement.query(
        By.css('[data-testid="titleLabel"]')
      );
      const categoryLabel = fixture.debugElement.query(
        By.css('[data-testid="categoryIdLabel"]')
      );

      expect(titleLabel.nativeElement.textContent).toContain('Tarefa');
      expect(categoryLabel.nativeElement.textContent).toContain('Categoria');
    });

    it('Should call selectionChangeHandler when mat-select dispatch selectionChange event', () => {
      const categoryId = '3';
      const event = { value: categoryId };
      const selectionChangeHandlerSpy = jest
        .spyOn(component, 'selectionChangeHandler')
        .mockImplementation(() => {});

      fixture.debugElement
        .query(By.css('mat-select'))
        .triggerEventHandler('selectionChange', event);

      expect(selectionChangeHandlerSpy).toHaveBeenLastCalledWith(event);
    });

    it('Render call showSnackBar wen snackBarConfigHandler is called with a message', () => {
      const message = 'Tarefa incluida!';
      const showSnackBarSpy = jest
        .spyOn(snackBarService, 'showSnackBar')
        .mockImplementation(() => {});

      component.snackBarConfigHandler(message);

      expect(showSnackBarSpy).toHaveBeenLastCalledWith(
        message,
        400,
        'end',
        'top'
      );
    });

    it('should enable/disabler newTasckForm set isIncludeTasckFormDisabled when taskService.isLoading togller', () => {
      const newTaskForm = component.newTaskForm;

      taskService.isLoadingTask.set(true);

      expect(component.isIncludeTaskFormDisabled()).toBeTruthy();
      expect(newTaskForm.disabled).toBeTruthy();

      taskService.isLoadingTask.set(false);

      expect(component.isIncludeTaskFormDisabled()).toBeFalsy();
      expect(newTaskForm.disabled).toBeFalsy();
    });

    describe('onEnterToAddAtask', () => {
      it('Should do nothing when newTaskForm is invalid', () => {
        const createTaskSpy = jest
          .spyOn(taskService, 'createTask')
          .mockReturnValue(of(MOCKED_TASK));

        expect(createTaskSpy).not.toHaveBeenCalled();
        expect(component.isIncludeTaskFormDisabled()).toBeFalsy();
      });

      it('Should call createTask, insertATaskInTheTasksList, snackBarConfigHandler method and update isLoadingTask value', fakeAsync(() => {
        component.newTaskForm.controls.title.setValue(MOCKED_TASK.title);
        component.newTaskForm.controls.categoryId.setValue(
          MOCKED_TASK.categoryId
        );

        const createTaskSpy = jest
          .spyOn(taskService, 'createTask')
          .mockReturnValue(of(MOCKED_TASK));

        const insertATaskInTheTasksListSpy = jest
          .spyOn(taskService, 'insertATasksInTheTasksList')
          .mockImplementation(() => {});

        const snackBarConfigHandlerSpy = jest
          .spyOn(component, 'snackBarConfigHandler')
          .mockImplementation(() => {});

        component.onEnterToAddTask();

        tick(4000);

        expect(createTaskSpy).toHaveBeenCalled();
        expect(insertATaskInTheTasksListSpy).toHaveBeenCalledWith(MOCKED_TASK);
        expect(snackBarConfigHandlerSpy).toHaveBeenCalledWith(
          'Tarefa incluída com sucesso!'
        );
      }));
    });
  });
});
