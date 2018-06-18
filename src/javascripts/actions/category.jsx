export function setCategories(categories) {
  return {
    type: 'SET_CATEGORIES',
    categories
  }
}

export function setCurrentCategory(currentCategory) {
  return {
    type: 'SET_CURRENT_CATEGORY',
    currentCategory
  }
}
