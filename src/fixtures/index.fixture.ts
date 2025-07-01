import { test as controllers } from './controllers.fixture';
import { test as apiServices } from './api-services.fixture';
import { mergeTests } from '@playwright/test';
import { test as uiServices } from './ui-services.fixture';
import { test as pages } from './pages.fixture';

export const test = mergeTests(controllers, apiServices, uiServices, pages);

export { expect } from '@playwright/test';
