export function notFound(req, res) {
  res.status(404).json({ success: false, message: "Endpoint not found." });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, message: "A file exceeds the 45MB upload limit." });
  }
  if (error?.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ success: false, message: "You can share up to 5 files at once." });
  }
  if (error?.name === "MulterError") {
    return res.status(400).json({ success: false, message: "The upload could not be processed." });
  }
  console.error(error);
  res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
}
