// seriesConfig.js
import SeriesEditForm from "@/components/forms/SeriesEditForm";
import SeriesForm from "@/components/forms/SeriesForm";
import { ANIMATION_VARIANTS } from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const seriesLabels = {
  // Page labels
  page: {
    title: { en: 'Series', cn: '系列' },
    subtitle: { en: 'Series Information', cn: '系列信息' },
    description: { en: 'Manage series entries', cn: '管理系列条目' },
  },

  // Field labels — one entry per editable Prisma field
  fields: {
    artist: { en: 'Artist', cn: '艺术家' },
    title: { en: 'Title', cn: '标题' },
    type: { en: 'Type', cn: '类型' },
    medium: { en: 'Medium', cn: '媒介' },
    year: { en: 'Year', cn: '年份' },
    caption: { en: 'Caption', cn: '说明' },
    credits: { en: 'Credits', cn: '鸣谢' },
    special_thanks: { en: 'Special Thanks', cn: '特别感谢' },
    cover_img_url: { en: 'Cover Image URL', cn: '封面图片链接' },
    introduction: { en: 'Introduction', cn: '引言' },
    order: { en: 'Order', cn: '排序' },
    language: { en: 'Language', cn: '语言' },
    mark: { en: 'Mark', cn: '标记' },
  },

  // UI Text
  UI_TEXT: {
    seriesManagement: { en: 'Series Management', cn: '系列管理' },
    create: { en: 'Create New', cn: '创建新项' },
    edit: { en: 'Edit', cn: '编辑' },
    delete: { en: 'Delete', cn: '删除' },
    save: { en: 'Save', cn: '保存' },
    cancel: { en: 'Cancel', cn: '取消' },
    confirmDelete: { en: 'Confirm Delete', cn: '确认删除' },
    noData: { en: 'No data available', cn: '暂无数据' },
  },
};

// Helper function to get labels
export const getSeriesLabel = (key, language = 'en') => {
  if (seriesLabels.fields[key]) {
    return seriesLabels.fields[key][language] || seriesLabels.fields[key]['en'];
  }
  if (seriesLabels.UI_TEXT[key]) {
    return seriesLabels.UI_TEXT[key][language] || seriesLabels.UI_TEXT[key]['en'];
  }
  if (seriesLabels.page[key]) {
    return seriesLabels.page[key][language] || seriesLabels.page[key]['en'];
  }
  return key;
};

// ============================================================
// FIELD GROUPS CONFIGURATION
// ============================================================
export const getFieldGroupsSeries = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: isCn ? '基本信息' : 'Basic Information',
      fields: [
        { key: "artist" },
        { key: "title" },
        { key: "type" },
        { key: "medium" },
        { key: "year" },
        { key: "language" },
      ]
    },
    CONTENT: {
      title: isCn ? '内容' : 'Content',
      fields: [
        { key: "caption" },
      ]
    },
    CREDITS: {
      title: isCn ? '鸣谢' : 'Credits',
      fields: [
        { key: "credits" },
        { key: "special_thanks" },
      ]
    },
    META: {
      title: isCn ? '元数据' : 'Metadata',
      fields: [
        { key: "order" },
        { key: "mark" },
      ]
    }
  };

  return getFieldGroupsWithLabels('series', fieldGroups, isCn);
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const seriesConfig = {
  // Schema identifier
  itemUrl: "series",
  schemaName: "Series",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/series',
      create: '/api/series',
      update: (id) => `/api/series/${id}`,
      delete: (id) => `/api/series/${id}`,
      list: '/api/series',
      detail: (id) => `/api/series/${id}`,
    },
    methods: {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE',
      list: 'GET',
      detail: 'GET',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    config: {
      enablePagination: true,
      enableSearch: true,
      enableSorting: true,
      defaultSortField: 'order',
      defaultSortOrder: -1,
      collectionName: 'Series',
    },
  },

  // Page Configuration
  page: {
    title: seriesLabels.page.title,
    subtitle: seriesLabels.page.subtitle,
    description: seriesLabels.page.description,
    animationVariants: ANIMATION_VARIANTS?.container || {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delayChildren: 0.15,
          staggerChildren: 0.08,
        },
      },
    },
  },

  // Field Configuration
  fields: {
    searchableFields: ['artist', 'title', 'type', 'medium', 'year', 'language', 'mark'],
    sortableFields: ['order', 'year', 'title', 'language'],
    filterableFields: ['type', 'language'],
    mainFields: ['title', 'artist', 'year'],
    expandedFields: ['type', 'medium', 'cover_img_url'],
    arrayFields: ['introduction'],
    validFields: [
      'id', 'cover_img_url', 'artist', 'title', 'type', 'medium',
      'year', 'caption', 'credits', 'special_thanks', 'introduction',
      'order', 'language', 'mark'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: SeriesForm,
    editFormComponent: SeriesEditForm,
  },

  // Labels Configuration
  labels: seriesLabels,

  // Language Options (if needed)
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

// Export default
export default seriesConfig;
