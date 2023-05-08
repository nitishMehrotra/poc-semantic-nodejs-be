import { WebServer } from "./WebServer";
import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import cors from "cors";
import express, { Router } from "express";

export class ExpressServer implements WebServer {
    private DEFAULT_PORT_NUMBER = 7001;
    private _app: express.Application;
    private _apiRouter: Router;

    constructor() {
        this._app = express();
        this._apiRouter = express.Router({ strict: true });
        this.setup();
    }

    private setup(): void {
        this._app.set("port", process.env.PORT || this.DEFAULT_PORT_NUMBER);
        this._app.use(compression());
        this._app.use(bodyParser.json({ limit: "50mb" }));
        this._app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // limit >20mb is needed at file-upload api
        this._app.use(cors());
    }
    private setupRoutes(): void {
        // this._apiRouter.use("/v1", v1Router);
    }

    public async listen(): Promise<void> {
        const listener = new Promise((resolve, reject) => {
            const port = process.env.PORT || this.DEFAULT_PORT_NUMBER;
            this._app.listen(port, () => {
                console.log("Server started on", port);
            });
        });
    }
    public async start(): Promise<void> {
        this.setupRoutes();
        this.start();
        this.listen();
    }
    public stop(): void { }


}
