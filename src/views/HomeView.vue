<template>
  <v-container class="d-flex justify-center" style="margin-left: 1%; padding-top: 10vh;">
    <v-card class="pa-6" outlined max-width="400" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <v-card-title class="text-h5 text-center" style="color: #285b28;">
        <strong>WELCOME {{ loggedInAccount?.name || 'Guest' }}</strong>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text-center">
        <p class="text-h6" style="font-weight: bold;">Your Balance: <span style="color: #2E8B57;">{{ loggedInAccount?.balance || 0 }}</span></p>
        <p class="mt-4" style="font-style: italic; color: #6c757d;">"Make your goal more than money. Make it about helping people and creating a better future." - Maxime Lagacé</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center">
        <v-btn color="#2E8B57" @click="redirectToDompetku" block>View My Wallet Tracker</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const loggedInAccount = ref(null)
const router = useRouter()

async function fetchLoggedInAccount() {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      console.error('No token found, user is not authenticated.')
      return
    }

    const response = await axios.get('http://localhost:8081/account/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data && response.data.data) {
      loggedInAccount.value = response.data.data
    } else {
      console.error('Invalid response structure:', response.data)
    }
  } catch (error) {
    console.error('Error fetching logged-in account:', error.message)
  }
}

onMounted(async () => {
  await fetchLoggedInAccount()
})

function redirectToDompetku() {
  router.push('/dompetku')
}
</script>

<style scoped>
.v-container {
  display: flex;
  justify-content: center; 
  align-items: flex-start; 
  padding-top: 10vh; 
}

.v-card {
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  font-weight: bold;
}

.v-btn {
  border-radius: 20px;
}
</style>
