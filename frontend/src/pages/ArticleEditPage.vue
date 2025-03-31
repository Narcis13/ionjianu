<template>
    <q-page padding>
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        :to="isEditMode ? { name: 'ArticleView', params: { id: articleId } } : { name: 'ArticleList' }"
        class="q-mb-md"
        aria-label="Back"
      />
  
      <h1 class="text-h4 q-mb-lg">{{ isEditMode ? 'Edit Article' : 'Create New Article' }}</h1>
  
      <q-spinner v-if="isLoading" size="lg" color="primary" class="q-mt-xl block" />
  
      <q-banner v-else-if="errorLoading" class="bg-negative text-white q-mt-md">
        {{ errorLoading }}
      </q-banner>
  
      <q-form v-else @submit.prevent="saveArticle" class="q-gutter-md">
        <q-input
          filled
          v-model="article.title"
          label="Title *"
          lazy-rules
          :rules="[val => !!val || 'Title is required']"
        />
  
        <q-input
          filled
          v-model="article.category"
          label="Category *"
          lazy-rules
          :rules="[val => !!val || 'Category is required']"
        />
  
        <div class="q-mt-xl">
          <h2 class="text-h6 q-mb-md">Content Items</h2>
  
          <q-card
            v-for="(item, index) in article.content"
            :key="index"
            class="q-mb-md"
            bordered
            flat
          >
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle2 text-grey-7">
                  Item #{{ index + 1 }}: {{ item.type.charAt(0).toUpperCase() + item.type.slice(1) }}
                </div>
                <div>
                  <q-btn
                    flat dense round icon="arrow_upward"
                    @click="moveContentItem(index, -1)"
                    :disable="index === 0"
                    aria-label="Move item up"
                    class="q-mr-xs"
                  />
                  <q-btn
                    flat dense round icon="arrow_downward"
                    @click="moveContentItem(index, 1)"
                    :disable="index === (article.content?.length ?? 0) - 1"
                    aria-label="Move item down"
                     class="q-mr-xs"
                  />
                  <q-btn
                    flat dense round icon="delete" color="negative"
                    @click="removeContentItem(index)"
                    aria-label="Remove item"
                  />
                </div>
              </div>
  
              <!-- Paragraph Editor -->
              <div v-if="item.type === 'PARAGRAPH'">
                <q-editor
                  v-model="item.html"
                  min-height="5rem"
                  :toolbar="[
                    ['bold', 'italic', 'strike', 'underline'],
                    ['link'],
                    ['unordered', 'ordered'],
                    ['viewsource']
                  ]"
                  placeholder="Enter paragraph content..."
                />
              </div>
  
              <!-- File Editor -->
              <div v-else-if="item.type === 'FILE'" class="q-gutter-sm q-mt-sm">
                 <q-input
                    filled dense
                    v-model="item.name"
                    label="Link Text *"
                    lazy-rules
                    :rules="[val => !!val || 'Link text is required']"
                 />
                 <q-input
                    filled dense
                    v-model="item.url"
                    label="File URL *"
                    type="url"
                    lazy-rules
                    :rules="[
                      val => !!val || 'File URL is required',
                      val => /^https?:\/\/.+/.test(val) || 'Must be a valid URL (http/https)'
                      ]"
                  />
              </div>
  
              <!-- Image Editor -->
              <div v-else-if="item.type === 'IMAGE'" class="q-gutter-sm q-mt-sm">
                 <q-input
                    filled dense
                    v-model="item.src"
                    label="Image URL *"
                    type="url"
                    lazy-rules
                    :rules="[
                      val => !!val || 'Image URL is required',
                      val => /^https?:\/\/.+/.test(val) || 'Must be a valid URL (http/https)'
                      ]"
                  />
                  <q-input
                    filled dense
                    v-model="item.alt"
                    label="Alt Text *"
                    lazy-rules
                    :rules="[val => !!val || 'Alt text is required for accessibility']"
                 />
                 <img
                   v-if="item.src"
                   :src="item.src"
                   :alt="item.alt || 'Image Preview'"
                   class="q-mt-sm"
                   style="max-width: 200px; max-height: 150px; display: block; border: 1px solid #ccc;"
                  />
              </div>
            </q-card-section>
          </q-card>
  
          <q-banner v-if="!article.content || article.content.length === 0" class="bg-grey-2 q-mb-md">
            No content items added yet. Use the buttons below to add content.
          </q-banner>
  
          <div class="q-mt-md q-gutter-sm">
            <q-btn outline color="primary" icon="notes" label="Add Paragraph" @click="addContentItem('PARAGRAPH')" />
            <q-btn outline color="primary" icon="attachment" label="Add File Link" @click="addContentItem('FILE')" />
            <q-btn outline color="primary" icon="image" label="Add Image" @click="addContentItem('IMAGE')" />
          </div>
        </div>
  
        <q-separator class="q-my-lg" />
  
        <div>
          <q-btn label="Save Article" type="submit" color="primary" :loading="isSaving" />
          <q-btn
            label="Cancel"
            type="button"
            color="grey"
            flat
            class="q-ml-sm"
            :to="isEditMode ? { name: 'ArticleView', params: { id: articleId } } : { name: 'ArticleList' }"
          />
        </div>
      </q-form>
  
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar, QForm } from 'quasar';
  import { ArticleService } from 'src/services/ArticleService';
  import { ArticleInput, ContentItem, ParagraphItem, FileItem, ImageItem } from 'src/types/models';
  
  interface Props {
    id?: string | number; // Optional prop for edit mode
  }
  const props = defineProps<Props>();
  
  const $q = useQuasar();
  const router = useRouter();
  
  // Use reactive for the form object
  const article = reactive<ArticleInput>({
    title: '',
    category: '',
    content: [],
  });
  
  const isLoading = ref(false);
  const isSaving = ref(false);
  const errorLoading = ref<string | null>(null);
  
  const articleId = computed(() => props.id ? Number(props.id) : null);
  const isEditMode = computed(() => articleId.value !== null && !isNaN(articleId.value));
  
  const fetchArticleForEdit = async () => {
    if (!isEditMode.value || articleId.value === null) return;
  
    isLoading.value = true;
    errorLoading.value = null;
    try {
      const fetchedArticle = await ArticleService.getArticleById(articleId.value);
      // Use Object.assign or spread to update the reactive object properties
      Object.assign(article, fetchedArticle);
      // Ensure content is always an array
       if (!article.content) {
        article.content = [];
      }
    } catch (error) {
      console.error(`Failed to fetch article ${articleId.value} for editing:`, error);
      errorLoading.value = 'Could not load the article data for editing.';
       $q.notify({ color: 'negative', message: errorLoading.value });
       // Optionally redirect back if loading failed critically
       // router.push({ name: 'ArticleList' });
    } finally {
      isLoading.value = false;
    }
  };
  
  const addContentItem = (type: ContentItem['type']) => {
    let newItem: ContentItem;
    switch (type) {
      case 'PARAGRAPH':
        newItem = { type: 'PARAGRAPH', html: '' };
        break;
      case 'FILE':
        newItem = { type: 'FILE', url: '', name: '' };
        break;
      case 'IMAGE':
        newItem = { type: 'IMAGE', src: '', alt: '' };
        break;
      default:
        // Should not happen with defined types
        console.error('Unknown content type:', type);
        return;
    }
     if (!article.content) {
      article.content = []; // Initialize if null/undefined
     }
    article.content.push(newItem);
  };
  
  const removeContentItem = (index: number) => {
    if (article.content) {
      article.content.splice(index, 1);
    }
  };
  
  const moveContentItem = (index: number, direction: number) => {
    if (!article.content) return;
  
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= article.content.length) {
      return; // Out of bounds
    }
  
    // Simple swap
    const itemToMove = article.content[index];
    article.content[index] = article.content[newIndex];
    article.content[newIndex] = itemToMove;
  
    // Alternative using splice for clarity
    // const [item] = article.content.splice(index, 1);
    // article.content.splice(newIndex, 0, item);
  };
  
  const saveArticle = async () => {
    isSaving.value = true;
    // QForm handles validation triggering on submit, but manual check can be added
    if (!article.title || !article.category) {
        $q.notify({ color: 'warning', message: 'Please fill in Title and Category.' });
        isSaving.value = false;
        return;
    }
  
    try {
      let savedArticle;
      // Create a deep copy of content items, remove 'id' and 'articleId' properties,
      // and ensure each item has a unique 'order' value
      const contentWithoutIds = article.content ? article.content.map((item, index) => {
        const { id, articleId, ...itemWithoutIds } = item as any;
        // Add explicit order property based on index
        return {
          ...itemWithoutIds,
          order: index // Ensure unique order values
        };
      }) : [];

      const payload: ArticleInput = {
        title: article.title,
        category: article.category,
        content: contentWithoutIds
      };
  
      if (isEditMode.value && articleId.value) {
        savedArticle = await ArticleService.updateArticle(articleId.value, payload);
        $q.notify({ color: 'positive', message: 'Article updated successfully!' });
        router.push({ name: 'ArticleView', params: { id: savedArticle.id } });
      } else {
        savedArticle = await ArticleService.createArticle(payload);
        $q.notify({ color: 'positive', message: 'Article created successfully!' });
        router.push({ name: 'ArticleView', params: { id: savedArticle.id } });
      }
  
    } catch (error) {
      console.error('Failed to save article:', error);
      $q.notify({
        color: 'negative',
        message: `Failed to save article. ${ (error as Error).message || 'Please try again.'}`
      });
    } finally {
      isSaving.value = false;
    }
  };
  
  onMounted(() => {
     if (isEditMode.value) {
      fetchArticleForEdit();
    } else {
       // Reset for 'new' mode (though reactive default covers this)
       Object.assign(article, { title: '', category: '', content: [] });
     }
  });
  
  </script>
  
  <style scoped>
  .text-h4 {
    margin-top: 0;
  }
  /* Add specific styles if needed */
  </style>