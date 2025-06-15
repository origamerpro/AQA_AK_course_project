import { expect, test } from '@playwright/test';
import { IResponse, IResponseFields } from 'types/api.types';

export function validateResponse<T extends IResponseFields | null>(
  response: IResponse<T>,
  status: number,
  IsSuccess?: boolean | null,
  ErrorMessage?: string | null,
) {
  return test.step(`Validate response status: ${status}, IsSuccess: ${IsSuccess}, ErrorMessage: ${ErrorMessage}`, () => {
    expect.soft(response.status).toBe(status);

    if (response.body) {
      expect.soft(response.body.IsSuccess).toBe(IsSuccess);
      expect.soft(response.body.ErrorMessage).toBe(ErrorMessage);
    } else {
      expect.soft(IsSuccess).toBeNull();
      expect.soft(ErrorMessage).toBeNull();
    }
  });
}
