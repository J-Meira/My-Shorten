export type TOrder = 'asc' | 'desc';

export interface IGetAllQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: TOrder;
}
