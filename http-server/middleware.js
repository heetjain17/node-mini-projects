export const loggerA = (req, res, next) => {
  console.log("Inside Logger A");
  next();
};

export const loggerB = (req, res, next) => {
  console.log("Inside Logger B");
  next();
};

export const auth = (req, res, next) => {
  console.log("Inside auth");
  next(new Error("Invalid Session"));
};

export const validate = (req, res, next) => {
  console.log("Inside validate");
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);
  console.log("Error  handler hit");
  if (res.sent()) return;
  console.log("Error handler hit + 1");
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
};
