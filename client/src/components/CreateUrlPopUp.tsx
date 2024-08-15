import { useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import { MdCheck, MdClose } from 'react-icons/md';

import { Formik, FormikProps } from 'formik';

import { UrlButton, Input } from '.';

import { IUrl, IUrlForm } from '../@types';
import { AddUrl, removeLoading, setLoading } from '../redux/slices';
import { useAppDispatch } from '../redux';
import { urlServices } from '../services';
import { useToast } from '../utils/hooks';
import { msgsDict } from '../utils/functions';
import { createUrlSchema } from '../utils/schemas';

interface Props {
  isOpen: boolean;
  toggle: () => void;
}
export const CreateUrlPopUp = ({ isOpen, toggle }: Props) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormikProps<IUrlForm>>(null);
  const [url, setUrl] = useState<IUrl | undefined>(undefined);

  const onSubmit = async (data: IUrlForm) => {
    dispatch(setLoading('createUrl'));
    const result = await urlServices.create(data);
    dispatch(removeLoading('createUrl'));
    if (result.success && result.data) {
      setUrl(result.data);
      dispatch(AddUrl());
    }
  };

  const validate = (formik: FormikProps<IUrlForm>) => {
    if (!formik.isValid) useToast.error(msgsDict('form'));
    formik.handleSubmit();
  };

  const keyCheck = (
    e: React.KeyboardEvent<
      | HTMLInputElement
      | HTMLButtonElement
      | HTMLDivElement
      | HTMLTextAreaElement
    >,
  ) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      formRef?.current?.handleSubmit();
    }
  };

  const handleClose = (e: object, reason: string) => {
    if (e && (reason === 'escapeKeyDown' || reason === 'backdropClick'))
      return false;
    return toggle();
  };

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.handleReset();
    } else {
      setUrl(undefined);
    }

    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <Formik
      initialValues={{
        url: '',
      }}
      validationSchema={createUrlSchema}
      onSubmit={(values) => onSubmit(values)}
      enableReinitialize
      innerRef={formRef}
    >
      {(formik) => (
        <form noValidate>
          <Dialog
            fullWidth
            open={isOpen}
            onClose={handleClose}
            aria-labelledby='pop-up-title'
            aria-describedby='pop-up-description'
            maxWidth='sm'
          >
            <DialogTitle id='pop-up-title'>Add Url</DialogTitle>
            <IconButton
              aria-label='close'
              onClick={toggle}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <MdClose />
            </IconButton>
            <DialogContent>
              <Grid container spacing={2}>
                {url ? (
                  <Grid
                    item
                    xs={12}
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignContent='center'
                    textAlign='center'
                  >
                    <Typography sx={{ mb: 2 }} color='success.main'>
                      <MdCheck /> Url created with success.
                    </Typography>
                    <UrlButton content={url} large />
                  </Grid>
                ) : (
                  <>
                    <Input
                      label='Url'
                      name='url'
                      onKeyDown={keyCheck}
                      required
                      grid={{ lg: 12 }}
                    />
                    <Grid
                      item
                      xs={12}
                      justifyContent='center'
                      display='flex'
                    >
                      <Button
                        onClick={() => validate(formik)}
                        variant='contained'
                      >
                        Short
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};
