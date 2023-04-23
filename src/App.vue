<template>
  <RouterView />
</template>

<style>
/* 页面切换过渡 */
.page-in-enter-active,
.page-in-leave-active {
  transition: all 0.3s ease;
}

.page-in-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-in-leave-from,
.page-in-leave-to {
  /* 防错位 */
  position: absolute;
  opacity: 0;
}

/* 上方弹出过渡 */
.popup-t-enter-active,
.popup-t-leave-active {
  transition: all 0.3s ease;
}

.popup-t-enter-from,
.popup-t-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 上方弹出过渡 - 大幅度 */
.popup-t-lg-enter-active,
.popup-t-lg-leave-active {
  transition: all 0.3s ease;
}

.popup-t-lg-enter-from,
.popup-t-lg-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

/* 下方弹出过渡 */
.popup-b-enter-active,
.popup-b-leave-active {
  transition: all 0.3s ease;
}

.popup-b-enter-from,
.popup-b-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 右侧弹出过渡 - 大幅度 */
.popup-r-lg-enter-active,
.popup-r-lg-leave-active {
  transition: all 0.3s ease;
}

.popup-r-lg-enter-from,
.popup-r-lg-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
