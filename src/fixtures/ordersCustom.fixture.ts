import { mergeTests } from '@playwright/test';
import { test as base } from './index.fixture';
import { extractTestData } from '../utils/helper';
import { IOrderFromResponse } from '../types/orders.types';

export interface ICreateOrderData {
  id: string;
  productsIds: string[];
  customerId: string;
}
interface ICustomOrder {
  orderData: (count?: number) => Promise<ICreateOrderData>;
}

export const orderInProcessStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: IOrderFromResponse;
    let id: string = '',
      productsIds: string[] = [],
      customerId: string = '';

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();
      order = await ordersApiService.createInProcessOrder(count, token);

      ({ id, productsIds, customerId } = extractTestData(order));
      return { id, productsIds, customerId };
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
  },
});

export const orderDraftStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: IOrderFromResponse;
    let id: string = '',
      productsIds: string[] = [],
      customerId: string = '';

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();
      order = await ordersApiService.createDraftOrder(count, token);

      ({ id, productsIds, customerId } = extractTestData(order));
      return { id, productsIds, customerId };
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
  },
});

export const orderCanceledStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: IOrderFromResponse;
    let id: string = '',
      productsIds: string[] = [],
      customerId: string = '';

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();
      order = await ordersApiService.createCanceledOrder(count, token);

      ({ id, productsIds, customerId } = extractTestData(order));
      return { id, productsIds, customerId };
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
  },
});

export const orderPartiallyReceivedStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: IOrderFromResponse;
    let id: string = '',
      productsIds: string[] = [],
      customerId: string = '';

    const orderDataFactory = async (count: number = 2, receivedCount = 1) => {
      const productCount = Math.max(count, 2);
      const token = await signInApiService.loginAsLocalUser();

      order = await ordersApiService.createPartiallyReceivedOrder(
        receivedCount,
        productCount,
        token,
      );

      ({ id, productsIds, customerId } = extractTestData(order));
      return { id, productsIds, customerId };
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
  },
});

export const orderReceivedStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: IOrderFromResponse;
    let id: string = '',
      productsIds: string[] = [],
      customerId: string = '';

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();

      order = await ordersApiService.createReceivedOrder(count, token);

      ({ id, productsIds, customerId } = extractTestData(order));
      return { id, productsIds, customerId };
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
  },
});

export const test = mergeTests(
  orderInProcessStatus,
  orderDraftStatus,
  orderCanceledStatus,
  orderPartiallyReceivedStatus,
  orderReceivedStatus,
);
