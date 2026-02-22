/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'Pharmantech',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      // protect: ['production'].includes(input?.stage),
      home: 'aws'
    };
  },
  async run() {
    new sst.aws.SvelteKit('Pharmantech', {
      environment: {
        PUBLIC_API_HOST: process.env.PUBLIC_API_HOST ?? 'http://localhost:8080',
        PUBLIC_CDN_HOST: process.env.PUBLIC_CDN_HOST ?? 'http://localhost:8080/media',
        PUBLIC_PARENT_DOMAIN: process.env.PUBLIC_PARENT_DOMAIN ?? 'http://localhost:8080',
        PUBLIC_RECAPTCHA_KEY: process.env.PUBLIC_RECAPTCHA_KEY ?? '',
        PUBLIC_GOOGLE_OAUTH_ID: process.env.PUBLIC_GOOGLE_OAUTH_ID ?? '',
        PRIVATE_GOOGLE_OAUTH_SECRET: process.env.PRIVATE_GOOGLE_OAUTH_SECRET ?? '',
        PUBLIC_NAVER_OAUTH_ID: process.env.PUBLIC_NAVER_OAUTH_ID ?? '',
        PRIVATE_NAVER_OAUTH_SECRET: process.env.PRIVATE_NAVER_OAUTH_SECRET ?? '',
        PUBLIC_KAKAO_OAUTH_ID: process.env.PUBLIC_KAKAO_OAUTH_ID ?? '',
        PRIVATE_KAKAO_OAUTH_SECRET: process.env.PRIVATE_KAKAO_OAUTH_SECRET ?? '',
        PUBLIC_GOOGLE_MAPS_API_KEY: process.env.PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
      }
    });
  }
});
