import { expect, test } from "@playwright/test";
import { IResponse, IResponseFields } from "types/api.types";

export function validateResponse<T extends IResponseFields>(

    response: IResponse<T>,
    status: number,
    IsSuccess: boolean,
    ErrorMessage: string | null
) {
    return test.step(`Validate response status: ${status}, IsSuccess: ${IsSuccess}, ErrorMessage: ${ErrorMessage}`, () => {
        expect.soft(response.status).toBe(status);
        expect.soft(response.body.IsSuccess).toBe(IsSuccess);
        expect.soft(response.body.ErrorMessage).toBe(ErrorMessage);
    });
}