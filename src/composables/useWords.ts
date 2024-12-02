import { ref } from "vue";
import { generateStrings, STRINGS_LENGTH, runWorkers } from "../helpers";
import type { WordsList as List } from "../types/words";
import type { Ref } from "vue";
import { useIndexedDB } from "./useIndexedDB";
import type { WebWorkerStatus } from "@vueuse/core";

export const useWords = () => {
  const wordsList: Ref<List> = ref([]);
  const workerStatus: Ref<WebWorkerStatus> = ref("SUCCESS");
  const filteredRecords: Ref<List> = ref([]);
  const isSearching = ref(false);

  const { getRecordsLength, addRecords, filterRecords } = useIndexedDB();

  const makeIterations = async () => {
    if (await getRecordsLength() >= STRINGS_LENGTH) {
      return;
    }
    const done = await runWorkers(generateStrings);
    if (!done) return;
    const { values, status } = done;
    wordsList.value.push(...values)
    await addRecords(wordsList)
    workerStatus.value = status.value;
    if (workerStatus.value === "SUCCESS") {
      makeIterations();
    }
  };

  const findSubstrings = async (str: string) => {
    isSearching.value = true;
    filteredRecords.value = await filterRecords(str);
    isSearching.value = false;
  };

  return {
    wordsList,
    makeIterations,
    findSubstrings,
    filteredRecords,
    isSearching,
  };
};
