<template>
  <div class="h-[calc(100vh-60px)] main-page">
    <div class="w-full h-full overflow-hidden flex flex-col items-center justify-center relative">
      <canvas ref="canvasEl" class="absolute top-0 left-0" />
      <div class="z-10 absolute w-full h-full bg-black/40" />
      <div class="font-bold text-6xl text-white z-20">
        DS Journey
      </div>
      <!-- <button
      class="px-4 py-2 my-4 font-semibold bg-green-300 hover:bg-green-400 border border-green-400 rounded-full transition-colors"
      @click="$router.push('/study')"
    >
      开始分布式学习之旅
    </button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const canvasEl = ref<HTMLCanvasElement>()

const max_particles = 100
let particles = [] as any[]
const frequency = 100
const init_num = max_particles
const max_time = frequency * max_particles
let time_to_recreate = false

let canvas: CanvasRenderingContext2D | null

onMounted(() => {
  setTimeout(() => {
    time_to_recreate = true
  }, max_time)
  if (canvasEl.value) {
    canvasEl.value.width = document.documentElement.clientWidth
    canvasEl.value.height = document.documentElement.clientHeight

    canvas = canvasEl.value.getContext('2d')
  }

  update()
})

class Particle {
  random: number
  canvas: CanvasRenderingContext2D
  progress: number
  x: number
  y: number
  w: number
  h: number
  radius: number
  type: string
  color: string
  a: number
  s: number
  constructor(canvas: CanvasRenderingContext2D) {
    const colors = ['#feea00', '#a9df85', '#5dc0ad', '#ff9a00', '#fa3f20']
    const types = ['full', 'fill', 'empty']
    this.random = Math.random()
    this.canvas = canvas
    this.progress = 0

    this.x = (document.documentElement.clientWidth / 2) + (Math.random() * 200 - Math.random() * 200)
    this.y = (document.documentElement.clientHeight / 2) + (Math.random() * 200 - Math.random() * 200)
    this.w = document.documentElement.clientWidth
    this.h = document.documentElement.clientWidth
    this.radius = 1 + (8 * this.random)
    this.type = types[this.randomIntFromInterval(0, types.length - 1)]
    this.color = colors[this.randomIntFromInterval(0, colors.length - 1)]
    this.a = 0
    this.s = (this.radius + (Math.random() * 1)) / 10
    // this.s = 12 //Math.random() * 1;
  }

  getCoordinates() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  render() {
    // Create arc
    const lineWidth = 0.2 + (2.8 * this.random)
    const color = this.color
    switch (this.type) {
      case 'full':
        this.createArcFill(this.radius, color)
        this.createArcEmpty(this.radius + lineWidth, lineWidth / 2, color)
        break
      case 'fill':
        this.createArcFill(this.radius, color)
        break
      case 'empty':
        this.createArcEmpty(this.radius, lineWidth, color)
        break
    }
  }

  createArcFill(radius: number, color: string) {
    this.canvas.beginPath()
    this.canvas.arc(this.x, this.y, radius, 0, 2 * Math.PI)
    this.canvas.fillStyle = color
    this.canvas.fill()
    this.canvas.closePath()
  }

  createArcEmpty(radius: number, lineWidth: number, color: string) {
    this.canvas.beginPath()
    this.canvas.arc(this.x, this.y, radius, 0, 2 * Math.PI)
    this.canvas.lineWidth = lineWidth
    this.canvas.strokeStyle = color
    this.canvas.stroke()
    this.canvas.closePath()
  }

  move() {
    this.x += Math.cos(this.a) * this.s
    this.y += Math.sin(this.a) * this.s
    this.a += Math.random() * 0.4 - 0.2

    if (this.x < 0 || this.x > this.w - this.radius)
      return false

    if (this.y < 0 || this.y > this.h - this.radius)
      return false

    this.render()
    return true
  }

  calculateDistance(v1: { x: number; y: number }, v2: { x: number; y: number }) {
    const x = Math.abs(v1.x - v2.x)
    const y = Math.abs(v1.y - v2.y)
    return Math.sqrt((x * x) + (y * y))
  }
}

function popolate(num: number) {
  for (let i = 0; i < num; i++) {
    setTimeout(
      (function (x) {
        return function () {
          // Add particle
          if (!canvas)
            return
          particles.push(new Particle(canvas))
        }
      }(i))
      , frequency * i)
  }
  return particles.length
}

function clear() {
  if (!canvas)
    return
  if (!canvasEl.value)
    return
  canvas.fillStyle = '#111111'
  canvas.fillRect(0, 0, canvasEl.value.width, canvasEl.value.height)
}

function connection() {
  let old_element: any = null
  particles.forEach((element, index) => {
    if (index > 0) {
      if (!canvas)
        return
      const box1 = old_element.getCoordinates()
      const box2 = element.getCoordinates()
      canvas.beginPath()
      canvas.moveTo(box1.x, box1.y)
      canvas.lineTo(box2.x, box2.y)
      canvas.lineWidth = 0.45
      canvas.strokeStyle = '#3f47ff'
      canvas.stroke()
      canvas.closePath()
    }

    old_element = element
  })
}

function update() {
  clear()
  connection()
  particles = particles.filter(p => p.move())
  if (time_to_recreate) {
    if (particles.length < init_num)
      popolate(1)
  }

  requestAnimationFrame(update)
}
</script>

<style>

</style>
