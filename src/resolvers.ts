import { getObjectives } from "./connector";

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

export const objectives = () => getObjectives().then(transformOKR);
