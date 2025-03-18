<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Structuri</div>
    <model-crud-table
      v-if="modelMetadata"
      :model-metadata="modelMetadata"
      :base-url="'http://localhost:3334/structure'"
    />
    <div v-else-if="error" class="text-negative">
      {{ error }}
    </div>
    <div v-else class="text-center">
      <q-spinner-dots size="40px" color="primary" />
      <div class="q-mt-sm">Loading model metadata...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ModelCrudTable from 'components/ModelCrudTable.vue'

interface ModelField {
  name: string;
  type: string;
  isRequired: boolean;
  isUnique: boolean;
  isId: boolean;
  default: string | null;
  extra: string;
}

interface ModelMetadata {
  name: string;
  fields: ModelField[];
}

const modelMetadata = ref<ModelMetadata | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3334/features/models/Structure')
    modelMetadata.value = response.data
  } catch (err: any) {
    error.value = err.message
    console.error('Error fetching model metadata:', err)
  }
})
</script>


