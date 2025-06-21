import { mergeTests } from '@playwright/test';
import { test as base } from './index.fixture';
import { extractIds, extractTestData } from '../utils/helper';

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
    let order: any;
    let orderDetails: any;

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();
      order = await ordersApiService.createInProcessOrder(count, token);

      return extractTestData(order);
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown(
      ...[order?._id ? [order._id] : []],
      extractIds(orderDetails?.products),
      ...[orderDetails.customer?._id ? [orderDetails.customer._id] : []],
    );
  },
});

export const orderDraftStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: any;
    let orderDetails: any;

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();
      order = await ordersApiService.createDraftOrder(count, token);

      return extractTestData(order);
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown(
      ...[order?._id ? [order._id] : []],
      extractIds(orderDetails?.products),
      ...[orderDetails.customer?._id ? [orderDetails.customer._id] : []],
    );
  },
});

export const orderCanceledStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: any;
    let orderDetails: any;

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();
      order = await ordersApiService.createCanceledOrder(count, token);

      return extractTestData(order);
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown(
      ...[order?._id ? [order._id] : []],
      extractIds(orderDetails?.products),
      ...[orderDetails.customer?._id ? [orderDetails.customer._id] : []],
    );
  },
});

export const orderPartiallyReceivedStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: any;
    let orderDetails: any;

    const orderDataFactory = async (count: number = 2, receivedCount = 1) => {
      const productCount = Math.max(count, 2);
      const token = await signInApiService.loginAsLocalUser();

      order = await ordersApiService.createPartiallyReceivedOrder(
        receivedCount,
        productCount,
        token,
      );

      return extractTestData(order);
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown(
      ...[order?._id ? [order._id] : []],
      extractIds(orderDetails?.products),
      ...[orderDetails.customer?._id ? [orderDetails.customer._id] : []],
    );
  },
});

export const orderReceivedStatus = base.extend<ICustomOrder>({
  orderData: async (
    { signInApiService, ordersApiService, dataDisposalUtils },
    use,
  ) => {
    let order: any;
    let orderDetails: any;

    const orderDataFactory = async (count: number = 1) => {
      const token = await signInApiService.loginAsLocalUser();

      order = await ordersApiService.createReceivedOrder(count, token);

      return extractTestData(order);
    };
    await use(orderDataFactory);

    await dataDisposalUtils.tearDown(
      ...[order?._id ? [order._id] : []],
      extractIds(orderDetails?.products),
      ...[orderDetails.customer?._id ? [orderDetails.customer._id] : []],
    );
  },
});

export const test = mergeTests(
  orderInProcessStatus,
  orderDraftStatus,
  orderCanceledStatus,
  orderPartiallyReceivedStatus,
  orderReceivedStatus,
);
