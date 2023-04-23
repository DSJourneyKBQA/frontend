<template>
  <div class="w-full min-h-screen bg-white">
    <AdminNav />
    <div class="flex w-full">
      <AdminSideBar />
      <div class="w-full p-6 h-[calc(100vh-60px)] overflow-y-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="page-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>
