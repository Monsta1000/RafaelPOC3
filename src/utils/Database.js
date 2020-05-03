import SQLite from 'react-native-sqlite-storage';

const DB = SQLite.openDatabase({ name: 'Rafael.db' });

class Database {

    constructor(db) {
        try {
            this.db = db;
        }
        catch (e) {
            console.log("Database CTOR", e);
        }
    }

    executeSql = (sql, params = []) => new Promise((resolve, reject) => {
        this.db.transaction((trans) => {
            trans.executeSql(sql, params, (db, results) => {
                resolve(results);
            },
                (error) => {
                    reject(error);
                });
        });
    });
}

export default new Database(DB)