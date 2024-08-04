import { Avatar, Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { MoreVert, Delete, Reply, Favorite, Edit } from '@mui/icons-material'
import React, { useState } from 'react'
import ConfettiButton from './ConfettiButton'

const ResponseBox = ({ isReply, parentId, userEmail, userImgUrl, response, edit, setEdit, handleDeleteResponse, handleEditChange, handleEditSubmit, handleToggleReply }) => {
  const [responseAnchorEl, setResponseAnchorEl] = useState(null);
  const [selectedResponseId, setSelectedResponseId] = useState(null);

  const handleMenuOpen = (event, responseId) => {
    setResponseAnchorEl(event.currentTarget);
    setSelectedResponseId(responseId);
  };

  const handleMenuClose = () => {
    setResponseAnchorEl(null);
    setSelectedResponseId(null);
  };

  const handleEdit = (responseId, content) => {
    handleMenuClose();
    handleEditChange(responseId, content);
  };

  const handleDelete = (responseId, parentId) => {
    handleMenuClose();
    handleDeleteResponse(responseId, parentId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Avatar alt={response.userName} src={response.userImgUrl} sx={{ marginRight: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Typography variant="body1">{response.userName}</Typography>
                <Typography variant="body2" color="textSecondary">
                {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                </Typography>
            </Box>
            </Box>
            {response.userEmail === userEmail && (
            <>
                <IconButton onClick={(e) => handleMenuOpen(e, response._id)}>
                <MoreVert />
                </IconButton>
                <Menu
                anchorEl={responseAnchorEl}
                open={Boolean(responseAnchorEl) && selectedResponseId === response._id}
                onClose={handleMenuClose}
                >
                <MenuItem onClick={() => handleEdit(response._id, response.content)}>
                    <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleDelete(response._id, parentId)}>
                    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
                </Menu>
            </>
            )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', mt: 2 }}>
            {edit[response._id] ? (
                <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={edit[response._id]}
                onChange={(e) => handleEditChange(response._id, e.target.value)}
                />
            ) : (
                <>
                    <Typography variant="body1">{response.content}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', mt: 1, pr: 2 }}>
                        {response.createdAt !== response.updatedAt && (
                            <Typography variant="body2" color="textSecondary">
                            edited
                            </Typography>
                        )}
                    </Box>
                </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
            <ConfettiButton />
            {!isReply && (
                <IconButton onClick={() => handleToggleReply(response._id)}>
                    <Reply />
                </IconButton>
            )}
            </Box>
            {edit[response._id] && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 2 }}>
                <Button variant="outlined" onClick={() => setEdit({ ...edit, [response._id]: '' })}>
                Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleEditSubmit(response._id, parentId)}>
                Save
                </Button>
            </Box>
            )}
        </Box>
    </Box>
  )
}

export default ResponseBox