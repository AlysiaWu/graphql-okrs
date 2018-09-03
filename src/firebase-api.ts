import fs from "fs";

import admin from "firebase-admin";

import debug from "debug";
const logger = debug("firebase");

fs.readFile("serviceAccountKey.json", "utf8", (err, content) => {
    if (err) {
        logger("Error loading service account key file:", err);
        return;
    }
    // Authorize a client with credentials, then call the Google Sheets API.
    const serviceAccount = JSON.parse(content);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://api-project-311237187222.firebaseio.com",
    });
});

export function getFromFirebase(): Promise<[any]> {
    return new Promise((resolve, reject) => {
        // Get a database reference to our posts
        const db = admin.database();
        const ref = db.ref("/");

        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("value", (snapshot) => {
            const results: [any] = snapshot ? snapshot.val() : [];
            resolve(results);
        }, (errorObject: any) => {
            logger(`The read failed: ${errorObject.code}`);
            reject(errorObject);
        });
    });
}
