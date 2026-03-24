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
  next();
};

export const validate = (req, res, next) => {
  console.log("Inside validate");
  next();
};
