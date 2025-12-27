import { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addComment } from '../services/commentService.js';
import Avatar from '@mui/material/Avatar';
import { supabase } from '../lib/supabase.js';
import SendIcon from '@mui/icons-material/Send';

function CommentDialog({ openDialog, setOpenDialog, comments, setComments, beerId }) {

  const handleClose = () => {
    setOpenDialog(false);
  };

  const createComment = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const newComment = await addComment(beerId, user.id, commentText);
    setCommentText('');
    setComments([...comments, newComment])
  }

  const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(imagePath);
      return publicUrl;
    }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  const [commentText, setCommentText] = useState('');
  const isCommentValid = commentText.trim().length > 0;

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        scroll='paper'
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "background.paper",
                  borderBottom: "1px solid",
                  borderColor: 'divider'
                }}>
            <TextField
              multiline
              fullWidth
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button endIcon={<SendIcon />} disabled={!isCommentValid} variant="contained" sx={{ mt: 1, mb: 2, float: 'right' }} onClick={createComment}>Send</Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2}}>
              {comments && comments.length > 0 ? (
                <div>
                  {comments.map((comment) => (
                    <Box key={comment.id}
                          sx={{
                          gap: 1,
                          mb: 4,
                        }}>                   
                      <Box 
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb:1
                        }}>
                        <Avatar sx={{ width: 48, height: 48 }}src={getImageUrl(comment.users.image)}></Avatar>
                        <Typography variant='subtitle2'>
                          {comment.users.name}
                        </Typography>
                        <Typography variant='body2'  sx={{ ml: "auto", whiteSpace: "nowrap" }}>
                          {formatDate(comment.created_at)}
                        </Typography>
                      </Box>
                      <Typography sx={{ pl: 7 }}>
                        {comment.comment}
                      </Typography>             
                    </Box>
                  ))}
                </div>
              ) : (
                <Typography>No comments yet.</Typography>
              )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default CommentDialog;