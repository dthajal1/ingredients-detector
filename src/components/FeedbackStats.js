import React, { useState, useEffect } from 'react';
import { IconButton, CircularProgress, Box, Grid, Typography, Container } from '@mui/material';
import { Favorite, Chat } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import ResponsesDrawer from './ResponsesDrawer';

const FeedbackStats = ({ setError }) => {
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const userName = user?.fullName;
  const userImgUrl = user?.imageUrl

  const [responses, setResponses] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('/api/responses');
        const result1 = await response1.json();
        setResponses(result1.data.responses);

        const response2 = await fetch('/api/likes');
        const result2 = await response2.json();
        setLikes(result2.data.totalLikes);

        const response3 = await fetch('/api/likes/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        });
        const result3 = await response3.json();
        setHasLiked(result3.data.hasLiked);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userEmail]);


  useEffect(() => {
    const totalResponses = responses.reduce((total, response) => {
      return total + 1 + (response.replies ? response.replies.length : 0);
    }, 0);
    setTotalResponses(totalResponses);
  }, [responses]);

  const handleLikeToggle = async () => {
    try {
      const response =await fetch("/api/likes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, hasLiked: !hasLiked }),
      });
      const result = await response.json();
      setLikes(result.data.totalLikes);
      setHasLiked(!hasLiked);
    } catch (error) {
      setError(`Error ${hasLiked ? 'unliking' : 'liking'}:`);
      console.error(`Error ${hasLiked ? 'unliking' : 'liking'}:`, error);
    }
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      {isLoading ? (
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Loading stats...</Typography>
          </Grid>
        </Grid>
        ) : 
        <>
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleLikeToggle}>
              <Favorite color={hasLiked ? 'primary' : 'inherit'} sx={{ mr: 1 }} /> 
              <Typography variant="body1">{likes}</Typography>
            </IconButton>
            <IconButton onClick={handleDrawerOpen}>
                <Chat sx={{ mr: 1 }} />
                <Typography variant="body1">{totalResponses}</Typography>
            </IconButton>
            <ResponsesDrawer 
              setError={setError} 
              open={drawerOpen} 
              onClose={handleDrawerClose} 
              totalResponses={totalResponses} 
              responses={responses} 
              setResponses={setResponses} 
              userEmail={userEmail} 
              userName={userName} 
              userImgUrl={userImgUrl} 
            />
          </Box>
        </>
      }
    </Container>
  );
};

export default FeedbackStats;