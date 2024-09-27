import apiToaster from 'api-toaster';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import * as errors from '../errors/index.js';
import Log from '../tools/logger/index.js';
import type * as types from '../types/index.js';
import type { Express } from 'express';

export default class Middleware {
  generateMiddleware(app: Express): void {
    app.use(express.json({ limit: '500kb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.text());
    app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      }),
    );
    app.use(cookieParser());

    app.use(
      cors({
        origin: '*',
        credentials: true,
      }),
    );
    app.use((req, res, next) => {
      apiToaster(req, res, next, {
        headers: true,
      });
    });
    app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    app.use((req, _res, next) => {
      try {
        const logBody: Record<string, string | Record<string, string>> = {
          method: req.method,
          path: req.path,
          ip: req.ip as string,
        };
        if (req.query) logBody.query = JSON.stringify(req.query);
        if (
          req.body !== undefined &&
          typeof req.body === 'object' &&
          Object.keys(req.body as Record<string, string>).length > 0
        ) {
          if (req.path.includes('interaction') || req.path.includes('register') || req.path.includes('remove')) {
            logBody.body = { ...(req.body as Record<string, string>) };

            if (logBody.body.password) {
              logBody.body.password = '***';
            }
          } else {
            logBody.body = req.body as Record<string, string>;
          }
        }

        Log.log('New req', logBody);
        next();
      } catch (err) {
        Log.error('Middleware validation', err);
      }
    });
  }

  generateErrHandler(app: Express): void {
    app.use(
      (
        err: express.Errback | types.IFullError,
        req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        Log.error('Caught new generic error', `Caused by ${req.ip ?? 'unknown ip'}`, JSON.stringify(err));
        const error = err as types.IFullError;

        if (error.message.includes('is not valid JSON')) {
          Log.error('Middleware', 'Received req is not of json type', error.message, error.stack);
          const { message, name, status } = new errors.IncorrectDataType();
          return res.status(status).json({ message, name });
        }
        if (error.name === 'SyntaxError') {
          Log.error('Middleware', 'Generic err', error.message, error.stack);
          const { message, code, name, status } = new errors.InternalError();
          return res.status(status).json({ message, code, name });
        }
        if (error.code !== undefined) {
          const { message, code, name, status } = error;
          return res.status(status).json({ message, code, name });
        }
        Log.error('Middleware', 'Generic err', error.message, error.stack);
        const { message, code, name, status } = new errors.InternalError();
        return res.status(status).json({ message, code, name });
      },
    );
  }
}
