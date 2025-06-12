import { COUNTRIES } from "data/customers/countries.data";
import { customersSortField, IResponseFields, sortDirection } from "./api.types";
import { String } from "lodash";

export interface ICustomer {
    email?: string;
    name: string;
    country: COUNTRIES;
    city: string;
    street: String;
    house: number;
    flat: number;
    phone: string;
    notes?: string;
    role?: string;
}

export type ICustomerInTable = Pick<ICustomer, "email" | "country" | "name">;

export interface ICustomerFromResponse extends ICustomer {
    _id: string;
    createdOn: string;
}

export interface ICustomerResponse extends IResponseFields {
    Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
    Customers: ICustomerFromResponse[];
    sorting: {
        sortField: customersSortField;
        sortOrder: sortDirection;
    };
}