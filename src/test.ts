import { MockService, ngMocks } from 'ng-mocks';

import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MockInstance } from 'ng-mocks';
import { LocalStorageKeysEnum } from 'src/app/core/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { TASK_LISTS } from 'src/app/features/task-list/data/mocks/task-list.mock';
import { TASKS } from 'src/app/features/task-list/data/mocks/task.mock';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';

ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

ngMocks.defaultMock(LocalStorageService, (instance) => {
  instance.getItem = (key: string): any => {
    if (key === LocalStorageKeysEnum.TASK_LISTS) {
      return TASK_LISTS;
    } else if (key === LocalStorageKeysEnum.TASKS) {
      return TASKS;
    }
    return [];
  };
});

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
);
