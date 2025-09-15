<template>
  <h2>ログイン</h2>
  <div class="loginComment">ユーザーを選択してください</div>
  <br>
  <button @click="goIndex('ひなた')">ひなた</button>
  <button @click="goIndex('まなみ')">まなみ</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goIndex(user: string) {
  // クエリパラメータにユーザー名を載せて遷移
  router.push({ path: '/index', query: { user } })
}
</script>