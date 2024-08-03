// src/components/Landing.js
import React from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import {  ArrowDownward } from '@mui/icons-material';

const LandingPage = () => {
  return (
    <Box sx={{minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', mb: 4}}>
      <Container maxWidth="md">
        <Box sx={{ borderRadius: '16px', padding: '40px 30px', textAlign: 'center'}}>
          <Typography variant="h2" component="h1" gutterBottom>
            Ingredients Detector
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Discover AI-Powered Meals with What You Have
          </Typography>
          <Typography variant="body1" paragraph gutterBottom>
            Using Google Vision API and generative AI, Ingredients Detector simplifies meal prep by identifying ingredients from images and generating delicious recipes.
          </Typography>
          <Grid container justifyContent="center">
            <ArrowDownward className="bounce" style={{ fontSize: '40px', cursor: 'pointer' }} />
          </Grid>
          <Button variant="contained" component="a" href="/main" sx={{ mt: 4 }}>
            Try it now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
