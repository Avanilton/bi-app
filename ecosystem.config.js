module.exports = {
  apps: [
    {
      name: "bi-app-dev",
      script: "node_modules/next/dist/bin/next",
      args: "dev -p 3006",
      env: {
        NODE_ENV: "development",
      }
    }
  ]
};
