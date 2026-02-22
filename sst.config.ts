/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'LinearDict',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws'
    };
  },
  async run() {
    new sst.aws.SvelteKit('LinearDict', {
      server: {
        timeout: '120 seconds'
      },
      environment: {
        PRIVATE_TOGETHER_API_KEY: process.env.PRIVATE_TOGETHER_API_KEY ?? ''
      }
    });
  }
});
