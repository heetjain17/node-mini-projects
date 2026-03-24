export const loggerA = (req, res, next) => {
  console.log("Inside Logger A");
  res.send("NIgger");
  next();
};

export const loggerB = (req, res, next) => {
  console.log("Inside Logger B");
  next();
};
