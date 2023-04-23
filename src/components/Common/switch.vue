<template>
  <div
    class="relative w-[50px] h-[25px] rounded-[25px] transition-colors duration-300 inline-block"
    :class="{ 'bg-[#dcdfe6]': !modelValue, 'bg-[#409eff]': modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div
      class="absolute w-[19px] h-[19px] bg-white top-[3px] left-[3px] rounded-full transition-transform duration-300"
      :class="{ 'translate-x-[25px]': modelValue }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: Boolean
}>()
defineEmits(['update:modelValue'])
</script>
