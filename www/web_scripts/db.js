export const DB = {
  async executeQuery(query, params = []) {
    if (window.isElectron) {
      // Electron IPC
      return window.api.executeQuery(query, params);
    } else if (window.sqlitePlugin) {
      // Cordova
      return new Promise((resolve, reject) => {
        const db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
        db.transaction(tx => {
          tx.executeSql(query, params, (_, res) => resolve(res), (_, err) => reject(err));
        });
      });
    } else {
      throw new Error('No SQLite backend available');
    }
  }
};