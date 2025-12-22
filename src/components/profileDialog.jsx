import { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

function ProfileDialog({ openProfileDialog, setOpenProfileDialog, imgUrl }) {

  const handleClose = () => {
    setOpenProfileDialog(false);
  };

  return (
    <>
      {imgUrl && (
        <Dialog
          open={openProfileDialog}
          onClose={handleClose}
          fullWidth
        >
          <DialogContent sx={{
              p: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <img
              src={`${imgUrl}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100vh',
                objectFit: 'contain',
              }}
              loading="lazy"
      />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ProfileDialog;