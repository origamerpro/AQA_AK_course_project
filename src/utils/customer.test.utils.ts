import { CustomersController } from 'api/controllers/customers.controller';
import { generateCustomerData } from 'data/customers/generateCustomer.data';

export async function createTestUsers(
  controller: CustomersController,
  token: string,
  count = 3,
) {
  const users = [];
  const createdIds = [];

  for (let i = 0; i < count; i++) {
    const response = await controller.create(generateCustomerData(), token);
    if (!response?.body?.Customer?._id) {
      throw new Error('Customer creation failed: missing _id');
    }
    createdIds.push(response.body.Customer._id);
    users.push(response.body.Customer);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return { users, createdIds };
}
