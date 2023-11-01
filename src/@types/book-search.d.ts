declare module "book-search" {
  export type BookSearchParameter = {
    query: string;
    sort: string;
    page: number;
    size: number | string;
    target: string;
  };
  type BookInformationType = {
    authors: string[];
    contents: string;
    datetime: string;
    isbn: string;
    price: number;
    publisher: string;
    sale_price: number;
    status: string;
    thumbnail: string;
    title: string;
    translators: string[];
    url: string;
  };
}
