import { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

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