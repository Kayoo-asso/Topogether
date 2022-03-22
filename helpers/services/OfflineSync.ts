import { openDB } from "idb";

openDB('tracks', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
        db.createObjectStore('tr')
    }
})