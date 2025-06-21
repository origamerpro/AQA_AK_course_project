import { faker } from '@faker-js/faker';

export function generateCommentData(length: number = 15): string {
  return `Notes ${faker.string.alpha(length)}`;
}
