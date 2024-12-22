export interface IPaginationOptions {
  page: number;
  location?: string;
  limit: number;
  role?: number[];
  lang?: string;
  lat?: string;
  routeSetter?: string;
  ratingFrom?: number;
  ratingTo?: number;
  routeGradeFrom?: number;
  routeGradeTo?: number;
  sortBy?: string;
  set?: string;
  type?: string;
  id?: string;
}

export interface ISearchOptions {
  text: string;
  limit: number;
}
