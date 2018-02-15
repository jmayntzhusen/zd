
export function setActiveTab(id, tab) {
  return {
    type: 'TAB_ACTIVE',
    tab_active: {[id]: tab},
  };
}
