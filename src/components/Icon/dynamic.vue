<template>
  <IconServer v-if="type === ItemType.StorageServer" />
  <IconGateway v-else-if="type === ItemType.GatewayServer" />
  <IconConfig v-else-if="type === ItemType.ConfigServer" />
  <IconComputer v-else-if="type === ItemType.Client" />
</template>

<script setup lang="ts">
import { ItemType } from '@/enums'
defineProps<{
  type: ItemType
}>()
</script>
