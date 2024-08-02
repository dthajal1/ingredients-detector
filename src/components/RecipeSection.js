import { Box, CircularProgress, Divider, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import { teal, purple, orange, red, blue, green } from '@mui/material/colors';
import {ListAlt as ListAltIcon, MenuBook as MenuBookIcon, LocalDining as LocalDiningIcon, Lightbulb as LightbulbIcon, Info as InfoIcon, KeyboardArrowRight as KeyboardArrowRightIcon, ArrowOutward as ArrowOutwardIcon, YouTube, Circle as CircleIcon } from '@mui/icons-material';
import React from 'react'

const RecipeSection = ({ isRecipeLoading, recipe }) => {
    const showRecipe = () => {
      const { recipeName, requiredIngredients, instructions, servingSuggestions, tipsAndVariations, youtubeSearchLinks } = recipe;
      return (
        <Paper elevation={3} sx={{ padding: 2}}>
          <Typography variant="h5" mb={4} gutterBottom>
            {recipeName} Recipe
            <MenuBookIcon sx={{ verticalAlign: 'middle', ml: 2, color: teal[500] }} />
          </Typography>
          <Divider sx={{ marginBottom: 3 }} /> 
          <Grid container spacing={2}>
            <Grid item sm={12} md={8} borderRight={{ sm: 'none', md: '1px solid #ccc' }} >
              <Typography variant="h6" gutterBottom>
                <ListAltIcon sx={{ verticalAlign: 'middle', mr: 1, color: purple[500] }} />
                Instructions:
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              {instructions.map((instruction, index) => (
                <Typography paragraph key={index} px={2}>
                  {instruction}
                </Typography>
              ))}
            </Grid>
            <Grid item sm={12} md={4}>
              <Typography variant="h6" gutterBottom>
                <LocalDiningIcon sx={{ verticalAlign: 'middle', mr: 1, color: orange[500] }} />
                Ingredients List:
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <List>
                {requiredIngredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <CircleIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 8 }} />
                    {ingredient}
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 3 }} />
          <Typography variant="h6" gutterBottom>
            <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, color: blue[500] }} />
            Serving Suggestions:
          </Typography>
          <Typography borderLeft='5px solid' pl={2} paragraph>
            {servingSuggestions}
          </Typography>
          
          <Divider sx={{ marginY: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            <LightbulbIcon sx={{ verticalAlign: 'middle', mr: 1, color: green[500] }} />
            Tips & Variations:
          </Typography>
          {tipsAndVariations.map((tip, index) => (
            <Typography paragraph key={index}>
              <KeyboardArrowRightIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {tip}
            </Typography>
          ))}
          <Divider sx={{ marginY: 3 }} />
          <Typography variant="h6" gutterBottom>
            <YouTube sx={{ verticalAlign: 'middle', mr: 1, color: red[500] }} />
            YouTube Search Links:
          </Typography>
          {youtubeSearchLinks.map((link, index) => (
            <Typography paragraph key={index}>
              <ArrowOutwardIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            </Typography>
          ))}
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