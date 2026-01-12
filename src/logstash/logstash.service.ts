import { Injectable } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class LogstashService {
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

    log(data: any) {
        try {
            if (this.isConnected) {
                this.client.write(JSON.stringify(data) + '\n');
            } else {
                console.warn('⚠️ Logstash not connected, dropping log:', data);
            }
        } catch (error) {
            console.error('Error sending log:', error);
        }
    }

    onModuleDestroy() {
        if (this.isConnected) {
            this.client.end();
        }
    }
}
