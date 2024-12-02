import { useWebWorkerFn } from "@vueuse/core";
import type { WebWorkerStatus } from "@vueuse/core";
import type { WordsList as List } from "../types/words";
import type { Ref } from "vue";

export const WORKERS = 2; // 5

export const STRINGS_LENGTH = 10_000_000;

export const runWorkers = async (fn: (...args: Array<any>) => unknown): Promise<{ values: List; status: Ref<WebWorkerStatus> } | undefined> => {
  const {
    workerFn,
    workerTerminate,
    workerStatus: status,
  } = useWebWorkerFn(fn);

  try {
    const values = await workerFn() as List;
    workerTerminate();
    return { values, status };
  } catch (err) {
    console.error(err);
  }
};