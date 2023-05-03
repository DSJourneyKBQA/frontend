<template>
  <div class="flex min-h-[400px] h-full shadow-[0_2px_12px_0_rgb(0_0_0/10%)] rounded-lg" :class="classes">
    <div v-show="showMode !== 2" class="flex-1 flex-shrink-0 flex flex-col pl-4 pb-4 w-1/2 h-full overflow-hidden">
      <h2>
        Markdown <CommonButton icon :dark="dark" class="font-normal text-base" @click="showMode = showMode ? 0 : 1">
          <IconReturn v-if="showMode" class="w-4 h-4" />
          <IconView v-else class="w-4 h-4" />
        </CommonButton>
      </h2>
      <textarea
        class="w-full h-full pr-4 overflow-y-auto resize-none border-none outline-none"
        :class="{
          'bg-gh-card': dark,
        }"
        :value="modelValue"
        @input="handleInput($event.target as HTMLTextAreaElement)" @scroll="alignPreview"
      />
    </div>
    <div
      v-show="showMode !== 1"
      class="flex-1 flex-shrink-0 flex flex-col pl-4 pb-4 w-1/2 h-full overflow-hidden border-l"
      :class="{
        'border-github': dark,
      }"
    >
      <h2>
        预览 <CommonButton icon :dark="dark" class="font-normal text-base" @click="showMode = showMode ? 0 : 2">
          <IconReturn v-if="showMode" class="w-4 h-4" />
          <IconView v-else class="w-4 h-4" />
        </CommonButton>
      </h2>
      <div ref="elePreview" class="w-full h-full pr-4 overflow-y-auto" v-html="preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
import { ref, toRefs } from 'vue'
import { renderMarkdown } from '@/utils'
import { useStore } from '@/store'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  dark: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['update:modelValue'])

const store = useStore()

const { setting } = toRefs(store)
const elePreview = ref<HTMLDivElement>()
const preview = ref(renderMarkdown(props.modelValue))
const showMode = ref(0) // 0->普通模式 1->只显示编辑框 2->只显示预览框
const classes = ref<string[]>([])

// 使用 debounce 防抖函数减少更新，优化性能
const updateValue = debounce((value) => {
  preview.value = renderMarkdown(value)
  emits('update:modelValue', value)
}, 100)

const updatePreviewTop = debounce((eleTextarea) => {
  if (elePreview.value) {
    elePreview.value.scrollTo({
      top: eleTextarea.scrollTop / (eleTextarea.scrollHeight - eleTextarea.clientHeight) * (elePreview.value.scrollHeight - elePreview.value.clientHeight),
      behavior: 'smooth',
    })
    // elePreview.value.scrollTop = eleTextarea.scrollTop / (eleTextarea.scrollHeight - eleTextarea.clientHeight) / (elePreview.value?.scrollHeight - elePreview.value.clientHeight)
  }
}, 100)

onMounted(() => {
  if (props.dark)
    classes.value.push('border border-github')
})

function alignPreview(e: Event) {
  if (setting.value.autoAlign)
    updatePreviewTop(e.target)
}

function handleInput(ele: HTMLTextAreaElement) {
  updateValue(ele.value)
}
</script>
