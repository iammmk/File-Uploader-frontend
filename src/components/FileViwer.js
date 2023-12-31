import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Backdrop, Box, Button, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import { AlertComp } from "./AlertComp";
import axios from "axios";
import { BASE_URL } from "../services/Helper";
import Nav from "./Nav";
import Utils from "../utils/Utils";

// Component to display details of a selected file and allows downloading
const FileViewer = () => {
  const { shortId } = useParams(); // Retrieve shortId from URL parameters
  const [file, setFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    severity: "success",
    message: "",
  });
  const showAlert = (severity, message) => {
    setOpenAlert(true);
    setAlertDetails({ ...alertDetails, severity, message });
    setTimeout(() => {
      setOpenAlert(false);
    }, 4000);
  };

  // Function to fetch file details
  const getFile = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${BASE_URL}/files/${shortId}`);
      setFile(result.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle file download
  const onDownload = async (shortId, filename) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/files/download/${shortId}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert("success", "File downloaded successfully !");
    } catch (error) {
      console.error("Download failed:", error);
      showAlert("error", "Download failed.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the file details when the component mounts
  useEffect(() => {
    getFile();
  }, []);

  // Show loader if loading
  if (isLoading) {
    return (
      <Backdrop
        sx={{
          backgroundColor: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <Grid>
      <Nav />
      {openAlert && <AlertComp {...alertDetails} />}
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
            height: "200px",
            textAlign: "center",
            p: 3,
            border: "1px solid #000",
            borderRadius: "5px",
          }}
        >
          <Grid item>
            <h2>{Utils.textEllipsis(Utils.getFilename(file?.filename), 35)}</h2>
            <h3 style={{ backgroundColor: "yellow", display: "inline-block" }}>
              size: {Utils.getFileSize(file?.size)}
            </h3>
            <br />
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={() =>
                onDownload(file.shortId, Utils.getFilename(file.filename))
              }
            >
              Download File
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FileViewer;
