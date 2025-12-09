type EmeChaosEvent = {
  type: 'rmksa';
  keySystem: string;
  supportedConfigurations: Array<MediaKeySystemConfiguration>;
};

export default EmeChaosEvent;
