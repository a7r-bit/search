import * as winston from 'winston';
import { LogLevel } from '../../../domain/log';

export default class FileTransport {
    public static create() {
        return new winston.transports.File({
            filename: 'logs/app.log',
            level: LogLevel.Info,
            format: winston.format.combine(
                winston.format((info) => {
                    const { data, ...rest } = info as any;
                    const flat = { ...rest, ...(data ?? {}) };

                    if (Array.isArray(flat.sourceClass)) {
                        flat.sourceClass = flat.sourceClass[0];
                    }

                    flat.timestamp = new Date().toISOString();

                    delete flat.label;

                    return flat;
                })(),
                winston.format.json(),
            ),
        });
    }
}
