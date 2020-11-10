export const formatBytes = (untypedBytes, decimals = 2) => {
  let bytes = 0;
  if (typeof untypedBytes === `string`) {
    if (!untypedBytes) {
      return "0 Bytes";
    }

    bytes = Number(untypedBytes.split(`,`).join(``));
  } else if (typeof untypedBytes === `number`) {
    bytes = untypedBytes;
  } else {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const getTransFileData = (file) => {
  return {
    name: file.name,
    path: file.path,
    size: file.size,
  };
};
