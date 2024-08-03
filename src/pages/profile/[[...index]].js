import React from 'react'
import { UserProfile } from '@clerk/nextjs'
import NavBar from '@/components/Nav'
import { Box } from '@mui/material'

const Profile = () => {
  return (
    <>
        <NavBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
          <UserProfile />
        </Box>
    </>
  )
}

export default Profile