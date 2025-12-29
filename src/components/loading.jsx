import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.6)',
          borderRadius: 1,
        }}
      >
      <Box component="img" sx={{ height: "200px" }} src="/the-gauntlet/loading.gif" alt="Loading..."  />
    </Box>
  );
}