import React, { useState } from 'react';
import { Drawer, List, ListItem, TextField, Button, IconButton, Box, Menu, MenuItem, Typography, Paper, Divider } from '@mui/material';
import { Cancel, FilterList } from '@mui/icons-material';
import ResponseBox from './ResponseBox';

const ResponsesDrawer = ({ setError, open, onClose, totalResponses, responses, setResponses, userEmail, userName, userImgUrl }) => {
  const [newResponse, setNewResponse] = useState('');
  const [reply, setReply] = useState({});
  const [edit, setEdit] = useState({});
  const [showReply, setShowReply] = useState({});
  const [mainTextFieldFocused, setMainTextFieldFocused] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState('mostRecent');


  const handleResponseSubmit = async () => {
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, userImgUrl, userEmail, content: newResponse }),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error);
        return;
      }
      setResponses([...responses, result.data.response]);
      setNewResponse('');
      setMainTextFieldFocused(false);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    try {
      const response = await fetch('/api/responses/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId, userName, userImgUrl, userEmail, content: reply[parentId] }),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error);
        return;
      }

      setResponses(responses.map(response => {
        if (response._id === parentId) {
          return result.data.parentResponse;
        }
        return response;
      }));
      setReply({ ...reply, [parentId]: '' });
      setShowReply({ ...showReply, [parentId]: false });
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleEditSubmit = async (id, parentId) => {
    try {
      const response = await fetch(`/api/responses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: edit[id], parentId }),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error);
        return;
      }
      
      setResponses(responses.map(response => {
        if (response._id === id) {
          return result.data.response;
        }
        response.replies = response.replies.map(reply => {
          if (reply._id === id) {
            return { ...reply, content: edit[id] };
          }
          return reply;
        });
        return response;
      }));
      setEdit({ ...edit, [id]: '' });
    } catch (error) {
      console.error('Error editing response:', error);
    }
  };

  const handleDeleteResponse = async (id, parentId) => {
    try {
      const response = await fetch(`/api/responses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId }),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (parentId) {
        setResponses(responses.map(response => {
          if (response._id === parentId) {
            response.replies = response.replies.filter(reply => reply._id !== id);
          }
          return response;
        }));
      } else {
        setResponses(responses.filter(response => response._id !== id));
      }
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  };

  const handleReplyChange = (parentId, value) => {
    setReply({ ...reply, [parentId]: value });
  };

  const handleEditChange = (id, value) => {
    setEdit({ ...edit, [id]: value });
  };

  const handleToggleReply = (parentId) => {
    setShowReply({ ...showReply, [parentId]: !showReply[parentId] });
  };

  const handleCancelReply = (parentId) => {
    setReply({ ...reply, [parentId]: '' });
    setShowReply({ ...showReply, [parentId]: false });
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    handleFilterClose();
  };

  const renderReplies = (replies, parentId) => {
    return replies.map((reply, index) => (
      <Box key={index} sx={{ ml: 4, mb: 2, borderLeft: '2px solid #ccc', pl: 2 }}>
        <ListItem>
          <ResponseBox 
            isReply={true} 
            parentId={parentId} 
            userEmail={userEmail} 
            userImgUrl={userImgUrl} 
            response={reply}
            edit={edit}
            setEdit={setEdit}
            handleDeleteResponse={handleDeleteResponse}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
            handleToggleReply={handleToggleReply}
          />
        </ListItem>
      </Box>
    ));
  };

  // Sort responses and their nested replies
  const sortedResponses = [...responses].map(response => {
    const sortedReplies = [...response.replies].sort((a, b) => {
      if (sortOrder === 'mostRecent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    return { ...response, replies: sortedReplies };
  }).sort((a, b) => {
    if (sortOrder === 'mostRecent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  return (
    <Paper elevation={3}>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: { xs: '100%', sm: 500 }, padding: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant='h5'>
              Responses ({totalResponses}) 
            </Typography>
            <IconButton onClick={onClose}>
              <Cancel />
            </IconButton>
          </Box>
          <TextField
            label="What are your thoughts?"
            multiline
            rows={mainTextFieldFocused ? 4 : 1}
            variant="outlined"
            fullWidth
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value)}
            onFocus={() => setMainTextFieldFocused(true)}
            sx={{ marginBottom: 2 }}
          />
          {mainTextFieldFocused && (
            <Box display="flex" justifyContent="space-between" sx={{ marginBottom: 4 }}>
              <Button variant="outlined" onClick={() => {
                setNewResponse('');
                setMainTextFieldFocused(false);
              }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleResponseSubmit}>
                Respond
              </Button>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <Button
              variant="text"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
            >
              Filter
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleSortOrderChange('mostRecent')}>Most Recent</MenuItem>
              <MenuItem onClick={() => handleSortOrderChange('oldest')}>Oldest</MenuItem>
            </Menu>
          </Box>
          <Divider />
          
          <List>
            {sortedResponses.map(response => (
              <Box key={response._id}>
                <ListItem>
                  <ResponseBox 
                    isReply={false} 
                    parentId={null} 
                    userEmail={userEmail}
                    userImgUrl={userImgUrl}
                    response={response} 
                    edit={edit}
                    setEdit={setEdit}
                    handleDeleteResponse={handleDeleteResponse}
                    handleEditChange={handleEditChange}
                    handleEditSubmit={handleEditSubmit}
                    handleToggleReply={handleToggleReply}
                  />
                </ListItem>
                
                {showReply[response._id] && (
                  <Box sx={{ ml: 2 }}>
                    <TextField
                      label="Reply"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      value={reply[response._id] || ''}
                      onChange={(e) => handleReplyChange(response._id, e.target.value)}
                      sx={{ mb: 2, ml: 2 }}
                    />
                    <Box sx={{ mb: 4, ml: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button variant="outlined" onClick={() => handleCancelReply(response._id)}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReplySubmit(response._id)}
                      >
                        Respond
                      </Button>
                    </Box>
                  </Box>
                )}
                {renderReplies(response.replies, response._id)}
                <Divider />
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </Paper>
  );
};

export default ResponsesDrawer;