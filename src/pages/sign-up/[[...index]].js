import NavBar from "@/components/Nav";
import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <>
        <NavBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <SignUp />
        </Box>
    </>
  )
}