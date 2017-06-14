'use strict';

module.exports = function createMockLog(logToConsole) {
  var mockLog = {
    silly: jest.fn(logToConsole ? console.log : undefined),
    debug: jest.fn(logToConsole ? console.log : undefined),
    info: jest.fn(logToConsole ? console.log : undefined),
    warn: jest.fn(logToConsole ? console.log : undefined),
    error: jest.fn(logToConsole ? console.log : undefined),
  };

  return mockLog;
};
