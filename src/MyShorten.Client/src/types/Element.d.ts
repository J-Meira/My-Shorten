import { MenuProps } from '@mui/material';

export interface IElement<T extends object> {
  anchorEl: MenuProps['anchorEl'];
  row?: T;
}
