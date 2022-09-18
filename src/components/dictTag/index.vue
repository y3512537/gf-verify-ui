<template>
  <!-- 默认样式 -->
  <span
      v-if="
      dictData?.listClass === 'default' ||
      dictData?.listClass === '' ||
      dictData?.listClass === undefined "
      :key="dictData?.value"
      :class="dictData?.cssClass"
  >
    {{ dictData?.dictLabel }}
  </span>
  <!-- Tag 样式 -->
  <ElTag
      v-else
      :disable-transitions="true"
      :key="dictData?.value + ''"
      :type="dictData?.listClass === 'primary' ? 'success' : dictData?.listClass"
      :class="dictData?.cssClass"
  >
    {{ dictData?.dictLabel }}
  </ElTag>
</template>


<script lang="ts" setup>
import {onMounted, onUpdated, PropType, ref} from "vue";
import {DictData} from "/@/types/dict";
import {getDictOptions} from "/@/utils/dict";

// eslint-disable-next-line no-undef
const props = defineProps({
  type: {
    type: String as PropType<string>,
    required: true
  },
  value: {
    type: [String, Number] as PropType<string | number>,
    required: true
  }
})
const dictData = ref<DictData>()
const getDictObj = (dictType: string, value: string) => {
  const dictOptions = getDictOptions(dictType)
  dictOptions.forEach((dict: DictData) => {
    if (dict.dictValue === value) {
      dictData.value = dict
    }
  })
}
onMounted(() => {
  return getDictObj(props.type, props.value?.toString())
})

onUpdated(() => {
  getDictObj(props.type, props.value?.toString())
})

</script>
