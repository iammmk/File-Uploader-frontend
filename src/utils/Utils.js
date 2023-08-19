import moment from "moment";

const Utils = {
  getFilename: (s) => {
    const filename = s?.split("-").slice(1).join("-");
    return filename;
  },
  getDateTime: (t) => {
    return moment(t).format("DD MMM YYYY HH:mm");
  },
  getFileSize: (x) => {
    return (x / (1024 * 1024)).toFixed(2) + " MB";
  },
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
