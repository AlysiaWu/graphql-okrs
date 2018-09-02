import {
    getClient,
    getContent,
    listFiles,
    transformOKR,
} from "./google-api";

interface IOKR {
    "Key Result": string;
    Objective: string;
    Priority: string;
    Score: string;
    Status: string;
}

export const KeyResult = {
    description: (okr: IOKR) => okr["Key Result"],
    priority: (okr: IOKR) => okr.Priority,
    score: (okr: IOKR) => okr.Score,
    status: (okr: IOKR) => okr.Status,
};

export const files = async (obj: any, {name}: any): Promise<any[]> => {
    const folderQuery = `name = '${name}' and mimeType = 'application/vnd.google-apps.folder'`;

    const client = await getClient();
    const okrFolder = await listFiles(client, folderQuery);
    const sheets = await listFiles(client, `'${okrFolder[0].id}' in parents`);
    const okrs = await Promise.all(sheets.map((file) => {
        const transform = transformOKR(file);
        return getContent(client, file.id).then(transform);
    }));
    return(okrs);
};
