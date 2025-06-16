import { STATUS_CODES } from "data/statusCodes";
import { MANUFACTURERS } from "./manufacturers.data";
import { productsSortField, sortDirection } from "types/api.types";
import { IProduct, IProductFilterParams, IProductsFilteredResponse } from "types/products.types";

interface IProductFilterCases {
    name: string;
    params: IProductFilterParams;
    expectedField: keyof IProduct;
    expectedValue: IProduct[keyof IProduct][];
    expectedStatusCode: STATUS_CODES;
    isSuccess: boolean;
    errorMessage: string | null;
}
interface IProductSearchCases {
    name: string;
    params: IProductFilterParams;
    expectedField: keyof IProduct;
    expectedValue: IProduct[keyof IProduct][];
    expectedStatusCode: STATUS_CODES;
    isSuccess: boolean;
    errorMessage: string | null;
}

interface IProductSortCases {
    name: string;
    params: IProductFilterParams;
    expectedSortField: productsSortField;
    expectedSortOrder: sortDirection;
    expectedStatusCode: STATUS_CODES;
    isSuccess: boolean;
    errorMessage: string | null;
    expectedItemsCount?: number;
}

type IProductFilterAndSortCase = IProductFilterCases & IProductSortCases;

interface IProductPaginationCases {
    name: string;
    params: IProductFilterParams;
    expectedRangeStart: number;
    expectedRangeEnd: number;
    expectedStatusCode: STATUS_CODES;
    isSuccess: boolean;
    errorMessage: string | null;
}

export const positiveFilterCases: IProductFilterCases[] = [

    {
        name: "filter by manufacturer",
        params: { manufacturer: [MANUFACTURERS.APPLE] },
        expectedField: "manufacturer",
        expectedValue: [MANUFACTURERS.APPLE],
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "filter by multiple manufacturers",
        params: { manufacturer: [MANUFACTURERS.SAMSUNG, MANUFACTURERS.SONY] },
        expectedField: "manufacturer",
        expectedValue: [MANUFACTURERS.SAMSUNG, MANUFACTURERS.SONY],
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
]

export const negativeFilterCases = [
    {
        name: "no params",
        params: {},
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "empty manufacturer array",
        params: { manufacturer: [] as unknown as MANUFACTURERS[] },
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
];

export const negativeFilterCasesWithInvalidManufacturer = [
    {
        name: "non existent manufacturer",
        params: { manufacturer: ["NonExistentManufacturer"] as unknown as MANUFACTURERS[] },
        expectedItemsCount: 0,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
];

export const positiveSearchCases: IProductSearchCases[] = [

    {
        name: "search by name",
        params: { search: ["Product 1749938077708"] },
        expectedField: "name",
        expectedValue: ["Product 1749938077708"],
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "search by price",
        params: { search: ["42363"] },
        expectedField: "price",
        expectedValue: [42363],
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "search by manufacturer name",
        params: { search: ["Apple"] },
        expectedField: "manufacturer",
        expectedValue: ["Apple"],
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "search with leading and trailing spaces",
        params: { search: ["   Product 1749938077708   "] },
        expectedField: "name",
        expectedValue: ["   Product 1749938077708   "],
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
]

export const negativeSearchCases = [
    {
        name: "empty search query",
        params: { search: [""] },
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
        expectedCount: 10,
    },
];

export const positiveFilterAndSortCases: IProductFilterAndSortCase[] = [
    {
        name: "filter by manufacturer and sort by price asc",
        params: {
            manufacturer: [MANUFACTURERS.APPLE],
            sortField: "price",
            sortOrder: "asc" as sortDirection,
        },
        expectedField: "manufacturer",
        expectedValue: [MANUFACTURERS.APPLE],
        expectedSortField: "price",
        expectedSortOrder: "asc" as sortDirection,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "filter by multiple manufacturers and sort by name asc",
        params: {
            manufacturer: [MANUFACTURERS.SONY, MANUFACTURERS.XIAOMI],
            sortField: "name",
            sortOrder: "asc" as sortDirection,
        },
        expectedField: "manufacturer",
        expectedValue: [MANUFACTURERS.SONY, MANUFACTURERS.XIAOMI],
        expectedSortField: "name",
        expectedSortOrder: "asc" as sortDirection,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    }
];

export const positiveSortCases: IProductSortCases[] = [

    {
        name: "sort by createdOn asc",
        params: { sortField: "createdOn", sortOrder: "asc" },
        expectedSortField: "createdOn",
        expectedSortOrder: "asc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by createdOn desc",
        params: { sortField: "createdOn", sortOrder: "desc" },
        expectedSortField: "createdOn",
        expectedSortOrder: "desc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by price asc",
        params: { sortField: "price", sortOrder: "asc" },
        expectedSortField: "price",
        expectedSortOrder: "asc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by price desc",
        params: { sortField: "price", sortOrder: "desc" },
        expectedSortField: "price",
        expectedSortOrder: "desc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by name asc",
        params: { sortField: "name", sortOrder: "asc" },
        expectedSortField: "name",
        expectedSortOrder: "asc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by name desc",
        params: { sortField: "name", sortOrder: "desc" },
        expectedSortField: "name",
        expectedSortOrder: "desc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by manufacturer asc",
        params: { sortField: "manufacturer", sortOrder: "asc" },
        expectedSortField: "manufacturer",
        expectedSortOrder: "asc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "sort by manufacturer desc",
        params: { sortField: "manufacturer", sortOrder: "desc" },
        expectedSortField: "manufacturer",
        expectedSortOrder: "desc",
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
]

export const negativeSortCases = [
    {
        name: "only sortField without sortOrder",
        params: { sortField: "price" as unknown as productsSortField },
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "only sortOrder without sortField",
        params: { sortOrder: "asc" as unknown as sortDirection },
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "multiple sortField parameters",
        params: { sortField: ["price", "createdOn"] as unknown as productsSortField },
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "invalid sortField",
        params: { sortField: ["invalidField"] as unknown as productsSortField },
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "invalid sortOrder",
        params: { sortField: ["price"] as unknown as productsSortField, sortOrder: ["invalidOrder"] as unknown as sortDirection },
        expectedItemsCount: 10,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
];

export const positivePaginationCases: IProductPaginationCases[] = [
    {
        name: "pagination: second page returns items 11-20",
        params: { page: 2, limit: 10 },
        expectedRangeStart: 11,
        expectedRangeEnd: 20,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
];

export const negativePaginationCases = [
    {
        name: "pagination with only page, no limit (default limit 10)",
        params: { page: 1 },
        expectedItemsCount: 10,
        expectedPage: 1,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "pagination with only limit, no page (default page 1)",
        params: { limit: 10 },
        expectedItemsCount: 10,
        expectedPage: 1,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
    {
        name: "first non-existent page",
        params: {
            sortField: "createdOn" as productsSortField,
            sortOrder: "desc" as sortDirection,
            page: 26,
            limit: 10,
        },
        expectedItemsCount: 10,
        expectedPage: 1,
        expectedStatusCode: STATUS_CODES.OK,
        isSuccess: true,
        errorMessage: null,
    },
];

export const negativeAuthCases = [
    {
        name: "without authorization token",
        params: {},
        token: "",
        expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
        isSuccess: false,
        errorMessage: "Not authorized",
    },
    {
        name: "with invalid authorization token",
        params: {},
        token: "InvalidToken123",
        expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
        isSuccess: false,
        errorMessage: "Invalid access token",
    },
];
