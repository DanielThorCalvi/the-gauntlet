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

function App() {
  const [beers, setBeers] = useState([])
  const [beerIndex, setBeerIndex] = useState(0);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    async function startup() { 
      setLoading(true);
      const beers = await fetchBeers();
      setBeers(beers || [])
      const u = sessionStorage.getItem('user');
      console.log('Logged in user:', u);
      setUser(u ? JSON.parse(u) : null);
      setRatings(u ? await fetchRatings(JSON.parse(u).id) : []);
      setLoading(false);
    }

    startup();
  }, [])

  const getStars = (rating) => {
    const fullStars = rating;
    const halfStar = 5 - fullStars > 0 ? 1 : 0;
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '⯨'.repeat(halfStar) + '☆'.repeat(emptyStars);
  }

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
    return (
      <>
    <Box>
      <AppBar>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                color="inherit"
                size='large'
                startIcon={<LogoutIcon />}
                onClick={logoutHandler}
                variant="contained"
                >
                Logout
              </Button>
              {user && <h2>{user.name}</h2>}
              <Button  color="inherit"
                size="large"
                sx={{alignItems: 'center'}}
                variant="contained"
                onClick={() => openRateDialogForBeer(0)}
                endIcon={<GradeIcon />}>
                Rate
              </Button>
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
              <h3>{beer.name}</h3>

              {imageUrl && (
                <img
                src={imageUrl}
                alt={beer.name}
                style={{ maxWidth: '250px' }}
                />
              )}
              <p>{beer.avg_rating ? getStars(beer.avg_rating) : 'No rating'}</p>
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
                  setRatings={setRatings} />
    </>
    )
  }

  return (
    <></>
  )
}

export default App
