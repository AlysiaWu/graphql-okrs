import { getObjectives } from "./connector";

const transformKeyResult = (okr: any) => ({
    description: okr["Key Result"],
    priority: okr.Priority,
    score: okr.Score,
    status: okr.Status,
});

const transformOKR = (okrs: [any]) => okrs.reduce((accumulator: [any], okr) => {
    if (okr.Objective) {
        accumulator.push({
            keyResults: [transformKeyResult(okr)],
            title: okr.Objective,
        });
    } else {
        const prevOKR = accumulator[accumulator.length - 1].keyResults;
        prevOKR.push(transformKeyResult(okr));
    }
    return accumulator;
}, []);

const transformOKRs = (okrs: any) => transformOKR(okrs);

export const objectives = () => getObjectives().then(transformOKRs);
