import { test as controllers } from './controllers.fixture';
import { test as apiServices } from './api-services.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(controllers, apiServices);
