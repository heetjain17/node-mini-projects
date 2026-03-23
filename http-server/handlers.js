export const rootHandler = (req, res) => {
  res
    .status(200)
    .setHeader("Name", "batman")
    .setHeader("Job", "protect-gowtham")
    .json({ enemies: ["Joker", "Catgirl"] });
};

export const getUser = (req, res) => {
  res.json({ users: ["batman", "robin"] });
};

export const createUser = (req, res) => {
  const data = req.body;
  res.status(201).json({ name: data.name, place: data.place });
};
