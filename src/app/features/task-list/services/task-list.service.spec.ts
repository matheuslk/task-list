import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { TaskListService } from './task-list.service';
import { tap } from 'rxjs';

fdescribe(TaskListService.name, () => {
  beforeAll(() => MockBuilder(TaskListService));

  it('should be created', () => {
    const fixture = MockRender(TaskListService);
    expect(fixture.point.componentInstance).toBeDefined();
  });

  it('should load task lists', () => {
    const fixture = MockRender(TaskListService);
    const taskListService = fixture.point.componentInstance;
    const localStorageService = ngMocks.findInstance(LocalStorageService);
    const localStorageSpy = spyOn(localStorageService, 'setItem');

    taskListService.load();

    expect(localStorageSpy).toHaveBeenCalledTimes(1);
  });

  describe('getTaskLists$', () => {
    it('should get all task lists', () => {
      const fixture = MockRender(TaskListService);
      const taskListService = fixture.point.componentInstance;

      taskListService
        .getTaskLists$()
        .pipe(
          tap((taskLists) => {
            expect(taskLists.fixed.length).toBe(0);
            expect(taskLists.taskLists.length).toBe(1);
          }),
        )
        .subscribe();
    });
    it('should get task lists by title', () => {
      const fixture = MockRender(TaskListService);
      const taskListService = fixture.point.componentInstance;

      taskListService
        .getTaskLists$('titulo')
        .pipe(
          tap((taskLists) => {
            expect(taskLists.fixed.length).toBe(0);
            expect(taskLists.taskLists.length).toBe(0);
          }),
        )
        .subscribe();
    });
  });

  it('should store task list', () => {
    const fixture = MockRender(TaskListService);
    const taskListService = fixture.point.componentInstance;

    taskListService
      .storeTaskList$({
        title: 'new task list',
        isFixed: false,
      })
      .pipe(
        tap((taskList) => {
          expect(taskList).toBeDefined();
        }),
      )
      .subscribe();
  });
});
