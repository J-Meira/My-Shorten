import { IUrl, IUser } from './';
declare module 'knex/types/tables' {
  interface Tables {
    urls: IUrl;
    user: IUser;
  }
}
