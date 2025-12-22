import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { supabase } from '../lib/supabase.js';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SportsBarIcon from "@mui/icons-material/SportsBar";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { getRatingByBeerAndUser, updateRating, addRating, fetchRatings } from '../services/ratingService.js';
import { fetchBeers } from '../services/beerService.js';
import MapIcon from '@mui/icons-material/Map';

function RateDialog({ index, setIndex, openRateDialog, setOpenRateDialog, beers, setBeers, user, ratings, setRatings }) {

  const[loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenRateDialog(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const { data: { publicUrl } } = supabase.storage
      .from('beer-images')
      .getPublicUrl(imagePath);
    return publicUrl;
  }

  const previousBeer = () => {
    setIndex((prevIndex) => (prevIndex - 1));
  }

  const nextBeer = () => {
    setIndex((prevIndex) => (prevIndex + 1));
  }

  const rateBeer = async (beerId, userId, rating) => {
    setLoading(true);
    const exists = await getRatingByBeerAndUser(beerId, userId);
    if (exists) {
      await updateRating(beerId, userId, rating);
    } else {
      await addRating(beerId, userId, rating);
    }
    let r = await fetchRatings(userId);
    let b = await fetchBeers();
    setRatings(r);
    setBeers(b);
    setLoading(false);
  }
  
  return (
    <>
      { beers && user &&
        <div>
          <Dialog
            fullScreen
            open={openRateDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            scroll="paper"
            >
            <AppBar >
              <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton
                  color="secondary"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography color='secondary' component="div" variant="h5" >
                  The Gauntlet
                </Typography>
                <IconButton
                  color="secondary"
                  aria-label="map"
                >
                  <MapIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <DialogContent sx={{ alignItems: "center", display: "flex", flexDirection: "column" }}>
              <Box sx={{
                    height: 250,
                    mt: 10,
                    mb: 2,
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    bgcolor: "grey.200",
                  }}>
                <img
                  src={getImageUrl(beers[index]?.image)}
                  alt={beers[index]?.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // crop
                    display: "block",
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2, mb: 2 }}> 
                { ratings && ratings.length > 0 && ratings.find(x => x.beer_id === beers[index]?.id) ?
                  <>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => {
                        if(i < ratings.find(x => x.beer_id === beers[index]?.id)?.rating) {
                          return <SportsBarIcon fontSize="large" onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)} key={i} color='trim' />;
                        } else {
                          return <SportsBarIcon fontSize="large" onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)} key={i} style={{ color: '#C0C0C0' }} />;
                        }
                      })}
                    </Stack>
                  </> :
                  <>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => {
                        return <SportsBarIcon key={i}
                                        onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)}
                                        fontSize='large'
                                        sx={{ 
                                          color:'#C0C0C0',
                                          cursor: 'pointer' 
                                        }} />;    
                      })}
                    </Stack>
                  </>
                }
              </Box>
              <Box sx={{ mb: 2, textAlign: "left", width: "100%" }}>
                <Typography textAlign="left" variant="h4" gutterBottom sx={{ mt: 6, mb: 2 }}>
                  {index+1}. {beers[index]?.name} ({beers[index]?.abv}% ABV)
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                  textAlign: "left",
                }}
              >
                <DialogContentText id="alert-dialog-description"
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                  }}>               
                  {beers[index]?.about}
                </DialogContentText>
              </Box>
                { loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,255,255,0.6)',
                      borderRadius: 1,
                    }}
                  >
                    <CircularProgress size={32} />
                  </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
              <IconButton disabled={index === 0} onClick={previousBeer} size='large'>
                <ArrowBackIcon  fontSize="inherit" />
              </IconButton>
              <IconButton disabled={index === beers.length - 1} onClick={nextBeer} size='large'>
                <ArrowForwardIcon fontSize="inherit"   />
              </IconButton>
            </DialogActions>
          </Dialog>
        </div>
      }
    </>
  )
}

export default RateDialog
