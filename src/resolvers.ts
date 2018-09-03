import {
    getClient,
    getContent,
    listFiles,
    transformOKR,
} from "./google-api";

import { getFromFirebase } from "./firebase-api";

export const files = async (obj: any, {name}: any): Promise<any[]> => {
    const folderQuery = `name = '${name}' and mimeType = 'application/vnd.google-apps.folder'`;

    const client = await getClient();
    const okrFolder = await listFiles(client, folderQuery);
    const sheets = await listFiles(client, `'${okrFolder[0].id}' in parents`);
    const okrs = await Promise.all(sheets.map((file) => {
        const transform = transformOKR(file);
        return getContent(client, file.id).then(transform);
    }));
    const dbOkrs: [any] = await getFromFirebase();
    return(okrs.concat(dbOkrs));
};
