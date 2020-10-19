const winston = require('winston');            // winston lib
const process = require('process');
const util = require('util')
const path = require("path")

const { format, loggers } = require('winston')
const { combine, timestamp, label, printf, prettyPrint } = winston.format;


// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// }


const arrayPrepareStackTrace = (err, stack) => { return stack }

const logFormat = printf(({ level, message, label, timestamp }) => {
  //return `[${level}] ${label} ${timestamp} ${message}`;    // log 출력 포맷 정의
  //return util.format('[%s] %s %s %s', level.padEnd(5, ' '), label, timestamp, message);
  return util.format('[%s] %s %s', level.padEnd(5, ' '), timestamp, message);
});

const consoleLogOption = {
  level: 'debug',
  handleExceptions: true,
  json: false, // 로그형태를 json으로도 뽑을 수 있다.
  colorize: false,
  format: combine(
    format.splat(),
    label({ label: 'console' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    logFormat
  )
}


let main_logger;
let randerer_logger;

/**
 * MainProcess Logger
 */
function getMainLogger() {

  if (main_logger) return main_logger;

  main_logger = new winston.createLogger({
    level: 'debug',
    format: combine(format.json(), timestamp(), prettyPrint()),
    transports: [
      new winston.transports.File({
        level: 'debug', // info
        filename: `${global.LOG_PATH}/main-process.log`, // 로그파일을 남길 경로
        handleExceptions: true,
        maxsize: (5242880 * 4), // 20MB
        maxFiles: 5,
        colorize: false,
        json: false,
        defaultMeta: { service: 'user-serice' },
        format: combine(
          format.splat(),
          label({ label: 'main' }),
          timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
          logFormat    // log 출력 포맷
        )
      }) // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
    ],
    exitOnError: false, 
  });
  
  if(process.env.NODE_ENV !== 'production'){
<<<<<<< HEAD
    main_logger.add(new winston.transports.Console(options.console)) // 개발 시 console로도 출력
=======
    main_logger.add(new winston.transports.Console(consoleLogOption)) // 개발 시 console로도 출력
>>>>>>> 557c87a8c547eab8dc6de1c25c26ce12425ff59e
  }

  return main_logger;
}

/**
 * Randerer File Logger
 * 
 * @deprecated
 */
function getRandererLogger() {

  if (randerer_logger) return randerer_logger;

  randerer_logger = new winston.createLogger({
    level: 'debug',
    format: combine(format.json(), timestamp(), prettyPrint()),
    transports: [
      new winston.transports.File( {
        level: 'debug', // info
        filename: `${global.LOG_PATH}/rander-process.log`, // 로그파일을 남길 경로
        handleExceptions: true,
        maxsize: (5242880 * 4), // 20MB
        maxFiles: 5,
        colorize: false,
        json: false,
        defaultMeta: { service: 'user-serice' },
        format: combine(
          format.splat(),
          label({ label: 'randerer' }),
          timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
          logFormat    // log 출력 포맷
        )
      }) // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
    ],
    exitOnError: false, 
  });
  
  if(process.env.NODE_ENV !== 'production'){
    randerer_logger.add(new winston.transports.Console(consoleLogOption)) // 개발 시 console로도 출력
  }

  return randerer_logger;
}

/**
 * Log Stack Info
 */
function getPreviousStackInfo() {
  let priorPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = arrayPrepareStackTrace;
    let stacks = (new Error()).stack;
    Error.prepareStackTrace = priorPrepareStackTrace;
    if (stacks) {
      return util.format('[%s:%s %s]> ',
        path.basename(stacks[2].getFileName()),
        stacks[2].getLineNumber(),
        stacks[2].getFunctionName()?stacks[2].getFunctionName():' ');
    }
    return '[ unknown ]> '
};

//module.exports = main_logger;
module.exports = {
  debug(msg, ...vars) {
    getMainLogger().debug(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }, 
  info(msg, ...vars) {
    getMainLogger().info(util.format(getPreviousStackInfo() + msg, ...vars), '');
  },
  warn(msg, ...vars) {
    getMainLogger().warn(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }, 
  error(msg, ...vars) {
    getMainLogger().error(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }, 
  err(msg, ...vars) {
    getMainLogger().error(util.format(getPreviousStackInfo() + msg, ...vars), '');
  },
  debugRanderer(msg, ...vars) {
    getMainLogger().debug(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }, 
  infoRanderer(msg, ...vars) {
    getMainLogger().info(util.format(getPreviousStackInfo() + msg, ...vars), '');
  },
  warnRanderer(msg, ...vars) {
    getMainLogger().warn(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }, 
  errorRanderer(msg, ...vars) {
    getMainLogger().error(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }, 
  errRanderer(msg, ...vars) {
    getMainLogger().error(util.format(getPreviousStackInfo() + msg, ...vars), '');
  },
  randerer(msg, ...vars) {
    getMainLogger().info(util.format(getPreviousStackInfo() + msg, ...vars), '');
  }
}
