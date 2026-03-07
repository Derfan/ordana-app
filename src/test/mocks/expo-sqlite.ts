export const openDatabaseSync = () => ({
  execSync: () => {},
  runSync: () => ({ changes: 0, lastInsertRowId: 0 }),
  getFirstSync: () => null,
  getAllSync: () => [],
  closeSync: () => {},
});

export const openDatabaseAsync = async () => ({
  execAsync: async () => {},
  runAsync: async () => ({ changes: 0, lastInsertRowId: 0 }),
  getFirstAsync: async () => null,
  getAllAsync: async () => [],
  closeAsync: async () => {},
});

export default { openDatabaseSync, openDatabaseAsync };
