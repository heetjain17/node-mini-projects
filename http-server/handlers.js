export const rootHandler = (req, res) => {
  res
    .status(201)
    .setHeader("Name", "batman")
    .setHeader("Job", "protect-gowtham")
    .json({ enemies: ["Joker", "Catgirl"] });
};

export const userHandler = (req, res) => {
  res.json({ users: ["batman", "robin"] });
};

export const aboutHandler = (req, res) => {
  res.send("About Page");
};
