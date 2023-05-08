export interface WebServer {
    start(): Promise<void>;
    listen(): Promise<void>;
    stop(): void;
}