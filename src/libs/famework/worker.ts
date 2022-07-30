import { Worker, isMainThread, workerData, parentPort } from 'node:worker_threads';

export const useWorker = <Param, Result>(
  name: string,
  callback: (param: Param) => Result | Promise<Result>,
) => {
  if (!isMainThread) {
    console.log(`APPLICATION | Executing worker ${name}`);

    const executeWorker = async () => {
      const resultOrPromise = callback(workerData);
      const result = resultOrPromise instanceof Promise
        ? await resultOrPromise
        : resultOrPromise;

      parentPort?.postMessage(result);
      parentPort?.close();

      console.log(`APPLICATION | Finish executing worker ${name}`);
    };

    executeWorker();
  } else {
    return {
      execute: (filename: string, param: Param) => {
        const worker = new Worker(filename, {
          workerData: param,
        });

        return new Promise<Result>((resolve, reject) => {
          worker.on('message', resolve);
          worker.on('error', reject);
          worker.on('exit', (code) => {
            if (code !== 0) {
              reject(new Error(`Worker stopped with exit code ${code}`));
            }
          });
        });
      },
    };
  }
};
