import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class LogstashService implements OnModuleDestroy {
    private client: net.Socket;
    private readonly host = process.env.LOGSTASH_HOST || 'localhost';
    private readonly port = Number(process.env.LOGSTASH_PORT || 5000);
    private isConnected = false;

    constructor() {
        this.client = new net.Socket();
        this.connect();
    }

    private connect() {
        this.client.connect(this.port, this.host, () => {
            this.isConnected = true;
            console.log(`Connected to Logstash at ${this.host}:${this.port}`);
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            console.error('Logstash connection error:', err.message);
            setTimeout(() => this.connect(), 5000);
        });

        this.client.on('close', () => {
            this.isConnected = false;
            console.warn('Logstash connection closed, reconnecting...');
            setTimeout(() => this.connect(), 5000);
        });
    }

    private sendLog(level: string, message: string, context?: any) {
        const payload = {
            level,
            timestamp: new Date().toISOString(),
            message,
            ...context,
        };

        try {
            if (this.isConnected) {
                this.client.write(JSON.stringify(payload) + '\n');
                console.log(`Logstash sent ${level} log:`, payload);
            } else {
                console.warn(`Logstash not connected, dropping ${level} log:`, payload);
            }
        } catch (error) {
            console.error('Error sending log:', error);
        }
    }

    log(data: any) {
        this.info(JSON.stringify(data));
    }

    info(message: string, context?: any) {
        this.sendLog('INFO', message, context);
    }

    warn(message: string, context?: any) {
        this.sendLog('WARN', message, context);
    }

    error(message: string, trace?: string, context?: any) {
        this.sendLog('ERROR', message, { trace, ...context });
    }

    onModuleDestroy() {
        if (this.isConnected) {
            this.client.end();
        }
    }
}
