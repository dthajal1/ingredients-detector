import { Box, Button, Container, Divider, IconButton, Paper, Typography } from '@mui/material';
import { CloudUpload as CloudUploadIcon, FlipCameraIos as FlipCameraIosIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Camera } from 'react-camera-pro';
import React, { useState, useRef } from 'react';

const UploadImageSection = ({ file, setFile }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const cameraRef = useRef(null);
    const [facingMode, setFacingMode] = useState('environment');

    const toggleFacingMode = () => {
        setFacingMode((prevFacingMode) => (prevFacingMode === 'environment' ? 'user' : 'environment'));
    };

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
        multiple: false,
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

   
    return (
        <Paper sx={{ padding: 2 }}>
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
                <IconButton color="primary" aria-label="upload picture" component="span" sx={{ fontSize: '3rem' }}>
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
                <Button variant="outlined" color="primary" onClick={() => setIsCameraOpen(true)}>
                    <PhotoCameraIcon sx={{ marginRight: '8px' }} /> Take Photo
                </Button>
            </Container>
            
            {isCameraOpen && (
                <Box sx={{ position: 'relative', marginTop: '16px', textAlign: 'center' }}>
                    <Camera ref={cameraRef} aspectRatio={16 / 9} facingMode={facingMode} />
                    <IconButton color="primary" onClick={toggleFacingMode} sx={{ position: 'absolute', top: '16px', right: '16px' }}>
                        <FlipCameraIosIcon fontSize="large" />
                    </IconButton>
                    <Button variant="contained" color="primary" sx={{ marginTop: '8px' }} onClick={capturePhoto}>
                        Capture
                    </Button>
                    <Button variant="outlined" sx={{ marginTop: '8px', marginLeft: '8px' }} onClick={() => setIsCameraOpen(false)}>
                        Cancel
                    </Button>
                </Box>
            )}
        </Paper>
    )
}

export default UploadImageSection