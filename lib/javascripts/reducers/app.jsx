
export function appReducer(state=null, action) {
  switch(action.type) {
    case "APP_ACTIVE":
      if(state !== null) {
        throw new Error('It is not allowed to set app after initialization!');
      }

      return action.app;
    default:
      return state;
  }
}
