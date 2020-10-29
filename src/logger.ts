import * as Winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

global.logger = Winston.createLogger({
  levels: Winston.config.syslog.levels,
  format: Winston.format.combine(
    Winston.format.errors({ stack: true }),
    Winston.format.timestamp(),
    Winston.format.json(),
  ),
  transports: [
    new WinstonDailyRotateFile({
      dirname: 'logs',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new Winston.transports.Console({
      level: 'debug',
      stderrLevels: ['error', 'crit', 'alert', 'emerg'],
      consoleWarnLevels: ['warn', 'warning'],
      handleExceptions: true,
      format: Winston.format.combine(
        Winston.format.errors({ stack: true }),
        Winston.format.timestamp(),
        Winston.format.simple(),
        Winston.format.printf(({
          message, level, timestamp, service, stack,
        }) => {
          const { colorize } = Winston.format.colorize();
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
  var logger: Pick<Winston.Logger, 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'>;
}
