export const rootHandler = (req, res) => {
  res
    .status(200)
    .setHeader("Name", "batman")
    .setHeader("Job", "protect-gowtham")
    .json({ enemies: ["Joker", "Catgirl"] });
};

export const getUser = (req, res) => {
  const { id } = req.query || {};

  const users = [
    { id: "1", name: "batman" },
    { id: "2", name: "robin" },
  ];

  if (!id) return res.json(users);

  const user = users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ error: "User Not Found" });

  return res.json({ user });
};

export const createUser = (req, res) => {
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!data.name || !data.place) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, place" });
  }

  res.status(201).json({
    message: "User created",
    user: { name: data.name, place: data.place },
  });
};

export const debugHandler = (req, res) => {
  res.json({
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
  });
};
