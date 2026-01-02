import { db } from "./index";

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      owner_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      start_utc TEXT NOT NULL,
      end_utc TEXT NOT NULL,
      timezone_id TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      event_id TEXT NOT NULL,
      offset_minutes INTEGER NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_utc);
  `);
}
