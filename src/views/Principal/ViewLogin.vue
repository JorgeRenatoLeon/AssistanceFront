<template>
  <div class="Login" >
    <LoginForm />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/Principal/LoginForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm
  },
  methods:{
  }
}
</script>