import { productsSortField, sortDirection } from "types/api.types";
import { IProductFromResponse } from "types/products.types";

export function isSorted(array: IProductFromResponse[], field: productsSortField, order: sortDirection): boolean {

    for (let i = 0; i < array.length - 1; i++) {
        const currentElement = array[i][field];
        const nextElement = array[i + 1][field];

        const comparing = String(currentElement).localeCompare(String(nextElement));

        if (order === "asc" && comparing > 0) return false;
        if (order === "desc" && comparing < 0) return false;
    }
    return true;
}