<template>
    <q-page padding>
      <dynamic-crud
        modelName="StructureAttributes"
        apiBasePath="/api/structure-attributes"
        :excludeFields="['id', 'createdAt', 'updatedAt']"
        :fieldOverrides="fieldOverrides"
        :initialValues="initialValues"
      />
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import DynamicCrud from 'components/DynamicCrud.vue';
  
  const fieldOverrides = {
    // Override field configurations if needed
    attributeValue: {
      type: 'String',
      isRequired: true,
      // Additional validations or configurations
    }
  };
  
  const initialValues = ref({
    status: 'active',
    datatype: 'TEXT'
  });
  
  // You can also fetch any additional data needed for this specific model
  onMounted(async () => {
    try {
      // Example: fetch any additional data needed for this model
      // const response = await axios.get('/api/some-endpoint');
      // Do something with the response
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  });
  </script>