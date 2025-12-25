const log = function (severity) {
  for (var _len = arguments.length, optionalParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    optionalParams[_key - 1] = arguments[_key];
  }
  return (
    // eslint-disable-next-line no-restricted-syntax
    console[severity]('fabric', ...optionalParams)
  );
};
class FabricError extends Error {
  constructor(message, options) {
    super(`fabric: ${message}`, options);
  }
}
class SignalAbortedError extends FabricError {
  constructor(context) {
    super(`${context} 'options.signal' is in 'aborted' state`);
  }
}

export { FabricError, SignalAbortedError, log };
//# sourceMappingURL=console.mjs.map
