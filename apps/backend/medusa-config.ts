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
    {
      resolve: "./src/modules/tenant",
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
