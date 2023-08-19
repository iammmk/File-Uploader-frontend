import Alert from "@mui/material/Alert";

export const AlertComp = ({ severity, message }) => {
  return (
    <Alert variant="filled" severity={severity} style={{ zIndex: 6666 }}>
      {message}
    </Alert>
  );
};
