import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Nav = () => {
  const history = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" alignItems="center">
            {/* app icon */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="app-logo"
              onClick={() => history("/")}
            >
              <CloudUploadIcon />
            </IconButton>
            {/* app title */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <span onClick={() => history("/")} style={{ cursor: "pointer" }}>
                EasyUploader
              </span>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
