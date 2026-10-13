import { createComprehensiveArtistContactExport } from "@/components/pages/manager/utils/artistContactExportUtils";
import { getSystemLabel, createBasePageText } from "@/components/labels/system_labels";
import { ArrowUpDown } from 'lucide-react';
import { sortAlphabetically } from '@/utils/sortUtils';
import { ORIGINAL_SIZE_PRESET } from '@/components/pages/manager/constants/cardDisplayPresets';

/**
 * ArtistContact Fields Configuration
 */

export const getArtistContactFields = (lang = 'EN') => [
  { key: 'artist_name', label: 'Artist Name / 艺术家姓名' },
  { key: 'email', label: 'Email / 邮箱' },
  { key: 'phone', label: 'Phone / 电话' },
  { key: 'address', label: 'Address / 地址', isArray: true },
  { key: 'social_media', label: 'Social Media / 社交媒体', isArray: true },
  { key: 'web_url', label: 'Website URL / 网站链接' },
  { key: 'language', label: 'Language / 语言' },
  { key: 'order', label: 'Order / 顺序' },
  { key: 'updatedAt', label: 'Updated At / 更新时间' },
];

export const getArtistContactDeleteDialogFields = (lang = 'EN') => [
  { key: 'artist_name', label: 'Artist Name:' },
  { key: 'email', label: 'Email:' },
  { key: 'phone', label: 'Phone:' },
  { key: 'language', label: 'Language:' },
];

export const ARTIST_CONTACT_SORT_FIELDS = [
  'artist_name',
  'order',
];

export const ARTIST_CONTACT_SEARCH_FIELDS = [
  'artist_name',
  'email',
  'phone',
  'address',
];

export const getEmptyArtistContact = () => ({
 artist_name: '',
  email: '',
  phone: '',
  address: [],
  social_media: [],
  web_url: '',
  language: '',
  order: '',
  updatedAt: '',
});

export const COMPONENT_CONFIG = {
  DEBOUNCE_DELAY: 300,
  FUZZY_SEARCH_THRESHOLD: 3,
  MIN_MATCH_CHAR_LENGTH: 1,
  SESSION_STORAGE_PREFIX: 'ARTIST_contact_edit_',
  SUMMARY_FIELD_COUNT: 4,
};

export const FILTER_VALUES = {
  ALL: 'all',
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

export const FIELD_DISPLAY_CONFIG = {
  summaryFields: [
    'artist_name',
    'email',
    'phone',
  ],
  detailFields: [
    'address',
    'social_media',
    'web_url',
    'language',
    'order',
    'updatedAt',
  ],
};

// 页面文本（可复用 system_labels 的部分，或独立定义）
const PAGE_TEXT = {
  createTooltip: { EN: "Add New Artist Contact", CN: "添加艺术家联系信息" },
  export: {
    success: { EN: "Exported successfully", CN: "导出成功" },
    error: { EN: "Export failed", CN: "导出失败" },
    items: { EN: "items", CN: "项" },
  },
  emptyState: {
    noData: { EN: "No artist contacts found.", CN: "未找到艺术家联系信息。" },
    noMatchingItems: { EN: "No matching artist contacts.", CN: "未找到匹配的艺术家联系信息。" },
  },
  errors: {
    loadingError: { EN: "Failed to load data", CN: "加载数据失败" },
    systemError: { EN: "System error occurred", CN: "系统发生错误" },
    tryAgain: { EN: "Try Again", CN: "重试" },
    pleaseRetry: { EN: "Please retry", CN: "请重试" },
    ok: { EN: "OK", CN: "确定" },
  },
  deleteDialog: {
    title: { EN: "Delete Artist Contact", CN: "删除艺术家联系信息" },
    confirm: { EN: "Delete", CN: "删除" },
    cancel: { EN: "Cancel", CN: "取消" },
  },
};

// 如有专用的 labels 文件，可导入替换，这里用内联定义
const ArtistContactLabels = {
  UI_TEXT: {
    // 可扩展
  },
};

const getArtistContactLabel = (key, lang) => {
  // 简单的映射，可扩充
  const labels = {
   artist_name: { EN: 'Artist Name', CN: '艺术家姓名' },
    email: { EN: 'Email', CN: '邮箱' },
    phone: { EN: 'Phone', CN: '电话' },
    address: { EN: 'Address', CN: '地址' },
    social_media: { EN: 'Social Media', CN: '社交媒体' },
    web_url: { EN: 'Website URL', CN: '网站链接' },
    language: { EN: 'Language', CN: '语言' },
    order: { EN: 'Order', CN: '顺序' },
    updatedAt: { EN: 'Updated At', CN: '更新时间' },
  };
  return labels[key]?.[lang] ?? key;
};

export const ArtistContactSchemaConfig = {
  title: "Artist Contacts",
  schemaName: "ArtistContact",

  api: {
    endpoint: "/api/artist-contact",
    deleteEndpoint: "/api/artist-contact",
    listEndpoint: "/api/artist-contact/list",
  },

  navigation: {
    createPath: "/manager/artist-contact/create",
    editPathTemplate: "/manager/artist-contact/{id}/edit",
  },

  dataConfig: {
    titleField: "artist_name",
    descriptionField: "email",        // 可选，也可以设为 opening_time
    imageField: null,                 // 没有默认图片字段

    alphabetFilterField: "artist_name",
    languageField: "language",

    getFields: (lang) => getArtistContactFields(lang),
    getDeleteDialogFields: (lang) => getArtistContactDeleteDialogFields(lang),
    getEmptyItem: () => getEmptyArtistContact(),

    sortFields: ARTIST_CONTACT_SORT_FIELDS,
    searchFields: ARTIST_CONTACT_SEARCH_FIELDS,
    fieldDisplayConfig: FIELD_DISPLAY_CONFIG,

    customSearch: (item, searchTerm, isCn) => {
      const itemLanguage = item.language?.toUpperCase()?.trim();
      const currentLanguage = isCn ? 'CN' : 'EN';

      if (itemLanguage && itemLanguage !== currentLanguage) {
        return false;
      }

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase().trim();

      const searchableFields = [
        item.artist_name,
        item.email,
        item.phone,
        // 若希望支持地址搜索，可展开
        ...(Array.isArray(item.address) ? item.address : []),
      ];

      return searchableFields.some(
        (field) => field && String(field).toLowerCase().includes(term)
      );
    },
  },

  filterConfig: {
    values: FILTER_VALUES,
    filterFields: [
      { key: "artist_name", fields: ["artist_name"] },
      { key: "language", fields: ["language"] },
    ],
    createControlPanelConfig: () => createArtistContactControlPanelConfig(),
  },

  exportConfig: {
    formatter: (data, isCn) => createComprehensiveArtistContactExport(data, isCn),
    filename: { EN: "artist_contact_export_en", CN: "artist_contact_export_cn" },
  },

  uiConfig: {
    defaultViewMode: VIEW_MODES.GRID,
    viewModes: VIEW_MODES,
    isArtistweb: false,
    debounceDelay: COMPONENT_CONFIG.DEBOUNCE_DELAY,
    ...ORIGINAL_SIZE_PRESET,
  },

  labels: {
    itemName: { EN: "Artist Contact", CN: "艺术家联系信息" },
    pageText: createBasePageText({
      createTooltip: PAGE_TEXT.createTooltip,
      export: {
        ...PAGE_TEXT.export,
        items: PAGE_TEXT.export.items,
      },
      emptyState: {
        noData: PAGE_TEXT.emptyState.noData,
        noMatchingItems: PAGE_TEXT.emptyState.noMatchingItems,
      },
      errors: PAGE_TEXT.errors,
      deleteDialog: PAGE_TEXT.deleteDialog,
    }),
    getLabel: (key, lang) => {
      const fromARTIST = getArtistContactLabel(key, lang);
      if (fromARTIST !== key) return fromARTIST;
      if (ArtistContactLabels.UI_TEXT?.[key]) return ArtistContactLabels.UI_TEXT[key][lang];
      return getSystemLabel(key, lang === "CN") ?? key;
    },
  },

  components: {
    actionButtons: [
      {
        labelKey: 'batch_edit',
        route: '/manager/artist-contact/batch_edit',
      },
      {
        labelKey: 'exportData',
        action: 'export',
      },
    ],

    searchConfig: {
      placeholder: {
        EN: 'Search by name, email, phone...',
        CN: '搜索名称、邮箱、电话...',
      },
      ariaLabel: {
        EN: 'Search ARTIST contacts',
        CN: '搜索艺术家联系信息',
      },

      selectConfig: {
        filterKey: 'artist_name',
        placeholder: {
          EN: 'All Galleries',
          CN: '全部艺术家',
        },
        ariaLabel: {
          EN: 'Select ARTIST',
          CN: '选择艺术家',
        },
        allLabel: {
          EN: 'All Galleries',
          CN: '全部艺术家',
        },
      },
    },
  },
};

export const createArtistContactControlPanelConfig = () => ({
  filters: [
    {
      field: 'artist_name',
      label: { cn: '艺术家姓名', en: 'Artist Name' },
      sortFunction: sortAlphabetically,
    },
    {
      field: 'language',
      label: { cn: '语言', en: 'Language' },
      sortFunction: sortAlphabetically,
    },
  ],
  controls: [
    {
      type: 'toggle',
      label: { cn: '名称排序', en: 'Sort by Name' },
      icon: <ArrowUpDown size={20} />,
      action: 'sortByField',
      sortField: 'artist_name',
      tooltip: { cn: '按艺术家姓名排序', en: 'Sort by Artist Name' },
      activeColor: 'red',
      inactiveColor: 'var(--text-primary, #000000)',
    },
  ],
});

export default createArtistContactControlPanelConfig;
