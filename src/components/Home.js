import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Paper,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import { AlertComp } from "./AlertComp";
import axios from "axios";
import { BASE_URL } from "../services/Helper";
import Utils from "../utils/Utils";
import Nav from "./Nav";

// Main home component
const Home = () => {
  const history = useNavigate();
  const [files, setFiles] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const hiddenFileInput = useRef(null);
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

  // Function to get all files
  const getAllFiles = async () => {
    try {
      setLoading(true);
      let result = await axios.get(`${BASE_URL}/files`);
      setFiles(result.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // Function to upload file
  const onUpload = async (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      const formData = new FormData();
      formData.append("file", fileUploaded);

      try {
        setLoading(true);
        const result = await axios.post(`${BASE_URL}/files/upload`, formData);
        console.log("File uploaded successfully:", result.data);
        showAlert("success", "File uploaded successfully !");
        getAllFiles();
      } catch (error) {
        console.error("File upload failed:", error);
        if (error.response.data === "Invalid file type") {
          showAlert(
            "error",
            "Unsupported file type. Please use a valid format."
          );
        } else if (error.response.data === "File size too large") {
          showAlert(
            "error",
            "File size too large.Max allowed file size is 5MB."
          );
        } else {
          showAlert(
            "error",
            "An error occurred while uploading the file. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to download file
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

  // Function to delete file
  const onDelete = async (shortId) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/files/delete/${shortId}`);
      showAlert("success", "File deleted successfully !");
      getAllFiles();
    } catch (error) {
      console.error("File deletion failed:", error);
      showAlert("error", "File deletion failed.");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = (shortId) => {
    const url = window.location.origin + "/" + shortId;
    navigator.clipboard.writeText(url);
    showAlert("success", "File link copied to clipboard !");
  };

  // Columns for the table
  const columns = [
    { id: "name", label: "Filename", width: "30%" },
    { id: "type", label: "Type" },
    { id: "size", label: "Size" },
    { id: "uploadedOn", label: "Uploaded On" },
    { id: "expireOn", label: "Expire On" },
    { id: "actions", label: "Actions" },
  ];

  // Fetch all files on mount
  useEffect(() => {
    getAllFiles();
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
      <Grid container sx={{ width: "95%", margin: "30px auto 20px" }}>
        <Grid container justifyContent="flex-end" alignItems="center">
          <Grid item>
            <TextField
              label="Search Files"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300, marginRight: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
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
              onChange={onUpload}
              style={{ display: "none" }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "50px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ width: column.width }}>
                      <b>{column.label}</b>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {files.length > 0 &&
                  files
                    .filter((ele) => {
                      const trimmedSearchTerm = searchTerm.trim();
                      if (trimmedSearchTerm === "") {
                        return true;
                      } else {
                        return ele.filename
                          .toLowerCase()
                          .includes(trimmedSearchTerm.toLowerCase());
                      }
                    })
                    .map((file) => (
                      <TableRow
                        key={file.shortId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {Utils.textEllipsis(
                            Utils.getFilename(file.filename),
                            35
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {file.fileType}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Utils.getFileSize(file.size)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Utils.getDateTime(file.uploadedOn)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Utils.getDateTime(file.expireOn)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Tooltip title="Copy Link" placement="top">
                            <IconButton
                              aria-label="copy"
                              onClick={() => {
                                onCopy(file.shortId);
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
        {/* handle no files */}
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
