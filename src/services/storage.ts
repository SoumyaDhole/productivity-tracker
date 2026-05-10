export const storageKey = {
  user: "PRODUCTIVITY_USER",
};

export const saveItem = async (_key: string, _value: string) => {
  // Placeholder storage implementation.
  return Promise.resolve();
};

export const getItem = async (_key: string) => {
  // Placeholder storage implementation.
  return Promise.resolve<string | null>(null);
};
