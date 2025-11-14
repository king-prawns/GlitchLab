interface HttpChaosEvent {
  type: 'fetch' | 'xhr';
  url: string;
}

export default HttpChaosEvent;
