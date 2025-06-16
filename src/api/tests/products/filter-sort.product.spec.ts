import { expect, test } from "fixtures/api-services.fixture";
import { TAGS } from "data/testTags.data";
import { validateResponse } from "utils/validations/responseValidation";
import { negativeAuthCases, negativeFilterCases, negativeFilterCasesWithInvalidManufacturer, negativePaginationCases, negativeSearchCases, negativeSortCases, positiveFilterAndSortCases, positiveFilterCases, positivePaginationCases, positiveSearchCases, positiveSortCases } from "data/products/filter-sort.productCases.data";
import { isSorted } from "utils/isSorted.utils";

test.describe("[API] [Products] Get the list of products with optional filters and sorting", () => {

    let token = "";

    test.beforeEach(async ({ signInApiService }) => {
        token = await signInApiService.loginAsLocalUser();
    });

    test.describe("Positive", () => {

        test.describe("Search", () => {

            positiveSearchCases.forEach(({ name, params, expectedField, expectedValue, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should get products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBeGreaterThan(0);

                        products.forEach((product) => {
                            expect(expectedValue).toContain(product[expectedField]);
                        });
                    });
            });
        });

        test.describe("Filter", () => {

            positiveFilterCases.forEach(({ name, params, expectedField, expectedValue, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should get products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBeGreaterThan(0);

                        products.forEach((product) => {
                            expect(expectedValue).toContain(product[expectedField]);
                        });
                    });
            });
        });

        test.describe("Sort", () => {

            positiveSortCases.forEach(({ name, params, expectedSortField, expectedSortOrder, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should get products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBeGreaterThan(0);

                        isSorted(products, expectedSortField, expectedSortOrder);
                    });
            });
        });

        test.describe("Filter and Sort", () => {

            positiveFilterAndSortCases.forEach(({ name, params, expectedField, expectedValue, expectedSortField, expectedSortOrder, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should get products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBeGreaterThan(0);

                        products.forEach((product) => {
                            expect(expectedValue).toContain(product[expectedField]);
                        });

                        isSorted(products, expectedSortField, expectedSortOrder);
                    });
            });
        });

        test.describe("Pagination", () => {

            positivePaginationCases.forEach(({ name, params, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should get products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBeGreaterThan(0);
                    });
            });
        });
    });

    test.describe("Negative", () => {

        test.describe("Search", () => {

            negativeSearchCases.forEach(({ name, params, expectedCount, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should get the default list of 10 last products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBe(expectedCount);

                    });
            });
        });

        test.describe("Filter", () => {

            negativeFilterCases.forEach(({ name, params, expectedStatusCode, isSuccess, errorMessage, expectedItemsCount }) => {
                test(`Should get the default list of 10 last products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBe(expectedItemsCount);
                    });
            });
            negativeFilterCasesWithInvalidManufacturer.forEach(({ name, params, expectedStatusCode, isSuccess, errorMessage, expectedItemsCount }) => {
                test(`Should NOT get the products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBe(expectedItemsCount);
                    });
            })
        });

        test.describe("Filter without auth", () => {

            negativeAuthCases.forEach(({ name, params, token, expectedStatusCode, isSuccess, errorMessage }) => {
                test(`Should NOT get products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
                    });
            });
        });

        test.describe("Sort", () => {

            negativeSortCases.forEach(({ name, params, expectedStatusCode, isSuccess, errorMessage, expectedItemsCount }) => {
                test(`Should get the default list of 10 last products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        expect(products.length).toBe(expectedItemsCount);
                    });
            });
        });

        test.describe("Pagination", () => {

            negativePaginationCases.forEach(({ name, params, expectedStatusCode, expectedItemsCount, expectedPage, isSuccess, errorMessage }) => {
                test(`Should get the default list of 10 last products: ${name}`,
                    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
                    async ({ productsController }) => {

                        const response = await productsController.getFilteredProducts(token, params);
                        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

                        const products = response.body.Products;
                        console.log(response.body);
                        expect(products.length).toBe(expectedItemsCount);
                        expect(response.body.page).toBe(expectedPage);
                    });
            });
        });


    });
});