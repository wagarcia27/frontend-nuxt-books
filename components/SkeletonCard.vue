<template>
  <div class="card skeleton">
    <div class="left"></div>
    <div class="right">
      <div class="line w-70"></div>
      <div class="line w-40"></div>
      <div class="line w-90"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton { display:flex; gap:12px; }
.left { width:96px; height:144px; border-radius:8px; background: linear-gradient(90deg, #182033 0%, #0f172a 50%, #182033 100%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.right { flex:1; display:flex; flex-direction:column; gap:10px; }
.line { height:14px; border-radius:6px; background: linear-gradient(90deg, #182033 0%, #0f172a 50%, #182033 100%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.w-40 { width:40%; }
.w-70 { width:70%; }
.w-90 { width:90%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
</style>


