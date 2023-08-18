import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

const FileViewer = () => {
  const { shortId } = useParams();
  const [file, setFile] = useState(null);

  const getFile = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/files/${shortId}`);
      setFile(result.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getFile();
  }, []);

  return (
    <Grid>
      <Nav />
      {file ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            sx={{
              width: "450px",
              height: "175px",
              textAlign: "center",
              p: 3,
              border: "1px solid #000",
              borderRadius: "5px",
            }}
          >
            <Grid item>
              <h2>{file.filename}</h2>
              <Button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={() =>
                  (window.location.href = `http://localhost:5000/files/download/${shortId}`)
                }
              >
                Download File
              </Button>
            </Grid>
          </Box>
        </Grid>
      ) : (
        <p>Loading...</p>
      )}
    </Grid>
  );
};

export default FileViewer;
