import { ReactNode, useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableSortLabel,
  TableBody,
  Grid,
  styled,
  tableCellClasses,
  Typography,
} from '@mui/material';

import { Input, Pagination } from './';

import { IGetAllParams } from '../@types';
import { useAppDispatch, useAppSelector } from '../redux';
import { handleRows } from '../redux/slices';

export type IOrder = 'asc' | 'desc';

interface IColumn<T extends object> {
  align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
  className?: string;
  disablePadding?: boolean;
  key: keyof T | 'actions';
  sortKey?: string;
  label?: string;
  limit?: number;
  maxWidth?: number;
  minWidth?: number;
  objectKey?: string;
  render?: (row: T, index?: number) => ReactNode;
  width?: number;
}

interface Props<T extends object> {
  columns: IColumn<T>[];
  rows: T[];
  defaultOrderBy: keyof T;
  defaultDesc?: boolean;
  maxHeight?: number;
  minHeight?: number;
  tabHeight?: number;
  title: string;
  showHeader?: boolean;
  uniqueCol?: string;

  totalOfRecords: number;
  onRequestData: (params: IGetAllParams) => void;
}

const TableRow = styled(MuiTableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    border: 0,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TableCell = styled(MuiTableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    height: '56px',
  },
}));

export const DataTable = <T extends object>({
  columns,
  rows,
  defaultOrderBy,
  defaultDesc,
  maxHeight,
  minHeight,
  tabHeight,
  title,
  showHeader,
  uniqueCol,
  totalOfRecords,
  onRequestData,
}: Props<T>) => {
  const dispatch = useAppDispatch();
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [order, setOrder] = useState<IOrder>(defaultDesc ? 'desc' : 'asc');
  const [totalOfPages, setTotalOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { rowsPerPage } = useAppSelector((state) => state.system);

  const onRequestSort = (key: string) => {
    const isAsc = orderBy === key && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(key as keyof T);
  };

  const compressedString = (value: string, limit: number) => {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  };

  const getRowsPageDetails = (): string => {
    const start = currentPage * rowsPerPage - rowsPerPage + 1;
    const end = start + rows.length - 1;
    return `${totalOfRecords === 0 ? 0 : start} - ${end} of ${totalOfRecords} records`;
  };

  useEffect(() => {
    const newTotal = Math.ceil(totalOfRecords / rowsPerPage);
    setTotalOfPages(newTotal);
    if (currentPage > newTotal && newTotal !== 0) setCurrentPage(newTotal);

    // eslint-disable-next-line
  }, [totalOfRecords, rowsPerPage]);

  useEffect(() => {
    onRequestData({
      limit: rowsPerPage,
      page: currentPage,
      orderBy: orderBy as string,
      order,
    });

    // eslint-disable-next-line
  }, [currentPage, orderBy, rowsPerPage, order, totalOfRecords]);

  return (
    <>
      <Grid item xs={12}>
        <TableContainer
          sx={
            tabHeight || maxHeight || minHeight
              ? {
                  maxHeight: maxHeight || tabHeight,
                  minHeight: minHeight || tabHeight,
                }
              : undefined
          }
        >
          <Table
            stickyHeader={
              tabHeight || maxHeight || minHeight ? true : false
            }
            aria-labelledby={`table-${title}`}
            aria-label={`table-${title}`}
          >
            {showHeader && (
              <TableHead>
                <MuiTableRow>
                  {columns.map((col, index) =>
                    col.key === 'actions' && !col.render ? null : (
                      <TableCell
                        key={`t-header-${col.key.toString()}${index}`}
                        align={col.align}
                        padding={col.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === col.key ? order : false}
                        style={
                          col.minWidth || col.maxWidth || col.width
                            ? {
                                maxWidth: col.maxWidth,
                                minWidth: col.minWidth,
                                width: col.width,
                              }
                            : undefined
                        }
                      >
                        {col.sortKey && col.key !== 'actions' ? (
                          <TableSortLabel
                            active={orderBy === col.sortKey}
                            direction={
                              orderBy === col.sortKey ? order : 'asc'
                            }
                            onClick={() => onRequestSort(col.sortKey!)}
                          >
                            {col.label}
                          </TableSortLabel>
                        ) : (
                          col.label
                        )}
                      </TableCell>
                    ),
                  )}
                </MuiTableRow>
              </TableHead>
            )}
            <TableBody>
              {uniqueCol && (
                <TableRow hover tabIndex={-1}>
                  <TableCell
                    align='center'
                    padding='normal'
                    colSpan={columns.length}
                  >
                    {uniqueCol}
                  </TableCell>
                </TableRow>
              )}
              {rows &&
                rows.map((row, index) => {
                  const labelId = `data-table-${title}-row-${index}`;
                  return (
                    <TableRow tabIndex={-1} key={labelId}>
                      {columns &&
                        columns.map((col, cIndex) => {
                          const key = col.key;
                          if (key === 'actions' || col.render) {
                            if (!col.render) return;
                            col.className =
                              key === 'actions' && !col.className
                                ? 'data-table-col-actions'
                                : col.className;
                            return (
                              <TableCell
                                key={index + key.toString() + cIndex}
                                align={col.align}
                                padding={
                                  col.disablePadding ? 'none' : 'normal'
                                }
                                className={col.className}
                              >
                                {col.render(row, index)}
                              </TableCell>
                            );
                          } else if (col.limit) {
                            return (
                              <TableCell
                                key={index + key.toString() + cIndex}
                                align={col.align}
                                padding={
                                  col.disablePadding ? 'none' : 'normal'
                                }
                                className={col.className}
                              >
                                {compressedString(
                                  row[key] as string,
                                  col.limit,
                                )}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                key={index + key.toString() + cIndex}
                                align={col.align}
                                padding={
                                  col.disablePadding ? 'none' : 'normal'
                                }
                                className={col.className}
                              >
                                {row[key] as string}
                              </TableCell>
                            );
                          }
                        })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {totalOfPages > 1 && (
        <Pagination
          count={totalOfPages}
          page={currentPage}
          onChange={(_e, page) => setCurrentPage(page)}
        />
      )}
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='caption' ml={2}>
          {getRowsPageDetails()}
        </Typography>
        <Input
          label='Records per page'
          name='rowsPerPage'
          value={rowsPerPage}
          required
          model='select'
          localControl
          onChange={(e) => dispatch(handleRows(Number(e.target.value)))}
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 15, label: '15' },
            { value: 20, label: '20' },
            { value: 25, label: '25' },
            { value: 30, label: '30' },
            { value: 35, label: '35' },
            { value: 40, label: '40' },
            { value: 45, label: '45' },
            { value: 50, label: '50' },
          ]}
          grid={{
            lg: 2,
            sm: 3,
            xs: 5,
          }}
        />
      </Grid>
    </>
  );
};
