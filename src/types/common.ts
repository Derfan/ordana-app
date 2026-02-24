export interface BaseEntity {
  id: number;
}

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SortParams<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
