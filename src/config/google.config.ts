import { registerAs } from '@nestjs/config';
export default registerAs('google', () => {
  return {
    clientId: [
      process.env.GOOGLE_CLIENT_ID_WEB,
      process.env.GOOGLE_CLIENT_ID_ANDROID,
      process.env.GOOGLE_CLIENT_ID_IOS,
    ],
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
});
