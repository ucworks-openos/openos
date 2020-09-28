const winston = require('winston');            // winston lib
const process = require('process');

const { format } = require('winston')
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

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;    // log 출력 포맷 정의
});

const options = {
  // log파일
  file: {
    level: 'debug', // info
    filename: `D:/ucware/logs/main-process.log`, // 로그파일을 남길 경로
    handleExceptions: true,
    maxsize: (5242880 * 4), // 20MB
    maxFiles: 5,
    colorize: false,
    json: false,
    defaultMeta: { service: 'user-serice' },
    format: combine(
      format.splat(),
      label({ label: 'log' }),
      timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
      myFormat    // log 출력 포맷
    )
  },
  // 개발 시 console에 출력
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false, // 로그형태를 json으로도 뽑을 수 있다.
    colorize: false,
    format: combine(
      format.splat(),
      label({ label: 'console' }),
      timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
      myFormat
    )
  }
}
 
let logger = new winston.createLogger({
  level: 'info',
  format: combine(format.json(), timestamp(), prettyPrint()),
  transports: [
    new winston.transports.File(options.file) // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
  ],
  exitOnError: false, 
});
 
if(process.env.NODE_ENV !== 'production'){
  logger.add(new winston.transports.Console(options.console)) // 개발 시 console로도 출력
}
 
module.exports = logger;
