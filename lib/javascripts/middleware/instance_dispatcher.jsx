

export function instance_dispatcher_middleware(app) {
  return ({ getState }) => {
    return (next) => {
      return (action) => {
        app.client.get('instances').then(response => {
          Object.keys(response.instances).forEach(guid => {
            const context = response.instances[guid];
            const action_routes = app.get_action_routes(app.action_routes);
            const dispatch_actions = action_routes[context.location];

            if (typeof dispatch_actions !== 'undefined'
                && dispatch_actions.indexOf(action.type) > -1) {
              app.client.instance(guid).dispatch(action);
            }
          });
        });

        return next(action);
      }
    }
  }
}
