import { Page } from '@playwright/test';
import { BasePage } from 'ui/pages/base.page';

export class BaseUIService extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }
}
