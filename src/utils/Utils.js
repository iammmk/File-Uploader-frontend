import moment from "moment";

const Utils = {
  // Extracts the original filename from a string
  getFilename: (s) => {
    const filename = s?.split("-").slice(1).join("-");
    return filename;
  },
  // Formats a timestamp into a human-readable date-time string.
  getDateTime: (t) => {
    return moment(t).format("DD MMM YYYY HH:mm");
  },
  // Converts bytes into in MB/KB/B
  getFileSize: (x) => {
    if (x >= 1024 * 1024) {
      return (x / (1024 * 1024)).toFixed(2) + " MB";
    } else if (x >= 1024) {
      return (x / 1024).toFixed(2) + " KB";
    } else {
      return x + " B";
    }
  },

  // Truncates a string to a specified length and appends ellipsis
  textEllipsis: (str, maxLength, { side = "end", ellipsis = "..." } = {}) => {
    if (str != null && str.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + str.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return str.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  },
};

export default Utils;
