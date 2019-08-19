const express = require("express");

const server = express();
server.use(express.json());

const users = ["Alexandre", "Fernanda", "Diego"];

server.use((request, response, next) => {
  next();
});

function checkUserExists(request, response, next) {
  if (!request.body.name) {
    return response.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(request, response, next) {
  const { index } = request.params;

  if (!users[index]) {
    return response.status(400).json({ error: "User does not exists" });
  }
  return next();
}

server.get("/users", (request, response) => {
  const name = request.query.name;
  return response.json(users);
});

server.get("/users/:index", checkUserInArray, (request, response) => {
  const { index } = request.params;
  return response.json(users[index]);
});

server.post("/users", checkUserExists, (request, response) => {
  const { name } = request.body;
  users.push(name);
  return response.json(users);
});

server.put(
  "/users/:index",
  checkUserExists,
  checkUserInArray,
  (request, response) => {
    const { index } = request.params;
    const { name } = request.body;
    users[index] = name;
    return response.json(users);
  }
);

server.delete("/users/:index", checkUserInArray, (request, response) => {
  const { index } = request.params;
  users.splice(index, 1);
  return response.json(users);
});

server.listen(3000);
