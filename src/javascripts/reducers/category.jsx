export function categoryReducer(state = [], action) {
  switch(action.type) {
    case 'SET_CATEGORIES':
      return action.categories;
    default:
      return state;
  }
}

export function currentCategoryReducer(state = 'all', action) {
  switch(action.type) {
    case 'SET_CURRENT_CATEGORY':
      return action.currentCategory;
    default:
      return state;
  }
}
