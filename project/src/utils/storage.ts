import { User, TimeEntry } from '../types';

const STORAGE_KEYS = {
  USERS: 'clt_tracking_users',
  TIME_ENTRIES: 'clt_tracking_entries',
  CURRENT_USER: 'clt_tracking_current_user',
  THEME: 'clt_tracking_theme'
};

export const storage = {
  // Users
  getUsers(): User[] {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Time Entries
  getTimeEntries(): TimeEntry[] {
    const entries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return entries ? JSON.parse(entries) : [];
  },

  saveTimeEntry(entry: TimeEntry): void {
    const entries = this.getTimeEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
  },

  getUserTimeEntries(userId: string): TimeEntry[] {
    return this.getTimeEntries().filter(entry => entry.userId === userId);
  },

  // Current User
  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Theme
  getTheme(): boolean {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme ? JSON.parse(theme) : false;
  },

  setTheme(isDark: boolean): void {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  }
};