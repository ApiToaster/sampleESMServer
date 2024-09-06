// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
}

export class InternalError extends FullError {
  constructor() {
    super('InternalError');
    this.message = 'Internal error. Try again later';
    this.name = 'InternalError';
    this.status = 500;
  }
}

export class IncorrectDataType extends FullError {
  constructor() {
    super('IncorrectDataType');
    this.message = 'Received request is not json type';
    this.name = 'IncorrectDataType';
    this.status = 400;
  }
}

export class MissingProcessPlatformError extends FullError {
  constructor() {
    super('MissingProcessPlatformError');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatformError';
    this.status = 500;
  }
}
