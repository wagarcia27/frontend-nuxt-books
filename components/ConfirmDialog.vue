<template>
  <Teleport to="body">
    <div v-if="modelValue" class="cd-backdrop" @click="onBackdrop" />
    <div v-if="modelValue" class="cd-modal" role="dialog" aria-modal="true" :aria-label="title">
      <div class="cd-card">
        <h3 class="cd-title">{{ title }}</h3>
        <p class="cd-message">{{ message }}</p>
        <div class="cd-actions">
          <button class="btn secondary" @click="cancel">{{ cancelText }}</button>
          <button class="btn danger" @click="confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>(), {
  title: 'Confirmar acción',
  message: '¿Estás seguro?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar'
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()
const close = () => emit('update:modelValue', false)
const cancel = () => { emit('cancel'); close() }
const confirm = () => { emit('confirm'); close() }
const onBackdrop = (e: MouseEvent) => {
  e.stopPropagation()
  cancel()
}
const onKey = (e: KeyboardEvent) => {
  if (!props.modelValue) return
  if (e.key === 'Escape') cancel()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.cd-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(2px); z-index: 50;
}
.cd-modal { position: fixed; inset: 0; display: grid; place-items: center; z-index: 60; }
.cd-card {
  width: min(92vw, 420px);
  background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; padding: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.35);
}
.cd-title { margin: 0 0 8px 0; }
.cd-message { margin: 0 0 16px 0; color: var(--muted); }
.cd-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>


