const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { requireAuth } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const { Team, UserTeam, User, Project } = require("../db/models");
const router = express.Router();

//Gets all Teams
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const teams = await Team.findAll({});

    res.json(teams);
  })
);

//get all users in a Team
router.get(
  "/:id/users",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;

    const users = await Team.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      where: { id: team_id },
    });

    res.json(users);
  })
);

//get all teams for a user
router.get(
  "/user/:id",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.id;

    const teams = await User.findAll({
      include: [{ model: Team }],
      where: {
        id: user_id,
      },
      attributes: ["name"],
    });

    res.json(teams);
  })
);

//get all projects for team
router.get(
  "/:id/projects",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;
    const projects = await Project.findAll({
      where: {
        team_id: team_id,
      },
    });
    res.json(projects);
  })
);

//Create team
router.post(
  "/user/:userId",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.userId;
    const { description, name } = req.body;
    const team = await Team.create({
      description: description,
      name: name,
    });

    //Adds user to team
    const userteam = await UserTeam.create({
      team_id: team.id,
      user_id: user_id,
    });
  })
);

//Add other users to team
router.post(
  "/:teamId/user/:userId",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.teamId;
    const user_id = req.params.userId;
    const userteam = await UserTeam.create({
      team_id: team_id,
      user_id: user_id,
    });
  })
);

//Create Project for team
router.post(
  "/:id/project",
  asyncHandler(async (req, res, next) => {
    //need to add owner for project
    const team_id = req.params.id;
    const { name, owner_id } = req.body;
    const project = await Project.create({});
  })
);

//Delete team
router.delete(
  "/:teamId/",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.teamId;
    const project_id = req.params.projectId;
    const team = await Team.delete({
      where: { id: team_id },
    });
    res.status(202);
  })
);

module.exports = router;
