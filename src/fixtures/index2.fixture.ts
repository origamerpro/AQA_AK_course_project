import { mergeTests } from '@playwright/test';

// 1. Импортируем фикстуры API-сервисов
// Важно: если ordersCustom.fixture.ts использует 'base' из './index.fixture',
// то index.fixture должен в конечном итоге предоставлять api-сервисы,
// либо вы должны убедиться, что ordersCustom.fixture.ts получает эти зависимости.
// Для простоты, предположим, что api-services.fixture.ts предоставляет все API-клиенты.
import { test as apiServicesTest } from './api-services.fixture';

// 2. Импортируем вашу фикстуру для создания ордеров
import { test as ordersCustomTest } from './ordersCustom2.fixture';

// 3. Импортируем фикстуры UI-сервисов и Page Objects
import { test as uiServicesTest } from './ui-services.fixture';

// Объединяем все наборы фикстур в один корневой объект 'test'
// Порядок здесь может иметь значение, если есть конфликты имен фикстур,
// но обычно Playwright хорошо справляется. Логично располагать зависимости первыми.
export const test = mergeTests(
  apiServicesTest, // Предоставляет базовые API-сервисы (signInApiService, ordersApiService, dataDisposalUtils)
  ordersCustomTest, // Предоставляет фабрики для создания ордеров (orderData, или createDraftOrder, etc.)
  uiServicesTest, // Предоставляет UI-сервисы и Page Objects (homeUIService, orderDetailsPage и т.д.)
);

// Реэкспортируем expect из Playwright для использования в тестах
export { expect } from '@playwright/test';
