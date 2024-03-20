import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const usersPath = path.join("data", "users.json");

const readUsers = async () => {
  const data = await fs.readFile(usersPath, "utf-8");
  return JSON.parse(data);
};
const users = await readUsers();

const getUsers = (req, res) => {
  res.status(200).json(users);
};

const getUser = (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  const user = users.find((el) => el.id === id);

  res.status(200).json({ user });
};

const createUser = async (req, res) => {
  const newId = (users[users.length - 1].id * 1 + 1).toString(); // multipling a numric string with another number will convert that string to a number , then we convert it back to a string
  const newUser = Object.assign({
    id: newId,
    first_name: "SomeName",
    last_name: "SomeLastName",
    email: "some@mail.com",
    phone: "0555555555", // could use req.body instead of dummy data
  }); // object.assign creates a new object by merging two existing objects
  users.push(newUser);
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
  res.status(201).json({ newUser }); // 201 - created
};

const updateUser = (req, res) => {
  res.status(201).json({
    status: "success",
    data: "Updated user here...",
  });
};

const deleteUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: null,
  });
};

router.route("/users").get(getUsers).post(createUser);

router.route("/users/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
