# Deployment Status Dashboard

Internal frontend for checking the currently published dashboard release and recent deployment metadata.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Release Process

Production release bundles are currently packaged and uploaded manually while the deployment workflow is being formalized.

GitHub Actions is used to validate the frontend build and verify the referenced release bundle metadata. Full build-and-deploy automation is planned later.
