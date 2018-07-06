'use strict';

import { AsyncStorage } from 'react-native'
import Filter from './filter'

export default class Model {

    constructor(modelName, dbName) {
        this.dbName = dbName;
        this.modelName = modelName;
        this.database = {};
        this.offset = 0;
        this.limit = 10;
        this.modelFilter = new Filter();
    }

    async createDatabase() {
        await AsyncStorage.setItem(this.dbName, JSON.stringify({}));
        return this.getDatabase();
    }

    async getDatabase() {
        const database = await AsyncStorage.getItem(this.dbName);

        if (database) {
            return Object.assign({}, JSON.parse(database));
        } else {
            return this.createDatabase();
        }
    }

    async initModel() {
        this.database = await this.getDatabase();
        this.model = this.database[this.modelName]
            ? this.database[this.modelName]
            : { 'rows': { 'byId': {}, 'allIds': [] } };
        this.database[this.modelName] = this.database[this.modelName] || this.model;
    }

    async destroy() {
        const database = this.getDB();
        return database ? await AsyncStorage.removeItem(this.dbName) : null;
    }

    async add(data) {
        await this.initModel();

        const id = this.getUUID();
        data.id = id;

        this.model.rows.byId[id] = data;
        this.model.rows.allIds.push(id);

        this.database[this.modelName] = this.model;
        await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));

        return this.model.rows.byId[id];
    }

    async multiAdd(data) {
        await this.initModel();

        for (let key in data) {
            const value = this.newMethod(data, key);
            this.model.rows[key] = value;
        }

        this.database[this.modelName] = this.model;
        await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));

        return this.model.rows;
    }

    newMethod(data, key) {
        return data[key];
    }

    async update(data, filter) {
        await this.initModel();
        filter = filter || {};

        if (data.id)
            delete data.id;

        var results = [];
        var rows = this.model["rows"].byId;
        var filterResult = this.modelFilter.apply(rows, filter)

        for (var row in rows) {
            for (var element in filterResult) {
                if (rows[row]['id'] === filterResult[element]['id']) {
                    for (let key in data) {
                        const value = this.newMethod(data, key);
                        if (Array.isArray(rows[row][key])) {
                            rows[row][key].push(value);
                        } else {
                            rows[row][key] = value;
                        }
                    }

                    results.push(rows[row]);
                    this.database[this.modelName] = this.model;
                    await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
                }
            }
        }

        return results.length ? results : null;
    }

    async updateById(data, id) {
        const result = await this.update(data, {
            where: {
                id: id
            }
        });

        return result ? result[0] : null;
    }

    async remove(filter) {
        await this.initModel();
        filter = filter || {};
        var results = [];
        var rowsToDelete = [];
        var rows = this.model["rows"];
        var filterResult = this.modelFilter.apply(rows, filter)

        for (var row in rows) {
            for (var element in filterResult) {
                if (rows[row]['id'] === filterResult[element]['id'])
                    rowsToDelete.push(row);
            }
        }

        for (var i in rowsToDelete) {
            var row = rowsToDelete[i];
            results.push(this.model["rows"][row]);
            delete this.model["rows"][row];
        }
        
        this.database[this.modelName] = this.model;
        await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));

        return results.length ? results : null;
    }

    async removeById(id) {
        const result = await this.remove({
            where: {
                id: id
            }
        });

        return result ? result[0] : null;
    }

    async find(filter) {
        await this.initModel();
        filter = filter || {};
        const rows = this.model["rows"].byId;
        const results = this.modelFilter.apply(rows, filter);

        return results.length ? results : [];
    }

    async findById(id) {
        const result = await this.find({
            where: {
                id: id
            }
        });

        return result ? result[0] : null;
    }

    getUUID() {
        const base64 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";

        return new Array(20)
            .join()
            .split(',')
            .map(function () {
                return base64.charAt(Math.floor(Math.random() * base64.length));
            })
            .join('');
    }

    get(filter) {
        filter = filter || {};
        filter.limit = 1;
        return this.find(filter);
    }
}
