// source: https://gist.github.com/julianpoemp/1292445696eae2ea319d92ae15ecffa4

function example() {
    const tsWorker = new TsWorker();

    // create a new job. You can create a sub class of TsWorker so that you don't have to add the function any time.
    const tsJob: TsWorkerJob = new TsWorkerJob((args: any[]) => {
        return new Promise<any>((resolve, reject) => {
            // because args is an array you need to use indexes.
            const time = args[0];
            console.log(`caculate anything...`);
            setTimeout(() => {
                resolve(42);
            }, time);
        });
    }, [3000]);

    // run the job asynchronous
    tsWorker.run(tsJob).then((ev: TsWorkerEvent) => {
        // finished
        const secondsLeft = (ev.statistics!.ended - ev.statistics!.started) / 1000;
        console.log(`the result is ${ev.result}`);
        console.log(`time left for calculation: ${secondsLeft}`);
    }).catch((error) => {
        // error
        console.log(`error`);
        console.error(error);
    });
}

export class TsWorker {
    private blobURL: string;
    private worker: Worker;

    private status: TsWorkerState = TsWorkerState.INITIALIZED;

    constructor() {
        // creates an worker that runs a job
        this.blobURL = URL.createObjectURL(new Blob([
            this.getWorkerScript()
        ],
            {
                type: 'application/javascript'
            }
        ));
        this.worker = new Worker(this.blobURL);
    }

    public run = (job: TsWorkerJob): Promise<any> => {
        return new Promise<any>(
            (resolve, reject) => {
                this.worker.onmessage = (ev: MessageEvent) => {
                    job.statistics.ended = Date.now();
                    this.status = ev.data.status;
                    ev.data.statistics = job.statistics;
                    resolve(ev.data);
                };

                this.worker.onerror = (err) => {
                    job.statistics.ended = Date.now();
                    this.status = TsWorkerState.FAILED;

                    reject({
                        status: TsWorkerState.FAILED,
                        message: err,
                        statistics: job.statistics
                    });
                };

                job.statistics.started = Date.now();
                this.worker.postMessage({
                    command: 'run',
                    args: [this.convertJobToObj(job)]
                });
            }
        );
    }

    private convertJobToObj(job: TsWorkerJob) {
        return {
            id: job.id,
            args: job.args,
            doFunction: job.doFunction.toString()
        };
    }

    /**
     * destroys the Taskmanager if not needed anymore.
     */
    public destroy() {
        URL.revokeObjectURL(this.blobURL);
    }

    private getWorkerScript(): string {
        return `var job = null;
var base = self;
onmessage = function (msg) {
    var data = msg.data;
    var command = data.command;
    var args = data.args;
    switch (command) {
        case("run"):
            base.job = args[0];
            var func = new Function("return " + base.job.doFunction)();
            func(base.job.args).then(function (result) {
                base.postMessage({
                    status: "finished",
                    result: result
                });
            }).catch(function (error) {
                base.postMessage({
                    type: "failed",
                    message: error
                });
            });
            break;
        default:
            base.postMessage({
                status: "failed",
                message: "invalid command"
            });
            break;
    }
}`;
    }
}

export enum TsWorkerState {
    INITIALIZED = 'initialized',
    RUNNING = 'running',
    FINISHED = 'finished',
    FAILED = 'failed',
    STOPPED = 'stopped'
}

export class TsWorkerJob {
    get statistics(): { ended: number; started: number } {
        return this._statistics;
    }

    set statistics(value: { ended: number; started: number }) {
        this._statistics = value;
    }

    get args(): any[] {
        return this._args;
    }

    get id(): number {
        return this._id;
    }

    private static jobIDCounter = 0;
    private _id: number;
    private _args: any[] = [];

    private _statistics = {
        started: -1,
        ended: -1
    };

    constructor(doFunction: (args: any[]) => Promise<any>, args: any[]) {
        this._id = ++TsWorkerJob.jobIDCounter;
        this.doFunction = doFunction;
        this._args = args;
    }

    doFunction = (args: any[]) => {
        return new Promise<any>((resolve, reject) => {
            reject('not implemented');
        });
    }
}

export interface TsWorkerEvent {
    status: TsWorkerState;
    result: any;
    statistics?: {
        started: number;
        ended: number;
    };
    message?: string;
}