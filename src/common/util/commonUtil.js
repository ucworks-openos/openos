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