import Head from 'next/head';
import Navbar from '@/components/Nav';
import UploadImageSection from '@/components/UploadImageSection';
import DetectedItemsSection from '@/components/DetectedItemsSection';
import RecipeSection from '@/components/RecipeSection';
import { useState } from 'react';
import { Alert, AlertTitle, Box, Button, Container, CssBaseline, Grid, Snackbar, Tab, Tabs } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const Homepage = () => {
  const [file, setFile] = useState(null);

  const [objects, setObjects] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  
  const [ingredients, setIngredients] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleFinalize = () => {
    setConfirmationMessage(`You have selected the following ingredients: ${ingredients.join(', ')}. Confirm to generate recipe.`);
    setShowConfirmation(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

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
        setError('Failed to perform object localization');
        throw new Error('Failed to perform object localization');
      }

      const data = await response.json();
      if (data.objects.length === 0) {
        setError("Couldn't detect any items in the image. Please try again with another image.");
        return;
      }
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

  const handleConfirm = async () => {
    setError(null);
    setRecipe(null);
    setTabIndex(tabIndex + 1);

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
      if (!data.success) {
        setError(data.msg);
      } else {
        setRecipe(data.result);
        setError(null);
      }

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

  const handleNext = (e) => {
    if (tabIndex === 0) {
      setTabIndex(tabIndex + 1);
      handleSubmit(e);
    } else if (tabIndex === 1) {
      handleFinalize();
    }
  };


  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>
      <Navbar />

      <Container sx={{ py: 6 }} >
        {error && (
          <Alert 
            severity="error" 
            variant='filled' 
            onClose={() => setError(null)}
            sx={{ marginBottom: 6 }}
            >
              <AlertTitle>Error</AlertTitle>
              {error}
          </Alert>
        )}

        <Tabs value={tabIndex} onChange={handleTabChange} centered variant="fullWidth">
          <Tab label="Upload" />
          <Tab label="Detect Items" disabled={!file} />
          <Tab label="Recipe" disabled={!recipe} />
        </Tabs>
        <Box sx={{ py: 2 }}>
          {tabIndex === 0 && (
            <UploadImageSection file={file} setFile={setFile} />
          )}
          {tabIndex === 1 && (
            <DetectedItemsSection objects={objects} imageSrc={imageSrc} ingredients={ingredients} setIngredients={setIngredients} setError={setError} />
          )}
          {tabIndex === 2 && <RecipeSection isRecipeLoading={isRecipeLoading} recipe={recipe} />}

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item sm={12} md={6}>
              {tabIndex > 0 && (
                <Button variant="outlined" onClick={() => setTabIndex(tabIndex - 1)}>
                  <ArrowBackIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Back
                </Button>
              )}
            </Grid>
            <Grid item sm={12} md={6} textAlign="right">
              {tabIndex < 2 && (
                <Button variant="contained" onClick={(e) => handleNext(e)} disabled={(tabIndex === 0 && !file) || (tabIndex === 1 && !ingredients.length)}>
                  {tabIndex == 0 ? 'Submit Image' : tabIndex == 1 ? 'Finalize and Generate Recipe' : null}
                </Button>
              )}
            </Grid>
          </Grid>

        </Box>
      </Container>

      {/* Confirmation dialog */}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showConfirmation} autoHideDuration={6000} onClose={() => setShowConfirmation(false)}>
        <Alert onClose={() => setShowConfirmation(false)} severity="info" sx={{ width: '100%', padding: 2 }}>
          {confirmationMessage}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
            <Button onClick={handleCancel} variant="outlined">Cancel</Button>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}

export default Homepage;

