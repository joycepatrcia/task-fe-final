<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            <center><b>My Wallet Tracker</b></center>
          </v-card-title><br>

          <v-form>
            <v-select
              label="Category"
              :items="categories"
              v-model="newRecord.category"
              outlined
              dense
              required
            ></v-select>

            <v-text-field
              label="Amount"
              v-model="newRecord.amount"
              placeholder="Enter amount"
              outlined
              dense
              type="number"
              required
            ></v-text-field>

            <v-radio-group
              v-model="newRecord.type"
              row
              required
              label="Type"
            >
              <v-radio label="Income" value="income"></v-radio>
              <v-radio label="Expense" value="expense"></v-radio>
            </v-radio-group>

            <v-text-field
              label="Description"
              v-model="newRecord.description"
              placeholder="Enter description (optional)"
              outlined
              dense
            ></v-text-field>

            <v-row style="margin: 2%;">
              <v-col class="text-right" cols="12">
                <v-btn color="#2E8B57" @click="addRecord">Submit</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" md="6">
        <v-card><br>
          <v-card-subtitle>Transaction List</v-card-subtitle>
          
          <table class="table table-striped" style="width: 100%; text-align: center;">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Desc</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in records" :key="index">
                <td>{{ record.category }}</td>
                <td>{{ formatAmount(record.amount) }}</td>
                <td>{{ record.type === 'income' ? 'Income' : 'Expense' }}</td>
                <td>{{ record.description }}</td>
                <td>
                  <i class="fa fa-trash" @click="deleteRecord(index)" style="cursor: pointer; color: red;"></i>
                </td>
              </tr>
            </tbody>
          </table>
          <v-btn color="red" block @click="confirmClearAll">Clear All Transactions</v-btn>

          <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title>Clear All Transactions</v-card-title>
              <v-card-text>Are you sure want to delete all transactions?</v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
                <v-btn color="red darken-1" text @click="clearAllRecords">Yes, Clear All</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-divider class="my-4"></v-divider>
          <v-card-subtitle>Summary</v-card-subtitle>
          <v-list-item>
            <v-list-item-content>My Transaction Entries: {{ records.length }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>My Income: {{ formatAmount(totalIncome) }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>My Expense: {{ formatAmount(totalExpense) }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>My Balance: {{ formatAmount(balance) }}</v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      newRecord: {
        description: "",
        amount: null,
        category: "",
        type: "income",
      },
      categories: ["Food", "Transport", "Utilities", "Shopping", "Insurance", "Pay Debt", "Entertainment", "Others"],
      records: JSON.parse(localStorage.getItem("financialRecords") || "[]"),
      dialog: false,
    };
  },
  computed: {
    totalIncome() {
      return this.records
        .filter((record) => record.type === "income")
        .reduce((sum, record) => sum + record.amount, 0);
    },
    totalExpense() {
      return this.records
        .filter((record) => record.type === "expense")
        .reduce((sum, record) => sum + record.amount, 0);
    },
    balance() {
      return this.totalIncome - this.totalExpense;
    },
  },
  methods: {
    addRecord() {
      if (
        this.newRecord.amount &&
        this.newRecord.category
      ) {
        this.records.push({ ...this.newRecord });
        this.saveRecords();
        this.resetForm();
      }
    },
    deleteRecord(index) {
      this.records.splice(index, 1);
      this.saveRecords();
    },
    clearAllRecords() {
      this.records = [];
      this.saveRecords();
      this.dialog = false;
    },
    confirmClearAll() {
      this.dialog = true;
    },
    saveRecords() {
      localStorage.setItem("financialRecords", JSON.stringify(this.records));
    },
    resetForm() {
      this.newRecord.description = "";
      this.newRecord.amount = null;
      this.newRecord.category = "";
      this.newRecord.type = "income";
    },
    formatAmount(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
    },
  },
};
</script>

<style scoped>
.v-container {
  padding: 20px;
}

.v-card {
  margin-bottom: 20px;
}

.v-btn {
  margin-top: 10px;
}

table {
  width: 100%;
  text-align: center;
}

table th, table td {
  padding: 10px;
  text-align: center;
}

.description-row {
  font-size: 12px;
  color: #888;
  padding-top: 5px;
  text-align: left;
}

</style>