import Log from './tools/logger/index.js';
import type Router from './structure/index.js';
import { IState } from './types/state.js';

class State implements IState {
  private _router: Router | null = null;

  get router(): Router {
    return this._router as Router;
  }

  set router(value: Router) {
    this._router = value;
  }

  kill(): void {
    this.router.close();
    Log.log('Server', 'Server closed');
  }
}

export default new State();
