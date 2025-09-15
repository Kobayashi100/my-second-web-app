<template>
  <h2>自転車シェア状況確認</h2>
  <p>ようこそ　{{ user }}　さん</p>
  <h3>利用状況：{{ bikeStatus }}</h3>
  <!-- 返却予定時刻がある場合だけ表示 -->
    <p v-if="returnTime">返却予定時刻: {{ returnTime }}</p>

    <!-- フラッシュメッセージ -->
    <div v-if="flashMessage" class="flash">
      {{ flashMessage }}
    </div>

    <!-- 条件分岐 -->
    <div v-if="currentUser === user">
      <!-- 利用中の本人には返却ボタン -->
      <button @click="returnBike">返却</button>
    </div>
    <!-- 自転車が誰も使っていない場合：貸出/充電ボタン -->
<div v-else-if="!currentUser">
  <button @click="openLentModal">貸出</button>
  <button @click="charging">充電</button>
</div>

<!-- 他のユーザーが利用中の場合：ボタンを出さない -->


  <!-- <button @click="charging">充電</button>
  <button @click="openLentModal">貸出</button> -->
  
  <br>
  <br>
  <button @click="goBack">ログイン画面に戻る</button>
   <div v-if="showLentModal" class="modal-overlay">
      <div class="modal">
        <h3>貸出登録</h3>

        <label>
  返却予定時刻（任意）:
  <select v-model="tempReturnTime">
    <option value="">選択してください</option>
    <option v-for="time in timeOptions" :key="time" :value="time">
      {{ time }}
    </option>
  </select>
</label>
        <br />

        

        <div class="modal-buttons">
          <button @click="cancelLent">キャンセル</button>
          <button @click="confirmLent">貸出する</button>
          
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bikeStatus, currentUser,returnTime } from '../stores/bikeStatus'

const status = ref('未使用')
const showLentModal = ref(false)
const route = useRoute()
const router = useRouter()
const user = route.query.user as string || '未指定'
// モーダル入力用の一時変数
const tempReturnTime = ref('')

function goBack() {
  router.push('/')   // 単純に / に戻す
}
// モーダル制御
function openLentModal() {
  showLentModal.value = true
}

// // 返却予定時刻　.00:00〜23:45までの15分刻みを生成
// const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
//   const h = String(Math.floor(i / 4)).padStart(2, '0')
//   const m = String((i % 4) * 15).padStart(2, '0')
//   return `${h}:${m}`
// })

// 現在時刻からスタートする 15分刻みの候補を生成
function generateTimeOptions() {
  const now = new Date()

  // 直近の15分単位に切り上げ
  const minutes = now.getMinutes()
  const roundedMinutes = Math.ceil(minutes / 15) * 15
  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1)
    now.setMinutes(0)
  } else {
    now.setMinutes(roundedMinutes)
  }
  now.setSeconds(0)
  now.setMilliseconds(0)

  // 例: 今から 8時間分の候補を作成
  const options: string[] = []
  for (let i = 0; i < 8 * 4; i++) {
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    options.push(`${h}:${m}`)
    now.setMinutes(now.getMinutes() + 15)
  }
  return options
}

// 選択肢
const timeOptions = ref<string[]>(generateTimeOptions())
//モーダル内貸出完了
function confirmLent() {
  bikeStatus.value = `貸出中（利用者: ${user}）`
  currentUser.value = user
   if (tempReturnTime.value) {
    returnTime.value = tempReturnTime.value
  } else {
    returnTime.value = null
  }
  showLentModal.value = false
}
//モーダル内キャンセル
function cancelLent() {
  showLentModal.value = false
}
// フラッシュメッセージ用
const flashMessage = ref<string | null>(null)

function showFlash(msg: string) {
  flashMessage.value = msg
  setTimeout(() => {
    flashMessage.value = null
  }, 1500) // 1.5秒後に消える
}

// 充電処理
function charging() {
  bikeStatus.value = `充電中`
}
// 返却処理
function returnBike() {
  // 状態をリセット
  bikeStatus.value = '未使用'
  currentUser.value = null
  returnTime.value = null
  showFlash('返却しました！')
  }
</script>

<style scoped>
/* モーダル用の簡易CSS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 1.5em;
  border-radius: 8px;
  width: 300px;
}
.modal-buttons {
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
}
</style>