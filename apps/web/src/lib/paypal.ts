import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';

export const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.PAYPAL_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  logging: { logLevel: LogLevel.Info },
});
