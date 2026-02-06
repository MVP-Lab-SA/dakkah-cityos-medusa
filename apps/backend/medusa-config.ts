import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  admin: {
    vite: () => {
      let hmrServer;
      if (process.env.HMR_BIND_HOST) {
        const { createServer } = require("http");
        hmrServer = createServer();
        const hmrPort = parseInt(process.env.HMR_PORT || "9001");
        hmrServer.listen(hmrPort, process.env.HMR_BIND_HOST);
      }

      let allowedHosts;
      if (process.env.__MEDUSA_ADDITIONAL_ALLOWED_HOSTS) {
        allowedHosts = [process.env.__MEDUSA_ADDITIONAL_ALLOWED_HOSTS];
      }

      return {
        server: {
          allowedHosts,
          hmr: {
            server: hmrServer,
          },
        },
      };
    },
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    // Notification Module (SendGrid) - only enabled if API key is set
    ...(process.env.SENDGRID_API_KEY
      ? [
          {
            resolve: "@medusajs/medusa/notification",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/notification-sendgrid",
                  id: "sendgrid",
                  options: {
                    channels: ["email"],
                    api_key: process.env.SENDGRID_API_KEY,
                    from: process.env.SENDGRID_FROM,
                  },
                },
              ],
            },
          },
        ]
      : []),
    // Payment Module (Stripe) - only enabled if API key is set
    ...(process.env.STRIPE_API_KEY
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                  },
                },
              ],
            },
          },
        ]
      : []),
    // Meilisearch Module - only enabled if configured
    ...(process.env.MEILISEARCH_HOST
      ? [
          {
            resolve: "./src/modules/meilisearch",
            options: {
              host: process.env.MEILISEARCH_HOST,
              apiKey: process.env.MEILISEARCH_API_KEY || "masterKey",
              productIndexName: process.env.MEILISEARCH_PRODUCT_INDEX_NAME || "products",
            },
          },
        ]
      : []),
    {
      resolve: "./src/modules/tenant",
      key: "tenant",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/store",
      key: "cityosStore",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/vendor",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/commission",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/payout",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/subscription",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/company",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/quote",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
    {
      resolve: "./src/modules/volume-pricing",
      options: {
        definition: {
          isQueryable: true
        }
      }
    },
  ],
});
