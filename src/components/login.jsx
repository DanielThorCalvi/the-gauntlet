import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { login } from '../services/userService';
import { fetchRatings } from '../services/ratingService.js';
import { supabase } from '../lib/supabase.js';

function Login({ user, setUser, loading, setLoading, setRatings }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getRatings = async (userId) => {
    const r = await fetchRatings(userId);
    setRatings(r);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const u = await login(userName, password);
      await getRatings(u.id);
      setUser(u);
      handleClose();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(imagePath);
      return publicUrl;
    }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src={getImageUrl('logo.PNG')}
          alt="The Gauntlet Logo"
          sx={{ backgroundColor: "primary.main", width: '300px', borderRadius: '8px', p: 2 }}
        />
        <Button size='large' fullWidth variant="contained" onClick={handleClickOpen}>Log in</Button>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle sx={{ backgroundColor: "primary.main", color: "secondary.main"}}>
            Enter the Gauntlet
          </DialogTitle>
          <DialogContent sx={{alignItems: 'center'}}>
              <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, mt: 2, width: '25ch' }, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}
                noValidate
                autoComplete="off"
              >
                <TextField id="standard-basic" 
                          label="Username" 
                          variant="outlined"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)} />
                <TextField label="Password" 
                          variant="outlined"
                          type='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} />
              </Box>
          </DialogContent>
          <DialogActions>
            <Button size='large' fullWidth variant="contained" onClick={handleLogin} sx={{ mx: 3, mb: 2}}>Log in</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Login
