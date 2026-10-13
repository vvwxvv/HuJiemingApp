// Field labels based on Series Prisma model
export const fieldLabels = {
  // Core fields
  title: "Title / 标题",
  artist: "Artist / 艺术家",
  cover_img_url: "Cover Image / 封面图片",
  type: "Type / 类型",
  medium: "Medium / 媒介",
  year: "Year / 年份",
  caption: "Caption / 说明",
  credits: "Credits / 鸣谢",
  special_thanks: "Special Thanks / 特别感谢",
  introduction: "Introduction / 引言",
  order: "Order / 顺序",
  language: "Language / 语言",
  mark: "Mark / 标记",

  // Timestamps
  updatedAt: "Last Updated / 最后更新",
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: {
    EN: "Series Management",
    CN: "系列管理",
  },

  // Item Name
  itemName: {
    EN: "Series Entry",
    CN: "系列条目",
  },

  // Create Button Tooltip
  createTooltip: {
    EN: "Create New Series Entry",
    CN: "创建新系列条目",
  },

  // Filter Labels
  filters: {
    type: { EN: "Type", CN: "类型" },
    year: { EN: "Year", CN: "年份" },
    artist: { EN: "Artist", CN: "艺术家" },
    language: { EN: "Language", CN: "语言" },
  },

  // Control Panel
  controlPanel: {
    sortByOrder: { EN: "Sort by Order", CN: "按顺序排序" },
    sortByOrderTooltip: { EN: "Sort entries by order", CN: "按顺序排序条目" },
    sortByUpdate: { EN: "Sort by Update", CN: "按更新排序" },
    sortByUpdateTooltip: { EN: "Sort by update date", CN: "按更新日期排序" },
    exportData: { EN: "Export Data", CN: "导出数据" },
    exportDataTooltip: { EN: "Export series data", CN: "导出系列数据" },
  },

  // Field Labels
  fields: {
    title: { EN: "Title", CN: "标题" },
    artist: { EN: "Artist", CN: "艺术家" },
    coverImgUrl: { EN: "Cover Image", CN: "封面图片" },
    type: { EN: "Type", CN: "类型" },
    medium: { EN: "Medium", CN: "媒介" },
    year: { EN: "Year", CN: "年份" },
    caption: { EN: "Caption", CN: "说明" },
    credits: { EN: "Credits", CN: "鸣谢" },
    specialThanks: { EN: "Special Thanks", CN: "特别感谢" },
    introduction: { EN: "Introduction", CN: "引言" },
    order: { EN: "Order", CN: "顺序" },
    language: { EN: "Language", CN: "语言" },
    mark: { EN: "Mark", CN: "标记" },
    updatedAt: { EN: "Updated At", CN: "更新时间" },
  },

  // Empty State Messages
  emptyState: {
    noData: { EN: "No series entries found", CN: "暂无系列条目" },
    noMatchingEntries: { EN: "No matching entries", CN: "没有匹配的条目" },
  },

  // Delete Dialog
  deleteDialog: {
    title: { EN: "Confirm Delete", CN: "确认删除" },
    confirm: { EN: "Delete", CN: "删除" },
    cancel: { EN: "Cancel", CN: "取消" },
  },

  // Error Messages
  errors: {
    loadingError: { EN: "Error loading data", CN: "加载数据错误" },
    systemError: { EN: "System error occurred", CN: "系统错误" },
    tryAgain: { EN: "Try Again", CN: "重试" },
    deleteError: { EN: "Delete failed", CN: "删除失败" },
    pleaseRetry: { EN: "Please try again", CN: "请重试" },
    ok: { EN: "OK", CN: "确定" },
  },

  // Export Messages
  export: {
    success: { EN: "Export successful", CN: "导出成功" },
    error: { EN: "Export failed", CN: "导出失败" },
    entries: { EN: "entries", CN: "个条目" },
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create Series Entry",
  create_cn: "创建系列条目",
  edit_en: "Edit Series Entry",
  edit_cn: "编辑系列条目",
  delete_en: "Delete Series Entry",
  delete_cn: "删除系列条目",
  export_en: "Export Series Data",
  export_cn: "导出系列数据",
  import_en: "Import Series Data",
  import_cn: "导入系列数据",
};

// Status labels
export const statusLabels = {
  success_en: "Operation completed successfully",
  success_cn: "操作成功完成",
  error_en: "An error occurred",
  error_cn: "发生错误",
  loading_en: "Loading...",
  loading_cn: "加载中...",
  saving_en: "Saving...",
  saving_cn: "保存中...",
};

// Entity labels
export const entityLabels = {
  seriesEntry_en: "Series Entry",
  seriesEntry_cn: "系列条目",
  seriesEntries_en: "Series Entries",
  seriesEntries_cn: "系列条目",
  untitledEntry_en: "Untitled Entry",
  untitledEntry_cn: "无标题条目",
};

// Filter labels
export const filterLabels = {
  all_types_en: "All Types",
  all_types_cn: "全部类型",
  all_years_en: "All Years",
  all_years_cn: "全部年份",
  all_artists_en: "All Artists",
  all_artists_cn: "全部艺术家",
  all_languages_en: "All Languages",
  all_languages_cn: "全部语言",
};

// Sort labels
export const sortLabels = {
  sort_by_order_en: "Sort by Order",
  sort_by_order_cn: "按顺序排序",
  sort_by_update_en: "Sort by Update",
  sort_by_update_cn: "按更新排序",
  sort_by_title_en: "Sort by Title",
  sort_by_title_cn: "按标题排序",
  sort_by_year_en: "Sort by Year",
  sort_by_year_cn: "按年份排序",
  sort_by_language_en: "Sort by Language",
  sort_by_language_cn: "按语言排序",
};

// Page labels
export const pageLabels = {
  title_en: "Series Management",
  title_cn: "系列管理",
  description_en: "Manage series entries including bodies of work and groupings",
  description_cn: "管理系列条目，包括作品群组",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: { en: 'Series Index', cn: '系列索引' },
  title: { en: 'Title', cn: '标题' },
  artist: { en: 'Artist', cn: '艺术家' },
  type: { en: 'Type', cn: '类型' },
  year: { en: 'Year', cn: '年份' },
  language: { en: 'Language', cn: '语言' },
  mark: { en: 'Mark', cn: '标记' },
  all: { en: 'All', cn: '全部' },
  noItemsFound: {
    en: 'No items found matching the criteria',
    cn: '没有找到符合条件的项目'
  },
  noEntriesFound: {
    en: 'No series entries found matching the criteria',
    cn: '没有找到符合条件的系列条目'
  },
  loadingError: { en: 'Connection Failed', cn: '连接失败' },
  systemError: { en: 'System temporarily unavailable', cn: '系统暂时不可用' },
  tryAgain: { en: 'Try Again', cn: '重试' },
  fields: {
    title: { en: 'Title', cn: '标题' },
    artist: { en: 'Artist', cn: '艺术家' },
    type: { en: 'Type', cn: '类型' },
    year: { en: 'Year', cn: '年份' },
    language: { en: 'Language', cn: '语言' },
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的系列条目' : 'No series entries to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的条目' : 'No matching entries found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  type: '类型',
  year: '年份',
  artist: '艺术家',
  language: '语言',
  sortByOrder: '按顺序排序',
  sortByOrderTooltip: 'Sort by Order',
  sortByUpdate: '按更新排序',
  sortByUpdateTooltip: 'Sort by Update',
  sortByTitle: '按标题排序',
  sortByTitleTooltip: 'Sort by Title',
  sortByYear: '按年份排序',
  sortByYearTooltip: 'Sort by Year',
  titleLabel_en: "Title",
  titleLabel_cn: "标题",
  artistLabel_en: "Artist",
  artistLabel_cn: "艺术家",
  typeLabel_en: "Type",
  typeLabel_cn: "类型",
  yearLabel_en: "Year",
  yearLabel_cn: "年份",
  languageLabel_en: "Language",
  languageLabel_cn: "语言",
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "系列列表" : "SERIES LIST",
  detailsLabel: (isCn) => isCn ? "系列详情" : "SERIES DETAILS",
  untitled: (isCn) => isCn ? "无标题条目" : "Untitled Entry",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
  media: {
    title: (isCn) => isCn ? "媒体链接" : "Media Links",
  },
  relations: {
    title: (isCn) => isCn ? "关联信息" : "Relations",
  },
  metadata: {
    title: (isCn) => isCn ? "元数据" : "Metadata",
  },
};

// Field labels for components (object with en/cn)
export const fieldLabelsForComponents = {
  title: { en: 'Title', cn: '标题' },
  artist: { en: 'Artist', cn: '艺术家' },
  cover_img_url: { en: 'Cover Image', cn: '封面图片' },
  type: { en: 'Type', cn: '类型' },
  medium: { en: 'Medium', cn: '媒介' },
  year: { en: 'Year', cn: '年份' },
  caption: { en: 'Caption', cn: '说明' },
  credits: { en: 'Credits', cn: '鸣谢' },
  special_thanks: { en: 'Special Thanks', cn: '特别感谢' },
  introduction: { en: 'Introduction', cn: '引言' },
  order: { en: 'Order', cn: '顺序' },
  language: { en: 'Language', cn: '语言' },
  mark: { en: 'Mark', cn: '标记' },
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this series entry",
  delete_dialog_this_item_cn: "该系列条目",
  confirmDeleteEntry_en: "Are you sure you want to delete this series entry?",
  confirmDeleteEntry_cn: "确定要删除该系列条目吗？",
  thisEntry_en: "this entry",
  thisEntry_cn: "该条目",
};

// Additional labels (placeholders, descriptions, etc.)
export const additionalLabels = {
  // Placeholder and description labels
  selectType_en: "Select Type",
  selectType_cn: "选择类型",
  selectYear_en: "Select Year",
  selectYear_cn: "选择年份",
  selectLanguage_en: "Select Language",
  selectLanguage_cn: "选择语言",
  titlePlaceholder_en: "Enter title",
  titlePlaceholder_cn: "输入标题",
  artistPlaceholder_en: "Enter artist name",
  artistPlaceholder_cn: "输入艺术家名称",
  coverImageUrlPlaceholder_en: "Enter cover image URL",
  coverImageUrlPlaceholder_cn: "输入封面图片URL",
  typePlaceholder_en: "Enter type (e.g., Series)",
  typePlaceholder_cn: "输入类型（如：系列）",
  mediumPlaceholder_en: "Enter medium",
  mediumPlaceholder_cn: "输入媒介",
  yearPlaceholder_en: "Enter year (e.g., 2024)",
  yearPlaceholder_cn: "输入年份（如：2024）",
  captionPlaceholder_en: "Enter caption",
  captionPlaceholder_cn: "输入说明",
  creditsPlaceholder_en: "Enter credits",
  creditsPlaceholder_cn: "输入鸣谢",
  specialThanksPlaceholder_en: "Enter special thanks",
  specialThanksPlaceholder_cn: "输入特别感谢",
  languagePlaceholder_en: "Enter language (e.g., English, Chinese)",
  languagePlaceholder_cn: "输入语言（如：英语、中文）",
  markPlaceholder_en: "Enter mark (optional)",
  markPlaceholder_cn: "输入标记（可选）",

  // Entity and collection labels
  no_entries_en: "No series entries found",
  no_entries_cn: "未找到系列条目",

  // Search and filter labels
  searchEntries_en: "Search series entries",
  searchEntries_cn: "搜索系列条目",

  // Status and error labels
  noFeaturedEntries_en: "No featured series entries available",
  noFeaturedEntries_cn: "暂无精选系列条目",
  noMatchingEntries_en: "No matching series entries found",
  noMatchingEntries_cn: "没有找到符合条件的系列条目",
};

// UI Text Configuration (compact error/message strings)
export const UI_TEXT = {
  loadingError: { en: 'Connection Failed', cn: '连接失败' },
  systemError: { en: 'System temporarily unavailable', cn: '系统暂时不可用' },
  tryAgain: { en: 'Try Again', cn: '重试' },
  seriesManagement: { en: 'Series Management', cn: '系列管理' },
  noData: { en: 'No series entries available', cn: '暂无系列条目数据' },
  noMatchingEntries: { en: 'No matching series entries found', cn: '未找到匹配的系列条目' },
  all: { en: 'All', cn: '全部' },
  totalCount: { en: 'Total', cn: '总计' },
  exportSuccess: { en: 'Export successful', cn: '导出成功' },
  exportError: { en: 'Export failed', cn: '导出失败' },
  exportInProgress: { en: 'Exporting...', cn: '导出中...' }
};

// Combined labels object for easy access
export const seriesLabels = {
  ...fieldLabels,
  ...actionLabels,
  ...statusLabels,
  ...entityLabels,
  ...filterLabels,
  ...sortLabels,
  ...pageLabels,
  ...deleteDialogLabels,
  ...additionalLabels,
  uiText: uiTextLabels,
  display: displayLabels,
  controlPanel: controlPanelLabels,
  defaultContent: defaultContentLabels,
  fieldLabelsForComponents,
  UI_TEXT: UI_TEXT,
  PAGE_TEXT,
};

// Helper function to get labels
export const getSeriesLabel = (key, language = 'en') => {
  if (!key) return '';

  // Try direct field labels first (slash format string)
  if (fieldLabels[key]) {
    // fieldLabels[key] is like "Title / 标题"
    if (language === 'en') {
      return fieldLabels[key].split('/')[0].trim();
    } else {
      return fieldLabels[key].split('/')[1]?.trim() || fieldLabels[key];
    }
  }

  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (seriesLabels[labelKey]) {
    return seriesLabels[labelKey];
  }

  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (seriesLabels[englishKey]) {
      return seriesLabels[englishKey];
    }
  }

  return key;
};

// Helper function to get UI text
export const getSeriesUIText = (key, language = 'en') => {
  if (!key) return '';

  // Try to get from uiText configuration
  if (uiTextLabels[key]) {
    return uiTextLabels[key][language] || uiTextLabels[key]['en'] || key;
  }

  // Try nested fields
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    if (uiTextLabels[parent] && uiTextLabels[parent][child]) {
      return uiTextLabels[parent][child][language] || uiTextLabels[parent][child]['en'] || key;
    }
  }

  return key;
};

// Default export
export default seriesLabels;
