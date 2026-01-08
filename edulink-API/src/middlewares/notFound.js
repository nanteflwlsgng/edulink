// src/middlewares/notFound.js
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.originalUrl}`,
  });
};
