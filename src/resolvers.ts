import { getObjectives } from "./google-api";

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

export const objectives = () => getObjectives();
