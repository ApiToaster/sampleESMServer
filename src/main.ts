import State from './state.js';
import Router from './structure/index.js';
import Log from './tools/logger/index.js';
import type { IFullError } from './types/index.js';

class App {
  init(): void {
    try {
      this.handleInit();
    } catch (err) {
      const { stack, message } = err as IFullError;
      Log.error('Server', 'Err while initializing app');
      Log.error('Server', message, stack);
      Log.error('Server', JSON.stringify(err));

      State.kill();
    }
  }

  private handleInit(): void {
    const router = new Router();

    State.router = router;

    router.init();
    Log.log('Server', 'Server started');
  }
}

new App().init();
