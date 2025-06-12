import { ICustomerFilterParams } from "types/customer.types";

export function convertRequestParams(params: ICustomerFilterParams): string {
    if (!params || Object.keys(params).length === 0) return "";

    let url = "?";
    for (const key of Object.keys(params) as Array<keyof ICustomerFilterParams>) {

        if (Array.isArray(params[key])) {
            for (const value of params[key]) {
                url += `${url.length === 1 ? "" : "&"}${key}=${value.replaceAll(" ", "%20")}`;
            }
        } else if (typeof params[key] === "string") {
            url += `${url.length === 1 ? "" : "&"}${key}=${params[key].replaceAll(" ", "%20")}`;
        }
    }
    return url;
}