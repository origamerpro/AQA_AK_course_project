import { ICustomer } from "types/customer.types";
import { COUNTRIES } from "./countries.data";
import { generateCustomerData } from "./generateCustomer.data";

export const positiveTestCases = [
    {
        name: "Full valid data",
        data: generateCustomerData(),
    },
    {
        name: "Without notes field",
        data: generateCustomerData({ notes: undefined }),
    },
    {
        name: "Email with post/prefix spaces",
        data: generateCustomerData({ email: " newSpecialEmail@fake.com " }),
    },
    {
        name: "1-char name",
        data: generateCustomerData({ name: "A" }),
    },
    {
        name: "40-char name",
        data: generateCustomerData({ name: "A".repeat(10) + ' ' + "A".repeat(29) }),
    },
    {
        name: "Name with post/prefix spaces",
        data: generateCustomerData({ name: " Evilla Roberts " }),
    },
    {
        name: "1-char city",
        data: generateCustomerData({ city: "A" }),
    },
    {
        name: "20-char city",
        data: generateCustomerData({ name: "A".repeat(5) + ' ' + "A".repeat(14) }),
    },
    {
        name: "City with post/prefix spaces",
        data: generateCustomerData({ city: " Stockholm " }),
    },
    {
        name: "1-char street",
        data: generateCustomerData({ street: "A" }),
    },
    {
        name: "40-char street",
        data: generateCustomerData({ name: "A".repeat(15) + ' ' + "A".repeat(24) }),
    },
    {
        name: "Street with post/prefix spaces",
        data: generateCustomerData({ street: " Mannerheim katu " }),
    },
    {
        name: "House = 1",
        data: generateCustomerData({ house: 1 }),
    },
    {
        name: "House = 999",
        data: generateCustomerData({ house: 999 }),
    },
    {
        name: "Flat = 1",
        data: generateCustomerData({ flat: 1 }),
    },
    {
        name: "Flat = 9999",
        data: generateCustomerData({ flat: 9999 }),
    },
    {
        name: "Min valid phone",
        data: generateCustomerData({ phone: "+1234567890" }),
    },
    {
        name: "Max length phone",
        data: generateCustomerData({ phone: "+12345678909876543210" }),
    },
    {
        name: "Phone with post/prefix spaces",
        data: generateCustomerData({ phone: " +1234567890  " }),
    },
    {
        name: "250-char notes",
        data: generateCustomerData({ notes: "N".repeat(250) }),
    },
    {
        name: "Notes with post/prefix spaces",
        data: generateCustomerData({ notes: " Some notes " }),
    },
    {
        name: "Extra unknown field",
        data: {
            ...generateCustomerData(),
            extraField: "should be ignored",
        },
    },
];

export const negativeTestCases = [
    {
        name: "Missing auth token",
        data: generateCustomerData(),
        expectedError: "Not authorized"
    },
    {
        name: "Invalid auth token",
        data: generateCustomerData(),
        expectedError: "Invalid access token"
    },
    {
        name: "Empty email",
        data: generateCustomerData({ email: "" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Email without @",
        data: generateCustomerData({ email: "invalidemail.com" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Missing email field",
        data: generateCustomerData(),
        override: (newCustomerData: ICustomer) => {
            const { email, ...rest } = newCustomerData;
            return rest;
        },
        expectedError: "Incorrect request body"
    },
    {
        name: "Empty name",
        data: generateCustomerData({ name: "" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Name too long (41 chars)",
        data: generateCustomerData({ name: "A".repeat(30) + ' ' + "A".repeat(10) }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Invalid country",
        data: generateCustomerData({ country: "Sweden" as COUNTRIES }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Empty city",
        data: generateCustomerData({ city: "" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "City contains numbers",
        data: generateCustomerData({ city: "City123" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Empty street",
        data: generateCustomerData({ street: "" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Street too long (41 chars)",
        data: generateCustomerData({ street: "A".repeat(35) + ' ' + "A".repeat(5) }),
        expectedError: "Incorrect request body"
    },
    {
        name: "House is zero",
        data: generateCustomerData({ house: 0 }),
        expectedError: "Incorrect request body"
    },
    {
        name: "House exceeds upper limit",
        data: generateCustomerData({ house: 1000 }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Flat is zero",
        data: generateCustomerData({ flat: 0 }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Flat exceeds upper limit",
        data: generateCustomerData({ flat: 10000 }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Phone without plus sign",
        data: generateCustomerData({ phone: "1234567890" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Phone too long",
        data: generateCustomerData({ phone: "+123456789012345678901" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Notes contain < >",
        data: generateCustomerData({ notes: "This note contains <script>" }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Notes exceed max length (251 chars)",
        data: generateCustomerData({ notes: "A".repeat(251) }),
        expectedError: "Incorrect request body"
    },
    {
        name: "Flat is a string",
        data: {
            ...generateCustomerData(),
            flat: "not-a-number" as unknown as number
        },
        expectedError: "Incorrect request body"
    },
];