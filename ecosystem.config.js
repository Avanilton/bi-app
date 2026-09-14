module.exports = {
  apps: [
    {
      name: "bi-app-prod",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3006",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
