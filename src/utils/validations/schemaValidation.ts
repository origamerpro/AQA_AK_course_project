import { expect, test } from "@playwright/test";
import Ajv from "ajv";

export function validateSchema(expectedSchema: object, body: object) {
    return test.step("Validate response body against JSON schema", () => {
        const ajv = new Ajv();
        const validate = ajv.compile(expectedSchema);

        const isValid = validate(body);

        if (!isValid) {
            console.log("Data is not valid according to the schema.");
            console.log(validate.errors);
        }

        expect.soft(validate.errors == null, "Should not have JSON schema errors").toBe(true);
        expect.soft(isValid, "Schema validation result").toBe(true);
    });
}