export const rootHandler = (req, res) => {
  res.send("Welcome Home");
};

export const userHandler = (req, res) => {
  res.json({ users: ["batman", "robin"] });
};

export const aboutHandler = (req, res) => {
  res.send("About Page");
};
