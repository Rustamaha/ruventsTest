import { ref } from "vue";
import { defineStore } from "pinia";

import { WORKERS, generateStrings, STRINGS_LENGTH } from "../helpers";

import type { WordsList as List } from "../types/words";
import type { Ref } from "vue";

import { useWebWorkerFn } from "@vueuse/core";

export const useWordsStore = defineStore("WordsList", () => {
  const wordsList: Ref<List> = ref([]);
  const workerStatus = ref("SUCCESS");
  const filteredStrings: Ref<List> = ref([]);
  const isSearching = ref(false);

  const checkLocalStore = () => {
    if (localStorage.wordsList) {
      wordsList.value = JSON.parse(localStorage.wordsList) as List;
    }
  };

  const runWorkers = async () => {
    const promises = [];
    for (let b = 0; b < WORKERS; b++) {
      const {
        workerFn,
        workerTerminate,
        workerStatus: status,
      } = useWebWorkerFn(generateStrings);

      const calculate = workerFn().then((res) => {
        workerTerminate();
        workerStatus.value = status.value;
        return res;
      });
      promises.push(calculate);
    }
    await Promise.all(promises)
      .then((values) => {
        const positiveVal = values.filter((v: any) => v) as Array<List>;
        const flattened: List = positiveVal.flat();
        wordsList.value = [...wordsList.value, ...flattened] as List;
        const stor = localStorage.wordsList
          ? JSON.parse(localStorage.wordsList)
          : null;
        localStorage.clear();
        const words = stor
          ? JSON.stringify([...stor, ...flattened])
          : JSON.stringify(flattened);
        localStorage.setItem("wordsList", words);
      })
      .catch(() => {
        localStorage.clear();
        localStorage.setItem("wordsList", JSON.stringify(wordsList.value));
      });
  };

  const makeIterations = async () => {
    if (wordsList.value.length === STRINGS_LENGTH) {
      return;
    }
    await runWorkers();
    if (workerStatus.value === "SUCCESS") {
      makeIterations();
    }
  };

  const findSubstrings = (str: string) => {
    isSearching.value = true;
    filteredStrings.value = wordsList.value.filter((w) => w.startsWith(str));
    isSearching.value = false;
  };

  return {
    wordsList,
    makeIterations,
    checkLocalStore,
    findSubstrings,
    filteredStrings,
    isSearching,
  };
});
