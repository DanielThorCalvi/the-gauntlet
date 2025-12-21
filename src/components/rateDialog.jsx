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
import StarIcon from "@mui/icons-material/Star";
import Stack from '@mui/material/Stack';
import { getRatingByBeerAndUser, updateRating, addRating, fetchRatings } from '../services/ratingService.js';

function RateDialog({ index, setIndex, openRateDialog, setOpenRateDialog, beers, user, ratings, setRatings }) {

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
    setRatings(r);
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
            >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  {beers[index]?.name}
                </Typography>
              </Toolbar>
            </AppBar>
            <DialogContent sx={{  alignItems: "center", display: "flex", flexDirection: "column" }}>
              <img
                          src={getImageUrl(beers[index]?.image)}
                          alt={beers[index]?.name}
                          style={{ width: '350px' }}
                          />
              <DialogContentText id="alert-dialog-description">               
                {beers[index]?.about}
              </DialogContentText>
                { ratings && ratings.length > 0 && ratings.find(x => x.beer_id === beers[index]?.id) ?
                  <>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => {
                        if(i < ratings.find(x => x.beer_id === beers[index]?.id)?.rating) {
                          return <StarIcon key={i} color='warning' />;
                        } else {
                          return <StarIcon key={i} style={{ color: '#C0C0C0' }} />;
                        }
                      })}
                    </Stack>
                  </> :
                  <>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => {
                        return <StarIcon key={i}
                                        onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)}
                                        sx={{ 
                                          color:'#C0C0C0',
                                          cursor: 'pointer' 
                                        }} />;    
                      })}
                    </Stack>
                  </>
                }
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
