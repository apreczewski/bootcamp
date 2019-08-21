const express = require("express");

const server = express();
server.use(express.json());

const projects = [
  { id: "0", title: "bootcamp", tasks: ["react", "react-native", "nodejs"] }
];

function checkIdProjects(request, response, next) {
  const { id } = request.params;

  projects.map(project => {
    if (project.id !== id) {
      return response.status(400).json({ error: "Project does not exists" });
    }
  });

  return next;
}

let count = 0;

function countRequests(request, response, next) {
  if (request.route.path) {
    count += 1;
  }

  console.log("Request: " + count);
  return next();
}

server.post("/projects", countRequests, (request, response) => {
  const { id, title, tasks } = request.body;
  projects.push({ id, title, tasks });

  return response.json(projects);
});

server.get("/projects", countRequests, (request, response) => {
  return response.json(projects);
});

server.put(
  "/projects/:id",
  countRequests,
  checkIdProjects,
  (request, response) => {
    const { id } = request.params;
    const { title } = request.body;

    projects.map((project, index) => {
      if (project.id === id) {
        projects[index].title = title;
      }
    });

    return response.json(projects);
  }
);

server.post(
  "/projects/:id/tasks",
  countRequests,
  checkIdProjects,
  (request, response) => {
    const { id } = request.params;
    const { title, tasks } = request.body;

    projects.map((project, index) => {
      if (project.id === id && project.title == title) {
        tasks.map(task => {
          projects[index].tasks.push(task);
        });
      }
    });

    return response.json(projects);
  }
);

server.delete(
  "/projects/:id",
  countRequests,
  checkIdProjects,
  (request, response) => {
    const { id } = request.params;
    projects.map((project, index) => {
      if (project.id === id) {
        projects.splice(index);
      }
    });

    return response.json(projects);
  }
);

server.listen(3000);
