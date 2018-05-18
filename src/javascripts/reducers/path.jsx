export function pathReducer(state = null, action) {
  switch(action.type) {
    case 'SET_PATH':
      return action.path;
    default:
      return state;
  }
}
