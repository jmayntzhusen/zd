export function resultReducer(state = null, action) {
  switch(action.type) {
    case 'SET_RESULT':
      return action.result;
    default:
      return state;
  }
}
