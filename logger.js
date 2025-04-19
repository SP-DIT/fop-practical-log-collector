import winston from 'winston';
import LokiTransport from 'winston-loki';

const LOKI_URL = process.env.LOKI_URL;
const LOKI_AUTH = process.env.LOKI_AUTH;

const transports = [new winston.transports.Console()];
if (LOKI_URL) {
    transports.push(
        new LokiTransport({
            host: LOKI_URL,
            labels: { app: 'fop-practical-log-collector' },
            json: true,
            basicAuth: LOKI_AUTH,
            format: winston.format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error(err),
        }),
    );
}

console.log(transports.length);

// Configure Winston with Loki transport
const logger = winston.createLogger({
    transports,
});

export default logger;
