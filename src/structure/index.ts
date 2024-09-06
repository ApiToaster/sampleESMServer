import express from 'express';
import Middleware from './middleware.js';
import Log from '../tools/logger/index.js';
import http from 'http';

export default class Router {
  private readonly _middleware: Middleware;
  private readonly _app: express.Express;
  private _server: http.Server | undefined = undefined;

  constructor() {
    this._app = express();
    this._middleware = new Middleware();
  }

  get app(): express.Express {
    return this._app;
  }

  private get middleware(): Middleware {
    return this._middleware;
  }

  private get server(): http.Server {
    return this._server!;
  }

  init(): void {
    this.initMiddleware();
    this.initRouter();
    this.initServer();
    this.initErrHandler();
  }

  /**
   * Close server.
   */
  close(): void {
    Log.log('Server', 'Closing');
    if (!this.server) return;

    this.server.closeAllConnections();
    this.server.close();
  }

  /**
   * Initialize middleware to handle express.
   */
  private initMiddleware(): void {
    this.middleware.generateMiddleware(this.app);
  }

  /**
   * Init err handler, catching errors in whole app.
   */
  private initErrHandler(): void {
    this.middleware.generateErrHandler(this.app);
  }

  /**
   * Init basic routes.
   */
  private initRouter(): void {
    this.app.get('/', (_req, res) => {
      res.status(200).send();
    });

    this.app.all('*', (_req, res) => {
      res.status(404).send();
    });
  }

  /**
   * Initialize http server.
   */
  private initServer(): void {
    if (process.env.NODE_ENV === 'test') return;
    this._server = http.createServer(this.app);

    this.server.listen('5003', () => {
      Log.log('Server', 'Listening on 5003');
    });
  }
}
