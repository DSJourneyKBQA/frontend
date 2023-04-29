<template>
  <div>
    <div class="text-center">
      Roadmap
    </div>
    <div>
      <div
        v-for="item, index in road" :key="index"
        class="text-2xl text-center my-16 opacity-0"
        :class="[`item-${index}`, index % 2 === 1 ? 'translate-x-10' : '-translate-x-10']"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const road = ref([{
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}, {
  name: 'Go',
}])

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  road.value.forEach((item, index) => {
    gsap.to(`.item-${index}`, {
      scrollTrigger: {
        trigger: `.item-${index}`,
        start: 'top bottom',
        end: 'bottom top',
        scrub: false,
        toggleClass: 'active',
      },
    },
    )
  })
  // gsap.to('.item', {
  //   scrollTrigger: {
  //     trigger: '.item',
  //     start: 'bottom bottom',
  //     end: 'bottom top',
  //     scrub: false,
  //     toggleClass: 'active',
  //   },
  // },
  // )
})
</script>

<style>
  .active {
  color: red;
  opacity: 1;
  transform: translateX(0);
  transition: all 1s;
  }
</style>
