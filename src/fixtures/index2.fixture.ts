import { mergeTests } from '@playwright/test';
import { test as apiServicesTest } from './api-services.fixture';
import { test as ordersCustomTest } from './ordersCustom2.fixture';
import { test as uiServicesTest } from './ui-services.fixture';

export const test = mergeTests(
  apiServicesTest,
  ordersCustomTest,
  uiServicesTest,
);

export { expect } from '@playwright/test';
