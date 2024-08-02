import { Box, Button, CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import React, {useState} from 'react'

const DetectedItemsSection = ({ isImgLoading, objects, imageSrc, ingredients, setIngredients, setError }) => {
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [newIngredient, setNewIngredient] = useState('');

    const handleNewIngredientChange = (e) => {
      setNewIngredient(e.target.value);
    };
  
    const handleAddIngredient = () => {
      setError(null)
      if (newIngredient && !ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
        setNewIngredient('');
      }
    };
  
    const handleRemoveIngredient = (ingredient) => {
      setIngredients(ingredients.filter(ing => ing !== ingredient));
    };

    const handleImageLoad = (e) => {
      const { width, height } = e.target;
      setImageDimensions({ width, height });
    };

    const getBoundingBoxStyles = (vertices) => {
      const [topLeft, topRight, bottomRight, bottomLeft] = vertices;
      const width = (bottomRight.x - topLeft.x) * imageDimensions.width;
      const height = (bottomRight.y - topLeft.y) * imageDimensions.height;
      const left = topLeft.x * imageDimensions.width;
      const top = topLeft.y * imageDimensions.height;
  
      return {
        position: 'absolute',
        border: '2px solid red',
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        boxSizing: 'border-box',
      };
    };

    const showLocalizedImage = () => {
      return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}> 
          <Typography variant="h5" gutterBottom>Detected Objects:</Typography>
          <Divider sx={{ marginBottom: 2 }} />        
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <img
                src={imageSrc} 
                alt="Localized Image" 
                style={{ width: '100%', height: '100%' }} 
                onLoad={handleImageLoad}
            />
            {objects.map((object, index) => (
                <Box key={index} sx={getBoundingBoxStyles(object.boundingPoly.normalizedVertices)}>
                <Typography variant="caption" sx={{ color: 'red', backgroundColor: 'white', padding: '2px' }}>
                    {object.name} ({Math.round(object.score * 100)}%)
                </Typography>
                </Box>
            ))}
          </Box>
        </Paper>
      )
    }

    const showDetectedIngredients = () => {
      return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}>
          <Typography variant="h5" gutterBottom>Detected Items:</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <TextField
              label="Ingredient Name"
              variant="outlined"
              value={newIngredient}
              onChange={handleNewIngredientChange}
              sx={{ marginRight: 2 }}
          />
          <Button variant="contained" onClick={handleAddIngredient}>Add Ingredient</Button>
          </Box>
          <List>
          {ingredients.map((ingredient, index) => (
              <ListItem key={index} secondaryAction={
              <IconButton edge="end" onClick={() => handleRemoveIngredient(ingredient)}>
                  <DeleteIcon />
              </IconButton>
              }>
              <ListItemText primary={ingredient} />
              </ListItem>
          ))}
          </List>
        </Paper>
      )
    }

    return (
      <Grid container spacing={2}>
        <Grid item md={12} lg={6}>
          <Box sx={{ height: '100%', display: 'flex'}}>
            {isImgLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: 2 }}>Loading img...</Typography>
              </Box>
              ) : 
              showLocalizedImage()
            }
          </Box>
        </Grid>
        <Grid item md={12} lg={6}>
          <Box sx={{ height: '100%', display: 'flex'}}>
            {showDetectedIngredients()}
          </Box>
        </Grid>
      </Grid>
    )
}

export default DetectedItemsSection