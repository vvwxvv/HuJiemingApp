import { createComprehensiveResumeExport } from "@/components/pages/manager/utils/resumeExportUtils";
import { getSystemLabel, createBasePageText } from "@/components/labels/system_labels";
import { ArrowUpDown } from 'lucide-react';
import { sortAlphabetically } from '@/utils/sortUtils';
import { ORIGINAL_SIZE_PRESET } from "@/components/pages/manager/constants/cardDisplayPresets";

// ===================== 字段定义 =====================
export const getResumeFields = (lang = 'EN') => [
  { key: 'artist', label: 'Artist / 艺术家' },
  { key: 'year', label: 'Year / 年份' },
  { key: 'start_date', label: 'Start Date / 开始日期' },
  { key: 'end_date', label: 'End Date / 结束日期' },
  { key: 'type', label: 'Type / 类型' },
  { key: 'description', label: 'Description / 描述' },
  { key: 'introduction', label: 'Introduction / 引言', isArray: true },
  { key: 'language', label: 'Language / 语言' },
  { key: 'updatedAt', label: 'Updated At / 更新时间' },
];

export const getDeleteDialogFields = (lang = 'EN') => [
  { key: 'artist', label: 'Artist:' },
  { key: 'type', label: 'Type:' },
  { key: 'year', label: 'Year:' },
  { key: 'start_date', label: 'Start Date:' },
  { key: 'end_date', label: 'End Date:' },
];

export const RESUME_SORT_FIELDS = ['artist', 'year'];
export const RESUME_SEARCH_FIELDS = ['artist', 'type', 'year', 'description'];

export const getEmptyResume = () => ({
  artist: '',
  year: '',
  start_date: '',
  end_date: '',
  type: '',
  description: '',
  introduction: [],
  language: '',
  updatedAt: '',
});

// ===================== 常量 =====================
export const COMPONENT_CONFIG = {
  DEBOUNCE_DELAY: 300,
  FUZZY_SEARCH_THRESHOLD: 3,
  MIN_MATCH_CHAR_LENGTH: 1,
  SESSION_STORAGE_PREFIX: 'resume_edit_',
  SUMMARY_FIELD_COUNT: 4,
};

export const FILTER_VALUES = { ALL: 'all' };
export const VIEW_MODES = { GRID: 'grid', LIST: 'list' };

export const FIELD_DISPLAY_CONFIG = {
  summaryFields: ['artist', 'type', 'year'],
  detailFields: [
    'start_date',
    'end_date',
    'description',
    'introduction',
    'language',
    'updatedAt',
  ],
};

// ===================== 标签与国际化 =====================
// 为 Resume 定义专有标签（可扩展）
const resumeLabels = {
  UI_TEXT: {
    // 如有需要可添加特定UI文本
  },
  PAGE_TEXT: {
    createTooltip: { EN: 'Create Resume', CN: '创建履历' },
    export: {
      artworks: { EN: 'Resume', CN: '履历' },
      title: { EN: 'Export Resume', CN: '导出履历' },
      button: { EN: 'Export Data', CN: '导出数据' },
    },
    emptyState: {
      noData: { EN: 'No resume items found', CN: '未找到履历' },
      noMatchingItems: { EN: 'No matching resume items', CN: '没有匹配的履历' },
    },
    errors: {
      loadError: { EN: 'Failed to load resume', CN: '加载履历失败' },
      saveError: { EN: 'Failed to save resume', CN: '保存履历失败' },
      deleteError: { EN: 'Failed to delete resume', CN: '删除履历失败' },
    },
    deleteDialog: {
      title: { EN: 'Delete Resume', CN: '删除履历' },
      confirm: { EN: 'Are you sure you want to delete this item?', CN: '确定要删除此履历吗？' },
    },
  },
};

const getResumeLabel = (key, lang) => {
  // 简单实现，可从标签映射中查找
  const fieldMap = {
    artist: { EN: 'Artist', CN: '艺术家' },
    year: { EN: 'Year', CN: '年份' },
    start_date: { EN: 'Start Date', CN: '开始日期' },
    end_date: { EN: 'End Date', CN: '结束日期' },
    type: { EN: 'Type', CN: '类型' },
    description: { EN: 'Description', CN: '描述' },
    introduction: { EN: 'Introduction', CN: '引言' },
    language: { EN: 'Language', CN: '语言' },
    mark: { EN: 'Mark', CN: '标记' },
    updatedAt: { EN: 'Updated At', CN: '更新时间' },
  };
  if (fieldMap[key]) return fieldMap[key][lang === 'CN' ? 'CN' : 'EN'];
  return getSystemLabel(key, lang === 'CN') ?? key;
};

// ===================== 主配置 =====================
export const resumeSchemaConfig = {
  title: "Resume",
  schemaName: "resume",

  api: {
    endpoint: "/api/resume",
    deleteEndpoint: "/api/resume",
    listEndpoint: "/api/resume/list",
  },

  navigation: {
    createPath: "/manager/resume/create",
    editPathTemplate: "/manager/resume/{id}/edit",
  },

  dataConfig: {
    titleField: "artist",
    descriptionField: "description",
    imageField: null,   // Resume 无图片字段

    // 语言过滤沿用 Bibliography：留空
    alphabetFilterField: "artist",
    languageField: null, // 不启用语言过滤

    getFields: (lang) => getResumeFields(lang),
    getDeleteDialogFields: (lang) => getDeleteDialogFields(lang),
    getEmptyItem: () => getEmptyResume(),

    sortFields: RESUME_SORT_FIELDS,
    searchFields: RESUME_SEARCH_FIELDS,
    fieldDisplayConfig: FIELD_DISPLAY_CONFIG,

    customSearch: (item, searchTerm, isCn) => {
      // 无语言过滤，直接搜索指定字段
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase().trim();
      const searchableFields = [
        item.artist,
        item.type,
        item.year,
        item.description,
      ];
      return searchableFields.some(
        (field) => field && String(field).toLowerCase().includes(term)
      );
    },
  },

  filterConfig: {
    values: FILTER_VALUES,
    filterFields: [
      { key: "type", fields: ["type"] },
      { key: "artist", fields: ["artist"] },
      { key: "year", fields: ["year"] },
    ],
    createControlPanelConfig: () => createResumeControlPanelConfig(),
  },

  exportConfig: {
    // 可替换为专用的 Resume 导出函数
    formatter: (data, isCn) => createComprehensiveResumeExport(data, isCn),
    filename: { EN: "resume_export_en", CN: "resume_export_cn" },
  },

  uiConfig: {
    defaultViewMode: VIEW_MODES.GRID,
    viewModes: VIEW_MODES,
    isArtistweb: false,
    debounceDelay: COMPONENT_CONFIG.DEBOUNCE_DELAY,
    ...ORIGINAL_SIZE_PRESET,
  },

  labels: {
    itemName: { EN: "Resume", CN: "履历" },
    pageText: createBasePageText({
      createTooltip: resumeLabels.PAGE_TEXT.createTooltip,
      export: {
        ...resumeLabels.PAGE_TEXT.export,
        items: resumeLabels.PAGE_TEXT.export.artworks,
      },
      emptyState: {
        noData: resumeLabels.PAGE_TEXT.emptyState.noData,
        noMatchingItems: resumeLabels.PAGE_TEXT.emptyState.noMatchingItems,
      },
      errors: resumeLabels.PAGE_TEXT.errors,
      deleteDialog: resumeLabels.PAGE_TEXT.deleteDialog,
    }),
    getLabel: (key, lang) => {
      const fromResume = getResumeLabel(key, lang);
      if (fromResume !== key) return fromResume;
      if (resumeLabels.UI_TEXT?.[key]) return resumeLabels.UI_TEXT[key][lang];
      return getSystemLabel(key, lang === "CN") ?? key;
    },
  },

  components: {
    actionButtons: [
      {
        labelKey: 'batch_edit',
        route: '/manager/resume/batch_edit',
      },
      {
        labelKey: 'exportData',
        action: 'export',
      },
    ],

    searchConfig: {
      placeholder: {
        EN: 'Search artist, type, year, description...',
        CN: '搜索艺术家、类型、年份、描述...',
      },
      ariaLabel: {
        EN: 'Search resume',
        CN: '搜索履历',
      },

      selectConfig: {
        filterKey: 'artist',
        placeholder: {
          EN: 'All Artists',
          CN: '全部艺术家',
        },
        ariaLabel: {
          EN: 'Select artist',
          CN: '选择艺术家',
        },
        allLabel: {
          EN: 'All Artists',
          CN: '全部艺术家',
        },
      },
    },
  },
};

// ===================== 控制面板配置 =====================
export const createResumeControlPanelConfig = () => ({
  filters: [
    {
      field: 'type',
      label: { cn: '类型', en: 'Type' },
      sortFunction: sortAlphabetically,
    },
    {
      field: 'artist',
      label: { cn: '艺术家', en: 'Artist' },
      sortFunction: sortAlphabetically,
    },
    {
      field: 'year',
      label: { cn: '年份', en: 'Year' },
      sortFunction: (a, b) => Number(b) - Number(a),
    },
  ],
  controls: [
    {
      type: 'toggle',
      label: { cn: '艺术家排序', en: 'Sort by Artist' },
      icon: <ArrowUpDown size={20} />,
      action: 'sortByField',
      sortField: 'artist',
      tooltip: { cn: '按艺术家排序', en: 'Sort by Artist' },
      activeColor: 'red',
      inactiveColor: 'var(--text-primary, #000000)',
    },
    {
      type: 'toggle',
      label: { cn: '年份排序', en: 'Sort by Year' },
      icon: <ArrowUpDown size={20} />,
      action: 'sortByField',
      sortField: 'year',
      tooltip: { cn: '按年份排序', en: 'Sort by Year' },
      activeColor: 'red',
      inactiveColor: 'var(--text-primary, #000000)',
    },
  ],
});

// ===================== 导出默认 =====================
export default resumeSchemaConfig;
