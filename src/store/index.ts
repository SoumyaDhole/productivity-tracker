// Placeholder store implementation.
// Replace this with Redux Toolkit or another state manager when needed.

const store = {
  getState: () => ({}),
  dispatch: () => {},
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
