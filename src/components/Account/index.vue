<template>
  <ElDialog v-model="state.isShow" width="480px" class="custom1-color contanier"
            style="overflow: hidden;padding: 16px 0;">
    <transition name="slide-left" mode="out-in">
      <component :is="currentComponent" :login="state.login" :methods="methods" :register="state.register"
                 :key="state.status"></component>
    </transition>
  </ElDialog>
</template>

<script setup>
import Login from "./Login.vue"
import Register from './Register.vue'

const state = reactive({
  isShow: false,
  status: '',
  login: {
    email: "",
    password: "",
  },
  register: {
    email: "",
    password: "",
    userVerifyCode: "",
  }
});
const methods = {
  show(option) {
    state.isShow = true;
    state.status = option.status
  },
  hide() {
    state.isShow = false;
  },
  checkStatus(status) {
    state.status = status
  }
}
const currentComponent = computed(() => {
  return state.status === 'Login' ? Login : Register
})

defineExpose(methods)


</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;

}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>