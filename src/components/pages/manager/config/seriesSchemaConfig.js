import { createComprehensiveSeriesExport } from "@/components/pages/manager/utils/seriesExportUtils";
import { getSystemLabel, createBasePageText } from "@/components/labels/system_labels";
import { ArrowUpDown } from 'lucide-react';
import { sortAlphabetically } from '@/utils/sortUtils';
import { ORIGINAL_SIZE_PRESET } from "@/components/pages/manager/constants/cardDisplayPresets";

// ===================== 字段定义 =====================
export const getSeriesFields = (lang = 'EN') => [
  { key: 'cover_img_url', label: 'Cover Image' },
  { key: 'artist', label: 'Artist / 艺术家' },
  { key: 'title', label: 'Title / 标题' },
  { key: 'type', label: 'Type / 类型' },
  { key: 'medium', label: 'Medium / 媒介' },
  { key: 'year', label: 'Year / 年份' },
  { key: 'caption', label: 'Caption / 说明' },
  { key: 'credits', label: 'Credits / 鸣谢' },
  { key: 'special_thanks', label: 'Special Thanks / 特别感谢' },
  { key: 'introduction', label: 'Introduction / 引言', isArray: true },
  { key: 'order', label: 'Order / 顺序' },
  { key: 'language', label: 'Language / 语言' },
  { key: 'updatedAt', label: 'Updated At / 更新时间' },
];

export const getDeleteDialogFields = (lang = 'EN') => [
  { key: 'title', label: 'Title:' },
  { key: 'artist', label: 'Artist:' },
  { key: 'type', label: 'Type:' },
  { key: 'medium', label: 'Medium:' },
  { key: 'year', label: 'Year:' },
];

export const SERIES_SORT_FIELDS = ['title', 'order'];
export const SERIES_SEARCH_FIELDS = ['title', 'artist', 'type', 'medium', 'year'];

export const getEmptySeries = () => ({
  cover_img_url: '',
  artist: '',
  title: '',
  type: '',
  medium: '',
  year: '',
  caption: '',
  credits: '',
  special_thanks: '',
  introduction: [],
  order: '',
  language: '',
  updatedAt: '',
});

// ===================== 常量 =====================
export const COMPONENT_CONFIG = {
  DEBOUNCE_DELAY: 300,
  FUZZY_SEARCH_THRESHOLD: 3,
  MIN_MATCH_CHAR_LENGTH: 1,
  SESSION_STORAGE_PREFIX: 'series_edit_',
  SUMMARY_FIELD_COUNT: 4,
};

export const FILTER_VALUES = { ALL: 'all' };
export const VIEW_MODES = { GRID: 'grid', LIST: 'list' };

export const FIELD_DISPLAY_CONFIG = {
  summaryFields: ['title', 'artist', 'type', 'medium', 'year'],
  detailFields: [
    'cover_img_url',
    'caption',
    'credits',
    'special_thanks',
    'introduction',
    'order',
    'language',
    'updatedAt',
  ],
};

// ===================== 标签与国际化 =====================
// 为 Series 定义专有标签（可扩展）
const seriesLabels = {
  UI_TEXT: {
    // 如有需要可添加特定UI文本
  },
  PAGE_TEXT: {
    createTooltip: { EN: 'Create Series', CN: '创建系列' },
    export: {
      artworks: { EN: 'Series', CN: '系列' },
      title: { EN: 'Export Series', CN: '导出系列' },
      button: { EN: 'Export Data', CN: '导出数据' },
    },
    emptyState: {
      noData: { EN: 'No series items found', CN: '未找到系列' },
      noMatchingItems: { EN: 'No matching series items', CN: '没有匹配的系列' },
    },
    errors: {
      loadError: { EN: 'Failed to load series', CN: '加载系列失败' },
      saveError: { EN: 'Failed to save series', CN: '保存系列失败' },
      deleteError: { EN: 'Failed to delete series', CN: '删除系列失败' },
    },
    deleteDialog: {
      title: { EN: 'Delete Series', CN: '删除系列' },
      confirm: { EN: 'Are you sure you want to delete this item?', CN: '确定要删除此系列吗？' },
    },
  },
};

const getSeriesLabel = (key, lang) => {
  // 简单实现，可从标签映射中查找
  const fieldMap = {
    cover_img_url: { EN: 'Cover Image', CN: '封面图片' },
    artist: { EN: 'Artist', CN: '艺术家' },
    title: { EN: 'Title', CN: '标题' },
    type: { EN: 'Type', CN: '类型' },
    medium: { EN: 'Medium', CN: '媒介' },
    year: { EN: 'Year', CN: '年份' },
    caption: { EN: 'Caption', CN: '说明' },
    credits: { EN: 'Credits', CN: '鸣谢' },
    special_thanks: { EN: 'Special Thanks', CN: '特别感谢' },
    introduction: { EN: 'Introduction', CN: '引言' },
    order: { EN: 'Order', CN: '顺序' },
    language: { EN: 'Language', CN: '语言' },
    updatedAt: { EN: 'Updated At', CN: '更新时间' },
  };
  if (fieldMap[key]) return fieldMap[key][lang === 'CN' ? 'CN' : 'EN'];
  return getSystemLabel(key, lang === 'CN') ?? key;
};

// ===================== 主配置 =====================
export const seriesSchemaConfig = {
  title: "Series",
  schemaName: "series",

  api: {
    endpoint: "/api/series",
    deleteEndpoint: "/api/series",
    listEndpoint: "/api/series/list",
  },

  navigation: {
    createPath: "/manager/series/create",
    editPathTemplate: "/manager/series/{id}/edit",
  },

  dataConfig: {
    titleField: "title",
    descriptionField: "artist",
    imageField: "cover_img_url",

    // 语言过滤沿用 Bibliography：留空
    alphabetFilterField: "title",
    languageField: null, // 不启用语言过滤

    getFields: (lang) => getSeriesFields(lang),
    getDeleteDialogFields: (lang) => getDeleteDialogFields(lang),
    getEmptyItem: () => getEmptySeries(),

    sortFields: SERIES_SORT_FIELDS,
    searchFields: SERIES_SEARCH_FIELDS,
    fieldDisplayConfig: FIELD_DISPLAY_CONFIG,

    customSearch: (item, searchTerm, isCn) => {
      // 无语言过滤，直接搜索指定字段
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase().trim();
      const searchableFields = [
        item.title,
        item.artist,
        item.type,
        item.medium,
        item.year,
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
    createControlPanelConfig: () => createSeriesControlPanelConfig(),
  },

  exportConfig: {
    // 可替换为专用的 Series 导出函数
    formatter: (data, isCn) => createComprehensiveSeriesExport(data, isCn),
    filename: { EN: "series_export_en", CN: "series_export_cn" },
  },

  uiConfig: {
    defaultViewMode: VIEW_MODES.GRID,
    viewModes: VIEW_MODES,
    isArtistweb: false,
    debounceDelay: COMPONENT_CONFIG.DEBOUNCE_DELAY,
    ...ORIGINAL_SIZE_PRESET,
  },

  labels: {
    itemName: { EN: "Series", CN: "系列" },
    pageText: createBasePageText({
      createTooltip: seriesLabels.PAGE_TEXT.createTooltip,
      export: {
        ...seriesLabels.PAGE_TEXT.export,
        items: seriesLabels.PAGE_TEXT.export.artworks,
      },
      emptyState: {
        noData: seriesLabels.PAGE_TEXT.emptyState.noData,
        noMatchingItems: seriesLabels.PAGE_TEXT.emptyState.noMatchingItems,
      },
      errors: seriesLabels.PAGE_TEXT.errors,
      deleteDialog: seriesLabels.PAGE_TEXT.deleteDialog,
    }),
    getLabel: (key, lang) => {
      const fromSeries = getSeriesLabel(key, lang);
      if (fromSeries !== key) return fromSeries;
      if (seriesLabels.UI_TEXT?.[key]) return seriesLabels.UI_TEXT[key][lang];
      return getSystemLabel(key, lang === "CN") ?? key;
    },
  },

  components: {
    actionButtons: [
      {
        labelKey: 'batch_edit',
        route: '/manager/series/batch_edit',
      },
      {
        labelKey: 'exportData',
        action: 'export',
      },
    ],

    searchConfig: {
      placeholder: {
        EN: 'Search title, artist, type, medium, year...',
        CN: '搜索标题、艺术家、类型、媒介、年份...',
      },
      ariaLabel: {
        EN: 'Search series',
        CN: '搜索系列',
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
export const createSeriesControlPanelConfig = () => ({
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
      label: { cn: '标题排序', en: 'Sort by Title' },
      icon: <ArrowUpDown size={20} />,
      action: 'sortByField',
      sortField: 'title',
      tooltip: { cn: '按标题排序', en: 'Sort by Title' },
      activeColor: 'red',
      inactiveColor: 'var(--text-primary, #000000)',
    },
    {
      type: 'toggle',
      label: { cn: '顺序排序', en: 'Sort by Order' },
      icon: <ArrowUpDown size={20} />,
      action: 'sortByField',
      sortField: 'order',
      tooltip: { cn: '按顺序排序', en: 'Sort by Order' },
      activeColor: 'red',
      inactiveColor: 'var(--text-primary, #000000)',
    },
  ],
});

// ===================== 导出默认 =====================
export default seriesSchemaConfig;
