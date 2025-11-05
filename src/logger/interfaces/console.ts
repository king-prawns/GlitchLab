interface Console {
  debug: (...data: Array<unknown>) => void;
  log: (...data: Array<unknown>) => void;
  info: (...data: Array<unknown>) => void;
  warn: (...data: Array<unknown>) => void;
  error: (...data: Array<unknown>) => void;
}

export default Console;
