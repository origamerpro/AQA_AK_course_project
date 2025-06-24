import { Page } from '@playwright/test';

export class Mock {
  constructor(private page: Page) {}
}

export interface ISortingMockOptions {
  sortField: string;
  sortDir: string;
}

export { expect } from '@playwright/test';
