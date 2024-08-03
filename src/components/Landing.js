// src/components/Landing.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import {  ArrowDownward } from '@mui/icons-material';

const LandingPage = ({ scrollToSection }) => {
  return (
    <Box sx={{minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', mb: 4}}>
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
            <ArrowDownward className="bounce" style={{ fontSize: '40px', cursor: 'pointer' }} onClick={() => scrollToSection('main')} />
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
