import AsyncStorage from '@react-native-async-storage/async-storage'

class StorageProvider {

    constructor() {
        this.memoryStorage = new Map();
        //this.loadFromStorage();
    }

    async loadFromStorage() {
        console.log('###### start');
        k = await AsyncStorage.getAllKeys();
        console.log('###### keys: ' + k);
        /*k.forEach(async (key) => {
            val = await AsyncStorage.getItem(key)
            console.log(key + " :: " + val);
            this.memoryStorage.set(key, val);
        });*/
        for (i=0; i<k.length; i++) {
            v = await AsyncStorage.getItem(k[i])
            console.log(k[i] + " :: " + v);
            this.memoryStorage.set(k[i], v);
        }
        console.log('###### done');
    }
/*
    loadFromStorage() {
        console.log(">>> Storage Loading...");
        AsyncStorage.getAllKeys()
        .then( keys => {
            keys.forEach(key => {
                AsyncStorage.getItem(key)
                .then( val => {
                    this.memoryStorage.set(key, val);
                    console.log('">>> Storage Loading, setItem key->' + key); // + ', val->' + val);
                    
                })
                .catch( err => {
                    console.log("Error Getting Storage Item: " + err);
                });
            });
        })
        .catch( err => {
            console.log("Error Getting Storage Keys: " + err);
        });
    }
*/
    getItem(key) {
    console.log(AsyncStorage);
        try {
        //const value = await AsyncStorage.getItem(key);
        value = this.memoryStorage.get(key);
        if (value !== null) {
            // We have data!!
            console.log('getItem key->' + key); // + ', value->' + value);
            return value;
        } else {
            console.log('getItem key->' + key + ', returns NOTHING');
        }
        } catch (error) {
        // Error retrieving data
        console.log('getItem Error: ' + error);
        }
        //return await getValue(key);
        //return '-- blah --';
    }

    setItem(key, val) {
        try {
        //await AsyncStorage.setItem(key, val);
        this.memoryStorage.set(key, val);
        console.log('setItem key->' + key); // + ', val->' + val);

        AsyncStorage.setItem(key, val)
        .then( result => {
            console.log('Stored key ' + key + ' to backing store');
        })
        .catch( err => {
            console.log('Error storing key ' + err);
        })
        } catch (error) {
        // Error saving data
        console.log('setItem Error: ' + error);
        }
    }

    removeItem(key) {
        //delete myMemoryStore[key];
        try {
        //const value = await AsyncStorage.removeItem(key);
        const deleted = this.memoryStorage.delete(key);
        console.log('removeItem key->' + key + ', val->');// + val);

        AsyncStorage.removeItem(key)
        .then( result => {
            console.log('Rempoved key ' + key + ' from backing store');
        })
        .catch( err => {
            console.log('Error removing key ' + err);
        })
        } catch (error) {
        // Error retrieving data
        console.log('removeItem Error: ' + error);
        }
    }

    async clear() {
        console.log('Flush Memory Store');
        this.memoryStorage.clear();
        await AsyncStorage.clear();
    }
}

export default new StorageProvider();