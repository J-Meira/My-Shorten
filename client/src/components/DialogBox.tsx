import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { closeDialog } from '../redux/slices';
import { MdClose } from 'react-icons/md';

export const DialogBox = () => {
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.system);

  const onClose = (status: boolean) => {
    dispatch(closeDialog(status));
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={() => onClose(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{dialog.title}</DialogTitle>
      <IconButton
        aria-label='close'
        onClick={() => onClose(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <MdClose />
      </IconButton>
      <DialogContent>
        <DialogContentText component='span' id='alert-dialog-description'>
          {dialog.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {dialog.cancel && (
          <Button
            color='secondary'
            onClick={() => onClose(false)}
            variant='outlined'
          >
            Cancelar
          </Button>
        )}
        <Button
          onClick={() => onClose(true)}
          color='secondary'
          variant='contained'
          autoFocus
        >
          {dialog.successLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
