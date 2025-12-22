import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js';
import './App.css'
import { fetchBeers } from './services/beerService.js';
import RateDialog from './components/rateDialog.jsx';
import Login from './components/login.jsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import GradeIcon from '@mui/icons-material/Grade';
import Box from '@mui/material/Box';
import { logout } from './services/userService.js' ;
import { fetchRatings } from './services/ratingService.js';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ProfileDialog from './components/profileDialog.jsx';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import Stack from '@mui/material/Stack';


function App() {
  const [beers, setBeers] = useState([])
  const [beerIndex, setBeerIndex] = useState(0);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  useEffect(() => {
    async function startup() { 
      setLoading(true);
      const beers = await fetchBeers();
      setBeers(beers || [])
      const u = sessionStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
      setRatings(u ? await fetchRatings(JSON.parse(u).id) : []);
      setLoading(false);
    }

    startup();
  }, [])

  const openRateDialogForBeer = (index) => {
    setBeerIndex(index);
    setOpenRateDialog(true);
  }

  const logoutHandler = async () => {
    await logout();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="App">
        LOADING...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="App">
        <Login setUser={setUser} user={user} loading={loading} setLoading={setLoading} setRatings={setRatings}/>
      </div>
    )
  }

  if(user != null){
    const imageUrl = user.image
          ? supabase.storage
          .from('beer-images')
          .getPublicUrl(user.image)
          .data.publicUrl
          : null
    return (
      <>
    <Box>
      <AppBar>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton
                color='secondary'
                size='large'
                onClick={logoutHandler}
                >
                  <LogoutIcon />
              </IconButton>
              {user && <Typography color='secondary' variant='h5'>{user.name}</Typography>}
              <Avatar variant="rounded" src={imageUrl} onClick={() => setOpenProfileDialog(true)} />
            </Toolbar>
        </AppBar>
      <Box sx={{ marginTop: '80px' }}>
        {beers.map((beer, index) => {
          const imageUrl = beer.image
          ? supabase.storage
          .from('beer-images')
          .getPublicUrl(beer.image)
          .data.publicUrl
          : null
          
          return (
            <Box key={beer.id} className="beer" onClick={() => openRateDialogForBeer(index)}>
              <Typography variant='h5'>{beer.name}</Typography>

              {imageUrl && (
                <img
                src={imageUrl}
                alt={beer.name}
                style={{ maxWidth: '250px' }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                {beer.avg_rating ? 
                <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant='h6'>{beer.avg_rating}</Typography><StarIcon color='secondary' size="small"></StarIcon>
              </Stack> : <Typography variant='h6'>No rating</Typography>  }
              </Box>
              <Divider />
            </Box>
            )
        })}
      </Box>
      </Box>
      <RateDialog beers={beers}
                  user={user}
                  index={beerIndex} 
                  setIndex={setBeerIndex} 
                  openRateDialog={openRateDialog} 
                  setOpenRateDialog={setOpenRateDialog}
                  ratings={ratings}
                  setBeers={setBeers}
                  setRatings={setRatings} />
      <ProfileDialog openProfileDialog={openProfileDialog} 
                     setOpenProfileDialog={setOpenProfileDialog} 
                     imgUrl={imageUrl} />
      
    </>
    )
  }

  return (
    <></>
  )
}

export default App
