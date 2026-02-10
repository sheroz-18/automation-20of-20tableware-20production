<template>
  <AuthLayout subtitle="Войдите в свой аккаунт">
    <LoginForm />
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/components/auth/AuthLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>
