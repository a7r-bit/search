import { Inject } from '@nestjs/common';
import { LogLevel, LogData } from '../../domain/log';
import Logger from '../../domain/logger';
import winston from 'winston';

export const WinstonLoggerTransportsKey = Symbol();


export default class WinstonLogger implements Logger {
    private logger: winston.Logger;

    public constructor(@Inject(WinstonLoggerTransportsKey) transports: winston.transport[]) {
        this.logger = winston.createLogger(this.getLoggerFormatOptions(transports));
    }

    private getLoggerFormatOptions(transports: winston.transport[]) {
        const levels: any = {};
        let cont = 0;
        Object.values(LogLevel).forEach((level) => {
            levels[level] = cont;
            cont++;
        });

        return {
            level: LogLevel.Debug,
            levels: levels,
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                winston.format((info, opts) => {
                    // Info contains an Error property
                    if (info.error && info.error instanceof Error) {
                        info.stack = info.error.stack;
                        info.error = undefined;
                    }

                    info.label = `${info.organization}.${info.context}.${info.app}`;

                    return info;
                })(),
                winston.format.metadata({
                    key: 'data',
                    fillExcept: ['timestamp', 'level', 'message'],
                }),
                winston.format.json(),
            ),
            
            transports: transports,
            exceptionHandlers: transports,
            rejectionHandlers: transports,
        };
    }

    public log(level: LogLevel, message: string | Error, data?: LogData, profile?: string) {
        const logData = {
            level: level,
            message: message instanceof Error ? message.message : message,
            error: message instanceof Error ? message : undefined,
            ...data,
        };

        if (profile) {
            this.logger.profile(profile, logData);
        } else {
            this.logger.log(logData);
        }
    }

    public debug(message: string, data?: LogData, profile?: string) {
        this.log(LogLevel.Debug, message, data, profile);
    }
    public info(message: string, data?: LogData, profile?: string): void {
        this.log(LogLevel.Info, message, data, profile);
    }
    public warn(message: string | Error, data?: LogData, profile?: string): void {
        this.log(LogLevel.Warn, message, data, profile);
    }
    public error(message: string | Error, data?: LogData, profile?: string): void {
        this.log(LogLevel.Error, message, data, profile);
    }
    public fatal(message: string | Error, data?: LogData, profile?: string): void {
        this.log(LogLevel.Fatal, message, data, profile);
    }
    public emergency(message: string | Error, data?: LogData, profile?: string): void {
        this.log(LogLevel.Emergency, message, data, profile);
    }
    public startProfile(id: string): void {
        this.logger.profile(id);
    }
}
