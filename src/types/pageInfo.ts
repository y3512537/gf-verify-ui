export interface PageInfo<T> {
  pageIndex?: number,
  pageSize?: number,
  list: Array<T>,
  total: number,
}