import {
  Grid,
  Pagination as MuiPagination,
  PaginationProps,
} from '@mui/material';

interface Props {
  count: PaginationProps['count'];
  page: PaginationProps['page'];
  onChange: PaginationProps['onChange'];
}

export const Pagination = ({ count, page, onChange }: Props) => (
  <Grid
    item
    xs={12}
    display='flex'
    justifyContent='center'
    alignItems='center'
  >
    <MuiPagination
      color='primary'
      hidePrevButton
      hideNextButton
      shape='rounded'
      size='small'
      count={count}
      page={page}
      onChange={onChange}
    />
  </Grid>
);
