import express, { Request, Response, Router } from "express";

const expressHttpRouter: Router = express.Router();
const routes = require('require-dir')();

expressHttpRouter.get("/", async (request: Request, response: Response) => {
    response.json("Hello world from the backedn");
});

Object.keys(routes).forEach((routeName) => {
    const router = express.Router();
    require("./" + routeName)(router);

});
expressHttpRouter.use("/",);
export { expressHttpRouter };
