import { writeError } from "../ipcCommunication/ipcLogger";

const { remote } = window.require("electron")

const arrayPrepareStackTrace = (err, stack) => { return stack }

export const getPreviousStackInfo = (traceInx = 1) => {
    let priorPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = arrayPrepareStackTrace;
    let stacks = (new Error()).stack;
    Error.prepareStackTrace = priorPrepareStackTrace;

    if (stacks) {
        return `[${stacks[traceInx].getFileName()}:${stacks[traceInx].getLineNumber()} ${stacks[traceInx].getFunctionName()?stacks[traceInx].getFunctionName():' '}]`;
    }
    return '[ unknown ]> '
};


export const getGlobalUserConfig = (key) => {
    try {
        return remote.getGlobal("USER_CONFIG").get(key)
    } catch (err) {
        writeError('getGlobalUserConfig Err.', key, err);
        return {}
    }
}

export const setGlobalUserConfig = (key, value) => {
    try {
        remote.getGlobal("USER_CONFIG").set(key, value)
    } catch (err) {
        writeError('setGlobalUserConfig', key, value, err)
    }
}