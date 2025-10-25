export type TOrder = 'asc' | 'desc';

export interface IGetAllParams {
  limit: number;
  page: number;
  orderBy: string;
  order?: TOrder;
}
