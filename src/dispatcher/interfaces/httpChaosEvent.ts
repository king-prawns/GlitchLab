interface HttpChaosEvent {
  kind: 'fetch' | 'xhr';
  type: 'fail' | 'delay';
  url: string;
}

export default HttpChaosEvent;
