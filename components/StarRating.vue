<template>
  <div class="rating" role="radiogroup" aria-label="calificación">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="star"
      :class="{ active: n <= current }"
      @click="update(n)"
      :aria-checked="n===current"
      role="radio"
      :title="`${n} de 5`"
    >★</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const current = computed(() => props.modelValue || 0)
const update = (v: number) => emit('update:modelValue', v)
</script>

<style scoped>
.rating { display: inline-flex; gap: 6px; align-items: center; }
.star {
  width: 24px; height: 24px; display: grid; place-items: center;
  border-radius: 6px; background: white; color: #9ca3af; cursor: pointer;
}
.star.active { color: #f59e0b; }
</style>


