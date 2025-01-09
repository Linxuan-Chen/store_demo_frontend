export type SearchProductResponse = string[];

export interface GetProductsParams {
    title?: string;
    collection?: string;
    page?: string;
}

export interface Product {
    collection: number;
    description: string;
    id: number;
    inventory: number;
    promotions: Array<string>;
    slug: string;
    title: string;
    unit_price: number;
    images: ProductImageType;
}
export interface GetProductsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
}

export type ProductImageType = {
    id: number;
    image: string;
}[];

export interface GetAProductResponse {
    collection: number;
    description: string;
    id: number;
    inventory: number;
    promotions: [];
    slug: string;
    title: string;
    unit_price: number;
    images: ProductImageType;
}
