import { Box, Chip, CircularProgress, Divider, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import {ListAlt as ListAltIcon, MenuBook as MenuBookIcon, LocalDining as LocalDiningIcon, Group as GroupIcon, Timer as TimerIcon, Info as InfoIcon, ArrowOutward as ArrowOutwardIcon, YouTube, Circle as CircleIcon } from '@mui/icons-material';
import React from 'react'

const RecipeSection = ({ isRecipeLoading, recipe }) => {
    const showRecipe = () => {
      const { recipeName, servingSize, cookingTime, requiredIngredients, instructions, nutritionalInformation, youtubeSearchLinks } = recipe;
      return (
        <Paper elevation={3} sx={{ marginTop: 2}}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={8}>
              <Typography variant="h5" pl={2} gutterBottom>
                {recipeName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 3, pl: 2 }}>
                <Chip icon={<GroupIcon />} label={`Servings: ${servingSize}`} />
                <Chip icon={<TimerIcon />} label={`${cookingTime.prepTime} mins (prep) + ${cookingTime.cookTime} mins (cook)`} />
              </Box>
              <Typography variant="h6" pl={2} gutterBottom>
                <ListAltIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                Instructions:
              </Typography>
              <Divider />
              <Box sx={{ p: 2 }}>
                {instructions.map((instruction, index) => (
                  <Box key={index}>
                    <Typography variant="body1" paragraph>
                      {instruction}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item sm={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%'}}>
                <Typography variant="h6" gutterBottom>
                  <LocalDiningIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                  Ingredients List:
                </Typography>
                <Divider />
                <List>
                  {requiredIngredients.map((ingredient, index) => (
                    <ListItem key={index}>
                      <CircleIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 8 }} />
                      {ingredient}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item sm={12} md={8}>
              <Typography variant="h6" pl={2} gutterBottom>
                <YouTube sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                YouTube Search Links:
              </Typography>
              <Divider />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 2, pl: 2 }}>
                {youtubeSearchLinks.map((link, index) => (
                  <Typography paragraph key={index}>
                    <ArrowOutwardIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item sm={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%'}}>
                <Typography variant="h6" gutterBottom>
                  <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                  Nutritional Information:
                </Typography>
                <Divider />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Calories: ${nutritionalInformation.calories}g`} color='primary' />
                  <Chip label={`Protein: ${nutritionalInformation.protein}g`} color='primary' />
                  <Chip label={`Carbohydrates: ${nutritionalInformation.carbohydrates}g`} color='primary' />
                  <Chip label={`Fat: ${nutritionalInformation.fat}g`} color='primary' />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Divider />
          <br />
          <Typography variant="body1" color='textSecondary' textAlign='center' gutterBottom>
            Not feeling the recipe? You can always change the ingredients below!
          </Typography>
          <Typography variant="body1" color='textSecondary' textAlign='center' gutterBottom>
            Happy Cooking :)
          </Typography>
          <br />
        </Paper>
      )
    }
    
    return (
      <>
        {isRecipeLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Generating recipe...</Typography>
          </Box>
        )}
        {recipe && showRecipe()}
      </>
    )
}

export default RecipeSection