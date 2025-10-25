import { useEffect, useState } from 'react';

import { Button, Grid, IconButton, useMediaQuery } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import {
  Container,
  CreateUrlPopUp,
  DataTable,
  SEO,
  UrlButton,
} from '../components';

import { IGetAllParams, IUrl } from '../@types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  clearDialog,
  deleteUrl,
  getAllUrls,
  openDialog,
} from '../redux/slices';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:899px)');
  const [isOpen, setIsOpen] = useState(false);

  const [recordToDelete, setRecordToDelete] = useState<IUrl | undefined>(
    undefined,
  );

  const { dialog } = useAppSelector((state) => state.system);
  const { records, totalOfRecords } = useAppSelector(
    (state) => state.urls,
  );

  const deleteAction = (row: IUrl) => {
    setRecordToDelete(row);
  };

  const getRecords = (params: IGetAllParams) => {
    dispatch(getAllUrls(params));
  };

  useEffect(() => {
    if (
      recordToDelete &&
      !dialog.isOpen &&
      dialog.return.origin === 'deleteUrl'
    ) {
      if (dialog.return.status) {
        dispatch(deleteUrl(recordToDelete.id));
      }
      setRecordToDelete(undefined);
      dispatch(clearDialog());
    }

    // eslint-disable-next-line
  }, [dialog]);

  useEffect(() => {
    if (recordToDelete && !dialog.isOpen) {
      dispatch(
        openDialog({
          isOpen: true,
          cancel: true,
          title: 'Delete Url',
          message: 'Are you sure you want to delete this Url?',
          origin: 'deleteUrl',
          successLabel: 'Delete',
          return: {},
        }),
      );
    }

    // eslint-disable-next-line
  }, [recordToDelete]);

  return (
    <>
      <SEO title='My Shorten - Dashboard' />
      <Container
        size='lg'
        title='Dashboard'
        subTitle='Manage yours urls'
        hasCard
      >
        <Grid item xs={12}>
          <Button variant='contained' onClick={() => setIsOpen(true)}>
            + Url
          </Button>
        </Grid>
        <DataTable<IUrl>
          title='events'
          showHeader
          totalOfRecords={totalOfRecords}
          onRequestData={getRecords}
          columns={[
            {
              key: 'id',
              label: '#',
              sortKey: 'id',
            },
            {
              key: 'original',
              label: 'URL',
              limit: isMobile ? 10 : 50,
              sortKey: 'original',
            },
            {
              key: 'code',
              label: 'Shorted',
              sortKey: 'code',
              render: (row) => <UrlButton content={row} />,
            },
            {
              key: 'actions',
              label: 'Delete',
              width: 60,
              align: 'center',
              disablePadding: true,
              render: (row) => (
                <IconButton size='small' onClick={() => deleteAction(row)}>
                  <MdDelete />
                </IconButton>
              ),
            },
          ]}
          rows={records}
          defaultOrderBy='id'
        />
      </Container>
      <CreateUrlPopUp isOpen={isOpen} toggle={() => setIsOpen(false)} />
    </>
  );
};
