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
      console.error('Login failed:', error);
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
        <img
          src={getImageUrl('logo.PNG')}
          alt="The Gauntlet Logo"
          style={{ width: '300px' }}
        />
        <Button size="large" variant="contained" onClick={handleClickOpen}>Login</Button>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>
            {"Log In"}
          </DialogTitle>
          <DialogContent sx={{alignItems: 'center'}}>
              <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' }, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}
                noValidate
                autoComplete="off"
              >
                <TextField id="standard-basic" 
                          label="Username" 
                          variant="standard"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)} />
                <TextField label="Password" 
                          variant="standard"
                          type='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} />
              </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogin}>Log in</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Login
