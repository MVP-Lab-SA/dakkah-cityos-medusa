const http = require("http");

const BACKEND = { host: "127.0.0.1", port: 9000 };
const STOREFRONT = { host: "127.0.0.1", port: 5173 };
const LISTEN_PORT = 5000;

const API_PREFIXES = ["/platform", "/store", "/admin", "/commerce", "/auth", "/health", "/webhooks"];

function getTarget(url) {
  for (const prefix of API_PREFIXES) {
    if (url === prefix || url.startsWith(prefix + "/") || url.startsWith(prefix + "?")) {
      return BACKEND;
    }
  }
  return STOREFRONT;
}

function proxy(req, res) {
  const target = getTarget(req.url);

  const options = {
    hostname: target.host,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${target.host}:${target.port}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error(`Proxy error to ${target.host}:${target.port}${req.url}:`, err.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end("Bad Gateway");
    }
  });

  req.pipe(proxyReq, { end: true });
}

const server = http.createServer(proxy);

server.on("upgrade", (req, socket, head) => {
  const target = getTarget(req.url);
  const options = {
    hostname: target.host,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${target.host}:${target.port}` },
  };

  const proxyReq = http.request(options);
  proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    socket.write(
      `HTTP/${proxyRes.httpVersion} ${proxyRes.statusCode} ${proxyRes.statusMessage}\r\n` +
        Object.entries(proxyRes.headers)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\r\n") +
        "\r\n\r\n"
    );
    if (proxyHead.length) socket.write(proxyHead);
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });
  proxyReq.on("error", () => socket.end());
  proxyReq.end();
});

server.listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(`Production proxy listening on 0.0.0.0:${LISTEN_PORT}`);
});
