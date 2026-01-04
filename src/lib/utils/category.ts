export type ApiCategory = 'HAIR' | 'FASHION' | 'SKIN' | 'MAKEUP';

const apiCategoryToLabel: Record<ApiCategory, string> = {
  HAIR: '헤어',
  FASHION: '패션',
  SKIN: '스킨',
  MAKEUP: '메이크업',
};

const routeCategoryToApi: Record<string, ApiCategory> = {
  hair: 'HAIR',
  fashion: 'FASHION',
  skin: 'SKIN',
  makeup: 'MAKEUP',
};

const labelToApiCategory: Record<string, ApiCategory> = {
  헤어: 'HAIR',
  패션: 'FASHION',
  스킨: 'SKIN',
  메이크업: 'MAKEUP',
};

export const getApiCategoryFromRoute = (routeCategory?: string): ApiCategory | undefined => {
  if (!routeCategory) {
    return undefined;
  }
  return routeCategoryToApi[routeCategory.toLowerCase()];
};

export const getApiCategoryFromLabel = (label?: string): ApiCategory | undefined => {
  if (!label || label === '전체') {
    return undefined;
  }
  return labelToApiCategory[label];
};

export const getLabelFromApiCategory = (category?: ApiCategory | string): string => {
  if (!category) {
    return '';
  }
  const apiCategory = category.toUpperCase() as ApiCategory;
  return apiCategoryToLabel[apiCategory] ?? String(category);
};

export const getRouteCategoryFromApi = (category?: ApiCategory | string): string | undefined => {
  if (!category) {
    return undefined;
  }
  const apiCategory = category.toUpperCase() as ApiCategory;
  const entry = Object.entries(routeCategoryToApi).find(([, value]) => value === apiCategory);
  return entry?.[0];
};
