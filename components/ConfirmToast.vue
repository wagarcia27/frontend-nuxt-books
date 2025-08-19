<template>
  <Teleport to="body">
    <div v-if="modelValue" class="toast">
      <span>{{ message }}</span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: boolean; message?: string; timeoutMs?: number }>(), {
  message: 'Acción realizada con éxito',
  timeoutMs: 1800
})
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
watch(() => props.modelValue, (v) => {
  if (v) setTimeout(() => emit('update:modelValue', false), props.timeoutMs)
})
</script>

<style scoped>
.toast {
  position: fixed; left: 50%; top: 20px; transform: translateX(-50%);
  background: rgba(34,197,94,0.95); color: #0b1220; padding: 10px 14px; border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3); font-weight: 600; z-index: 80;
}
</style>


