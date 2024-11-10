<template>
  <v-container>
    <v-card class="mb-4" outlined>
      <v-row justify="space-between" align="center">
        <v-col cols="auto">
          <v-card-title style="color: #2E8B57;"><b>Account Management</b></v-card-title>
        </v-col>
        <v-col style="margin-left: 67%;">
          <i class="fa fa-lightbulb-o" @click="showSummary" style="margin-left: 10px; color: black; font-size: 25px; cursor: pointer;"></i>
          <i class="fa fa-plus" @click="showCreate = true" style="margin-left: 20px; color: #2E8B57; font-size: 25px; cursor: pointer;"></i>
        </v-col>
      </v-row>
    </v-card>

    <!-- Account List -->
    <v-table height="500px" fixed-header class="table table-striped" style="width: 100%; text-align: center; margin-bottom: 20px;">
      <thead>
        <tr>
          <th class="text-center font-weight-bold" >Name</th>
          <th class="text-center font-weight-bold">Balance</th>
          <th class="text-center font-weight-bold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accounts" :key="account.account_id">
          <td>{{ account.name }}</td>
          <td>{{ account.balance }}</td>
          <td>
            <i class="fa fa-pencil" @click="editAccount(account)" style="color: black; font-size: 20px; cursor: pointer;"></i>
            <i class="fa fa-trash" @click="confirmDelete(account.account_id)" style="cursor: pointer; color: red; font-size: 20px;"></i>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialogs -->
    <v-dialog v-model="showCreate" max-width="500">
      <CreateAccount @close="showCreate = false" @refresh="fetchAccounts" />
    </v-dialog>
    <v-dialog v-model="showEdit" max-width="500">
      <EditAccount :account="selectedAccount" @close="showEdit = false" @refresh="fetchAccounts" />
    </v-dialog>
    
    <!-- Summary Modal -->
    <v-dialog v-model="showSummaryDialog" max-width="500">
      <v-card><br>
        <v-card-title>
          <h3 style="color: #2E8B57;"><b>Statistic</b></h3>
        </v-card-title>
        <v-card-text>
          <div>Total Accounts: {{ totalAccounts }}</div>
          <div>Total Balance: {{ totalBalance }}</div>
          <div>Average Balance: {{ averageBalance.toFixed(2) }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showSummaryDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CreateAccount from '@/components/CreateAccount.vue'
import EditAccount from '@/components/EditAccount.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const accounts = ref([]) 
const showCreate = ref(false)
const showEdit = ref(false)
const selectedAccount = ref(null) // Store the selected account for editing
const showSummaryDialog = ref(false) 

const totalAccounts = computed(() => accounts.value.length)
const totalBalance = computed(() => accounts.value.reduce((sum, account) => sum + parseFloat(account.balance), 0))
const averageBalance = computed(() => totalAccounts.value > 0 ? totalBalance.value / totalAccounts.value : 0)

async function fetchAccounts() {
  try {
    const response = await axios.get('http://localhost:8081/account/list');
    if (response.data && response.data.data) {
      accounts.value = response.data.data; // Update the account list
    } else {
      console.error('Invalid response structure:', response.data);
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}

function editAccount(account) {
  selectedAccount.value = account
  showEdit.value = true 
}

function confirmDelete(accountId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteRecord(accountId)
    }
  })
}

async function deleteRecord(accountId) {
  if (!accountId) {
    console.error('Invalid accountId:', accountId)
    alert('Account ID is missing or invalid.')
    return
  }

  try {
    const response = await axios.delete(`http://localhost:8081/account/delete/${accountId}`)
    if (response.status === 200) {
      Swal.fire('Deleted!', 'Your account has been deleted.', 'success')
      fetchAccounts() 
    } else {
      throw new Error('Failed to delete account')
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    Swal.fire('Error', 'Failed to delete the account. Please try again.', 'error') 
  }
}

function showSummary() {
  showSummaryDialog.value = true 
}

onMounted(() => {
  fetchAccounts()
})
</script>

<style scoped>
th, td {
  text-align: center;
}
.fa-pencil {
  cursor: pointer;
  font-size: 18px;
}
.fa-trash {
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
}
</style>
