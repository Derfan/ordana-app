import { drizzle } from 'drizzle-orm/expo-sqlite/driver';
import * as SQLite from 'expo-sqlite';

import * as schema from './schema';

const expoDb = SQLite.openDatabaseSync('finance.db');

export const db = drizzle(expoDb, { schema });

export * from './schema';
