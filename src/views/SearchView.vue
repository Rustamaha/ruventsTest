<template lang="pug">
.search-block
  .search-block__form
    el-form(
      ref="formRef"
      :model="validateForm"
      label-width="100px"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    )
      el-form-item(
        label="word"
        prop="word"
      )
        el-input(
          v-model="validateForm.word"
          type="text"
          autocomplete="off"
          :max-length="100"
          placeholder="please enter your word"
        )
          template( #append )
            el-button(
              native-type="submit"
              :disabled="isDisabled"
            )
              IconSearch
    .search-block__legend
      el-progress(
        type="dashboard"
        :percentage="percentage"
        :color="colors"
      )
      .search-block__legend-title {{ legendTitle }}
  .search-block__content
    el-card( v-loading="isSearching" )
      el-badge(
        v-if="isFormSubmitted"
        :value="filteredStrings.length"
        :max="STRINGS_LENGTH"
      )
        el-button(
          title="Show this strings"
          @click="showStrings"
        ) {{ submitValue }}
      
      DynamicScroller.search-block__content-text(
        v-if="filteredStrings.length && areStringsShowed"
        :items="filteredStrings"
        :min-item-size="54"
        :buffer="50"
      )
        template( v-slot="{ item, index, active }" )
          DynamicScrollerItem(
            :item="item"
            :active="active"
            :size-dependencies="[ item ]"
            :data-index="index"
          )
            span {{ item }}
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import type { WordsList } from "../types/words";
import { STRINGS_LENGTH } from "../helpers";
import IconSearch from "@/components/icons/IconSearch.vue";

import { useWordsStore } from "../stores/words.module";
import { storeToRefs } from "pinia";

const formRef = ref<FormInstance>();
const isFormSubmitted = ref(false);
const areStringsShowed = ref(false);
const submitValue = ref("");

const validateForm = reactive({
  word: "",
});

const checkString = (
  _rule: any,
  value: string,
  callback: (arg?: Error | undefined) => void
) => {
  if (value === "") {
    callback(new Error("Word is required"));
  }
  if (/\d/.test(value)) {
    callback(new Error("Please input only alphabet letters"));
  } else {
    callback();
  }
};

const rules = reactive({
  word: [{ trigger: "change", validator: checkString }],
});

const colors = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#5cb87a", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#6f7ad3", percentage: 100 },
];

const isDisabled = computed(() => !validateForm.word);

const store = useWordsStore();

const wordsList = computed(() => store.wordsList);

const percentage = computed(() => wordsList.value.length / 100000);

const isSearching = computed(() => store.isSearching);

const legendTitle = computed(() =>
  percentage.value === 100
    ? "Strings successfully uploaded to localStorage"
    : "Strings are loading to localStorage"
);

const filteredStrings = computed(() => store.filteredStrings);

onMounted(() => {
  store.checkLocalStore();
  store.makeIterations();
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      store.findSubstrings(validateForm.word);
      isFormSubmitted.value = true;
      submitValue.value = validateForm.word;
    } else {
      isFormSubmitted.value = false;
    }
  });
};

const showStrings = () => (areStringsShowed.value = !areStringsShowed.value);
</script>
<style lang="scss" scoped>
@import "@/assets/scrollbar";

%columns {
  display: grid;
  grid-template-columns: 70% 1fr;
}

.search-block {
  font-size: medium;

  &__form {
    @extend %columns;
    padding: 20px;
    border-bottom: 1px solid var(--el-menu-border-color);
    background-color: aqua;
  }

  :deep(.el-form-item) {
    display: block;

    label {
      font-size: medium;
      display: block;
      color: black;
    }
  }

  &__legend {
    text-align: center;
  }

  :deep(.el-button) {
    height: 35px;
  }

  &__content {
    background-color: lightgray;
    padding: 20px;
    height: 85vh;

    :deep(.el-button) {
      height: 55px;
      font-size: large;
      &:hover {
        background-color: lightgray;
      }
    }

    :deep(.el-badge__content) {
      height: 45px;
      width: 45px;
      border-radius: 21px;
      font-size: large;
    }
  }

  &__content-text {
    margin-top: 15px;
    height: calc(90vh - 325px);
    overflow-y: auto;
    @include custom-scroll-bar;
  }

  :deep(.el-card) {
    text-align: center;
    padding: 25px 0 10px 0;
    height: calc(95vh - 250px);
    box-shadow: none;
    background-color: aliceblue;
  }
}
</style>
