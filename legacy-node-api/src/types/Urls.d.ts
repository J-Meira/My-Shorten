export interface IUrl {
  id: number;
  code: string;
  original: string;
  userId: number;
}

export type TKUrl = keyof IUrl;

export interface IUrlDTO {
  url: string;
}

export interface IUrlInsert extends Omit<IUrl, 'id' | userId> {}

export interface ICitiesRDTO {
  records: IUrl[];
  totalOfRecords: number;
}
