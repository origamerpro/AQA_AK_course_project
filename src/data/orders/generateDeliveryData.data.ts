import { faker } from '@faker-js/faker';
import { COUNTRIES } from 'data/customers/countries.data';
import { IDelivery } from 'types/orders.types';
import { DELIVERY } from './delivery.data';

export function generateDeliveryData(params?: Partial<IDelivery>): IDelivery {
  return {
    finalDate: faker.date.future().toISOString().split('T')[0],
    condition: faker.helpers.arrayElement(Object.values(DELIVERY)),
    address: {
      country: faker.helpers.arrayElement(Object.values(COUNTRIES)),
      city: faker.location.city(),
      street: faker.location.street(),
      house: faker.number.int({ min: 1, max: 999 }),
      flat: faker.number.int({ min: 1, max: 500 }),
    },
    ...params,
  };
}
