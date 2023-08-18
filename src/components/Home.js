import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import LoginIcon from "@mui/icons-material/Login";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";
import Nav from "./Nav";

const Home = () => {
  const history = useNavigate();
  const [files, setFiles] = useState([]);
  const hiddenFileInput = useRef(null);

  const getAllFiles = async () => {
    try {
      let result = await axios.get("http://localhost:5000/files");
      setFiles(result.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      const formData = new FormData();
      formData.append("file", fileUploaded);

      try {
        const result = await axios.post(
          "http://localhost:5000/files/upload",
          formData
        );

        console.log("File uploaded successfully:", result.data);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const onDownload = async (shortId, filename) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/files/download/${shortId}`,
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
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const onDelete = async (shortId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/files/delete/${shortId}`
      );
    } catch (error) {
      console.error("File deletion failed:", error);
    }
  };

  useEffect(() => {
    getAllFiles();
  }, []);

  return (
    <Grid>
      <Nav />
      <Grid container sx={{ width: "90%", margin: "30px auto 20px" }}>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleClick}
            >
              Upload
            </Button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "20px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Filename</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.length &&
                  files.map((file) => (
                    <TableRow
                      key={file.shortId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {file.filename}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Tooltip title="Copy Link" placement="top">
                          <IconButton
                            aria-label="copy"
                            onClick={() => {
                              const url =
                                window.location.origin + "/" + file.shortId;
                              navigator.clipboard.writeText(url);
                            }}
                          >
                            <ContentCopyIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Visit" placement="top">
                          <IconButton
                            aria-label="visit-file"
                            onClick={() => history(`/${file.shortId}`)}
                          >
                            <LoginIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download" placement="top">
                          <IconButton
                            aria-label="download"
                            onClick={() =>
                              onDownload(file.shortId, file.filename)
                            }
                          >
                            <DownloadIcon color="success" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(file.shortId)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {!files.length && (
          <Grid container justifyContent="center" sx={{ padding: "40px" }}>
            <Grid item>
              <h2>No Data to Display</h2>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Home;
