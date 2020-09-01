import winston from 'winston';
import WinstonFileRotator from 'winston-daily-rotate-file';

global.logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new WinstonFileRotator({
      dirname: 'logs',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.Console({
      level: 'debug',
      stderrLevels: ['error', 'crit', 'alert', 'emerg'],
      consoleWarnLevels: ['warn', 'warning'],
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(({
          message, level, timestamp, service, stack,
        }) => {
          const { colorize } = winston.format.colorize();
          const output = `[${timestamp}] ${colorize(level, `${level}`)} ${message}`;
          if (stack) return output.concat('\n', stack);
          return output;
        }),
      ),
    })
  ]
});

declare global {
  // eslint-disable-next-line no-var
  var logger: Pick<winston.Logger, 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'>;
}
