// src/components/ObjectLocalization.js

import { useState, useRef } from 'react';
import { Button, TextField, Typography, Box, Paper, List, ListItem, ListItemText, IconButton, Snackbar, Alert, Grid, Divider, CircularProgress, Container } from '@mui/material';
import { Add, Delete, LocalDining as LocalDiningIcon, Info, Lightbulb, MenuBook as MenuBookIcon, Circle as CircleIcon, KeyboardArrowRight as KeyboardArrowRightIcon, CloudUpload as CloudUploadIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { teal, orange, purple, blue, green } from '@mui/material/colors';
import { useDropzone } from 'react-dropzone';
import {Camera} from 'react-camera-pro';

const ObjectLocalization = () => {
  const [file, setFile] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);

  const handleNewIngredientChange = (e) => {
    setNewIngredient(e.target.value);
  };

  const handleAddIngredient = () => {
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/localize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to perform object localization');
      }

      const data = await response.json();
      setObjects(data.objects);
      setImageSrc(data.imgUrl);

      const detectedIngredients = []
      for (const obj of data.objects) {
        if (!detectedIngredients.includes(obj.name)) {
          detectedIngredients.push(obj.name);
        }
      }
      setIngredients(detectedIngredients);

      setError(null);
    } catch (err) {
      setError(err.message);
      setObjects([]);
    }
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

  const handleFinalize = () => {
    setConfirmationMessage(`You have selected the following ingredients: ${ingredients.join(', ')}. Confirm to generate recipe.`);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsRecipeLoading(true);

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }
  
      const data = await response.json();
      setRecipe(data.recipe);

      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const showLocalizedImage = () => {
    return (
      <Paper sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2, marginTop: 2 }}> 
        <Typography variant="h5">Localized Image:</Typography>
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

  // dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
        }
    },
    multiple: false,  // Set to false to accept only one file
  });

  const capturePhoto = () => {
    const photo = cameraRef.current.takePhoto();
    fetch(photo)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        setFile(file);
        setIsCameraOpen(false);
      });
  };

  const showTakeAndUploadImage = () => {
    return (
      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>Upload Image:</Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #90a4ae',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: isDragActive ? '#e3f2fd' : '#fafafa',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#f1f1f1',
            },
          }}
        >
          <input {...getInputProps()} />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            sx={{ fontSize: '3rem' }}
          >
            <CloudUploadIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ marginTop: '8px' }}>
            Upload your image
          </Typography>
          <Typography variant="body2" color="textSecondary">
            PNG, JPG and GIF files are allowed
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            Drag and drop or browse to choose a file
          </Typography>
        </Box>

        {file && (
          <Typography variant="body1" textAlign="center" sx={{ marginTop: '16px' }} gutterBottom>
            Selected file: {file.name}
          </Typography>
        )}

        <Container sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCameraOpen(true)}
          >
            <PhotoCameraIcon />
            Take Photo
          </Button>
        </Container>
        
        
        {isCameraOpen && (
          <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
            <Camera
              ref={cameraRef}
              aspectRatio={16 / 9}
              facingMode="environment"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: '8px' }}
              onClick={capturePhoto}
            >
              Capture
            </Button>
            <Button
              variant="outlined"
              sx={{ marginTop: '8px', marginLeft: '8px' }}
              onClick={() => setIsCameraOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    )
  }

  const showDetectedIngredients = () => {
    return (
      <Paper sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2, marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>Detected Items:</Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <TextField
            label="Add new ingredient"
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
                <Delete />
            </IconButton>
            }>
            <ListItemText primary={ingredient} />
            </ListItem>
        ))}
        </List>
        {ingredients.length > 0 && (
        <Button variant="contained" onClick={handleFinalize} sx={{ marginTop: 2 }}>
            Finalize and Generate Recipe
        </Button>
        )}
      </Paper>
    )
  }

  const showRecipe = () => {
    if (!recipe) return null;
    const { recipeName, requiredIngredients, instructions, servingSuggestions, tipsAndVariations } = recipe;

    return (
      <Paper elevation={3} sx={{ padding: 2, marginTop: 6 }}>
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
                <strong>{index + 1}.</strong> {instruction}
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
          <Info sx={{ verticalAlign: 'middle', mr: 1, color: blue[500] }} />
          Serving Suggestions:
        </Typography>
        <Typography borderLeft='5px solid' pl={2} paragraph>
          {servingSuggestions}
        </Typography>
        
        <Divider sx={{ marginY: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          <Lightbulb sx={{ verticalAlign: 'middle', mr: 1, color: green[500] }} />
          Tips & Variations:
        </Typography>
        {tipsAndVariations.map((tip, index) => (
          <Typography paragraph key={index}>
            <KeyboardArrowRightIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
             {tip}
          </Typography>
        ))}
      </Paper>
    )
  }

  return (
    <Box sx={{px: { xs: '5%', sm: '10%' }, py: 6 }}>
      {/* <Typography variant="h4" gutterBottom>Object Localization</Typography> */}
      {ingredients.length > 0 
        ?
        <>
          <Grid container spacing={2}>
            <Grid item md={12} lg={6}>
              <Box sx={{ height: '100%', display: 'flex'}}>
                {imageSrc && showLocalizedImage()}
              </Box>
            </Grid>
            <Grid item md={12} lg={6}>
              <Box sx={{ height: '100%', display: 'flex'}}>
                {showDetectedIngredients()}
              </Box>
            </Grid>
          </Grid> 
          {isRecipeLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {recipe && showRecipe()}
        </>
        :
        showTakeAndUploadImage()
      }
      
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showConfirmation} autoHideDuration={6000} onClose={() => setShowConfirmation(false)}>
        <Alert onClose={() => setShowConfirmation(false)} severity="info" sx={{ width: '100%', padding: 2 }}>
          {confirmationMessage}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
            <Button onClick={handleCancel} variant="outlined" color="secondary">Cancel</Button>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ObjectLocalization;