const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { requireAuth, getUserToken } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const { Project, User, TaskList } = require("../db/models");

const router = express.Router();

//get all projects
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const projects = await Project.findAll({});

    res.json(projects);
  })
);

//Get all projects for a user
router.get(
  "/user/:id",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.id;
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          where: {
            id: user_id,
          },
          attributes: ["name"],
        },
      ],
    });
    res.json(projects);
    //  select * from Projects where user_id = id from projects join team on projects.team_id = team.id join user_team
  })
);

//get all users in a project
router.get(
  "/:id/users",
  asyncHandler(async (req, res, next) => {
    const project_id = req.params.id;

    const users = await User.findAll({
      include: [
        {
          model: Project,
          where: { id: project_id },
        },
      ],

      attributes: ["name"],
    });
    res.json(users);
  })
);

//get all taskslists for a project
router.get(
  "/:id/tasklists",
  asyncHandler(async (req, res, next) => {
    const project_id = req.params.id;

    const tasklist = await TaskList.findAll({
      where: {
        project_id: project_id,
      },
    });
    if (!tasklist) {
      res.json({ message: "error" });
    }
    res.json(tasklist);
  })
);

//Create tasklist for project
router.post(
  "/:id/tasklist",
  asyncHandler(async (req, res, next) => {
    const project_id = req.params.id;
    const { name, user_id } = req.body;

    const tasklist = await TaskList.create({
      name: name,
      user_id: user_id,
      project_id: project_id,
    });
  })
);

//Delete project
router.delete(
  "/:id/",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;
    const project_id = req.params.projectId;
    const project = await Project.delete({
      where: { id: project_id },
    });
    res.status(202);
  })
);

module.exports = router;
