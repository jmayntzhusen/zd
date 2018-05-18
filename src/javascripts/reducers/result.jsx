export function resultReducer(state = null, action) {
  console.log('action', action)
  switch(action.type) {
    case 'SET_RESULT':
      return action.result;
    default:
      return state;
  }
}
