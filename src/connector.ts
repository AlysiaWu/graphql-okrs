import { RequestOptions } from "http";
import { get } from "https";

const makeRequest = (options: RequestOptions) => new Promise((resolve, reject) => {
    get(options, (res) => {
        let result = "";
        res.on("data", (chunk) => result += chunk);
        res.on("end", () => resolve(JSON.parse(result)));
        res.on("error", (err) => reject(err));
    });
});

const user = process.env.API_KEY;
const psw = process.env.API_SECRET;
const auth = Buffer.alloc(`${user}:${psw}`.length, `${user}:${psw}`).toString("base64");

const transformOKR = (okrs: {}) => (okrs as [any]).reduce((accumulator: [any], okr) => {
    if (okr.Objective) {
        return accumulator.concat({
            keyResults: [okr],
            title: okr.Objective,
        });
    } else {
        accumulator[accumulator.length - 1].keyResults.push(okr);
        return accumulator;
    }
}, []);

export const getObjectives = () => makeRequest({
    headers: {
        Authorization: `Basic ${auth}`,
     },
    host: "sheetsu.com",
    method: "GET",
    path: `/apis/v1.0su/${process.env.API_ID}`,
    port: 443,
}).then(transformOKR);
