
export function tabsActiveReducer(state={}, action) {
  switch(action.type) {
    case 'TAB_ACTIVE':
      return Object.assign({}, state, action.tab_active);
    default:
      return state;
  }
}
