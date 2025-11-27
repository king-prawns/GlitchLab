type HttpChaosEvent = {
  kind: 'fetch' | 'xhr';
  url: string;
} & (
  | {
      type: 'fail';
    }
  | {
      type: 'delay';
      delayMs: number;
    }
);

export default HttpChaosEvent;
