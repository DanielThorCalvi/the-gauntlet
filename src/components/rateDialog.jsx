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
import ProfileDialog from './profileDialog.jsx';
import CommentIcon from '@mui/icons-material/Comment';
import CommentDialog from './commentDialog.jsx';
import { fetchComments } from '../services/commentService.js';
import Loading from './loading.jsx';

function RateDialog({ index, setIndex, openRateDialog, setOpenRateDialog, beers, setBeers, user, ratings, setRatings }) {

  const[loading, setLoading] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [comments, setComments] = useState([]);

  const handleClose = () => {
    setOpenRateDialog(false);
  };

  const imageUrl = supabase.storage
          .from('images')
          .getPublicUrl('map.png')
          .data.publicUrl

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

  const openMap = () => {
    setOpenProfileDialog(true);
  }

  const openComments = async () => {
    const c = await fetchComments(beers[index]?.id);
    setComments(c);
    setOpenCommentDialog(true);
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
            scroll='paper'
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <AppBar >
              <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton
                  color="secondary"
                  onClick={handleClose}
                  aria-label="close"
                  sx={{ fontSize: 30 }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
                <Typography color='secondary' component="div" variant="h5" >
                  The Gauntlet
                </Typography>
                <IconButton
                  color="secondary"
                  aria-label="map"
                  onClick={openMap}
                  sx={{ fontSize: 30 }}
                >
                  <MapIcon fontSize='inherit'/>
                </IconButton>
              </Toolbar>
            </AppBar>
            <DialogContent sx={{ 
                            alignItems: "center", 
                            display: "flex", 
                            flexDirection: "column",
                            p: 0
                          }}>
              <Box component="img"
                  src={getImageUrl(beers[index]?.image)}
                  alt={beers[index]?.name}
                  style={{
                    width: "100vw",
                    maxWidth: "500px",
                    display: 'block',
                  }}>
              </Box>    
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 6 }}> 
                { ratings && ratings.length > 0 && ratings.find(x => x.beer_id === beers[index]?.id) ?
                  <>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => {
                        if(i < ratings.find(x => x.beer_id === beers[index]?.id)?.rating) {
                          return <SportsBarIcon onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)} key={i} color='trim' sx={{ fontSize: 50 }} />;
                        } else {
                          return <SportsBarIcon onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)} key={i} sx={{ fontSize: 50 }} style={{ color: '#C0C0C0' }} />;
                        }
                      })}
                    </Stack>
                  </> :
                  <>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => {
                        return <SportsBarIcon key={i}
                                        onClick={() => rateBeer(beers[index]?.id, user.id, i + 1)}
                                        sx={{ 
                                          color:'#C0C0C0',
                                          cursor: 'pointer',
                                          fontSize: 50,
                                        }} />;    
                      })}
                    </Stack>
                  </>
                }
              </Box>
              <Box sx={{ textAlign: "left", px: 2 }}>
                <Typography textAlign="left" variant="h4" sx={{ mb: 2}}>
                  {index+1}. {beers[index]?.name} ({beers[index]?.abv}% ABV)
                </Typography>
                <DialogContentText id="alert-dialog-description">               
                  {beers[index]?.about}
                </DialogContentText>
              {/* LOADING */}
              </Box>
              { loading && (
                <Loading />
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
              <IconButton sx={{ fontSize: 30 }} disabled={index === 0} onClick={previousBeer} size='large'>
                <ArrowBackIcon  fontSize="inherit" />
              </IconButton>
              <IconButton sx={{ fontSize: 30 }} onClick={openComments}> 
                <CommentIcon fontSize="inherit" />
              </IconButton>
              <IconButton sx={{ fontSize: 30 }} disabled={index === beers.length - 1} onClick={nextBeer} size='large'>
                <ArrowForwardIcon fontSize="inherit"   />
              </IconButton>
            </DialogActions>
          </Dialog>

          <ProfileDialog openProfileDialog={openProfileDialog} 
                        setOpenProfileDialog={setOpenProfileDialog} 
                        imgUrl={imageUrl} />

          <CommentDialog openDialog={openCommentDialog}
                        beerId={beers[index]?.id}
                        setOpenDialog={setOpenCommentDialog}
                        comments={comments}
                        setComments={setComments} />

        </div>
      }
    </>
  )
}

export default RateDialog
