import { ref } from 'vue'

// 自転車の利用状況（全体で1つだけ）
export const bikeStatus = ref<string>('未使用')

// 現在利用中のユーザー
export const currentUser = ref<string | null>(null)

// 返却予定時刻（任意入力）
export const returnTime = ref<string | null>(null)

// 充電しているユーザー
export const chargingUser = ref<string | null>(null)