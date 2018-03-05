export class JsonRPCRequest {
    private static counter: number = 0;

    public readonly jsonrpc: string = '2.0';
    public method: string;
    public params: any[];
    public id?: number | string;

    private static nextCounter() {
        JsonRPCRequest.counter++;
        return JsonRPCRequest.counter;
    }

    constructor(method: string, params: any[], notification?: boolean) {
        this.method = method;
        this.params = params;
        if (!notification) {
            this.id = JsonRPCRequest.nextCounter();
        }
    }
}

export class JsonRPCResponse {
    public id: number | string;
    public result?: any;
    public error?: JsonRPCError;
    public readonly jsonrpc: string = '2.0';
    constructor(id: number | string, result?: any, error?: JsonRPCError) {
        this.id = id;
        this.result = result;
        this.error = error;
    }
}

export class JsonRPCError {
    constructor(public code: number, public message: string, public data?: any) { }
}
