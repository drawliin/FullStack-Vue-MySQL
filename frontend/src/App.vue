<template>
  <div id="app" :class="{ 'modal-open': editingItem }">
    <div class="container">
      <h1> CRUD App</h1>
      <form @submit.prevent="createItem" class="item-form">
        <input v-model="newItem.name" placeholder="Name" required>
        <input v-model="newItem.description" placeholder="Description" required>
        <button type="submit">
          <i class="fas fa-plus"></i> Add Item
        </button>
      </form>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
      <transition-group name="list" tag="ul" class="item-list">
        <li v-for="item in items" :key="item.id" class="item">
          <div class="item-content">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <div class="item-actions">
            <button @click="startEdit(item)" class="edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteItem(item.id)" class="delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </li>
      </transition-group>
    </div>

    <div v-if="editingItem" class="modal">
      <div class="modal-content">
        <h2>Edit Item</h2>
        <form @submit.prevent="updateItem">
          <input v-model="editingItem.name" placeholder="Name" required>
          <input v-model="editingItem.description" placeholder="Description" required>
          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="cancel">Cancel</button>
            <button type="submit" class="save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const port = import.meta.env.VITE_PORT

const API_URL = 'http://localhost:${port}/api';

export default {
  data() {
    return {
      items: [],
      newItem: {
        name: '',
        description: '',
      },
      editingItem: null,
      loading: false,
    };
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/items`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        this.loading = false;
      }
    },
    async createItem() {
      try {
        await axios.post(`${API_URL}/items`, this.newItem);
        this.newItem = { name: '', description: '' };
        this.fetchItems();
      } catch (error) {
        console.error('Error creating item:', error);
      }
    },
    startEdit(item) {
      this.editingItem = { ...item };
    },
    cancelEdit() {
      this.editingItem = null;
    },
    async updateItem() {
      try {
        await axios.put(`${API_URL}/items/${this.editingItem.id}`, {
          name: this.editingItem.name,
          description: this.editingItem.description,
        });
        this.editingItem = null;
        this.fetchItems();
      } catch (error) {
        console.error('Error updating item:', error);
      }
    },
    async deleteItem(id) {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await axios.delete(`${API_URL}/items/${id}`);
          this.fetchItems();
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --background-color: #f0f3f5;
  --text-color: #34495e;
  --danger-color: #e74c3c;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.item-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color:hsla(204, 69.90%, 53.10%, 0.70);
}

.item-list {
  list-style-type: none;
}

.item {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-content h3 {
  margin-bottom: 0.5rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.edit {
  background-color: var(--secondary-color);
}

.delete {
  background-color: var(--danger-color);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel {
  background-color: #95a5a6;
}

.save {
  background-color: var(--secondary-color);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.modal-open {
  overflow: hidden;
}
</style>