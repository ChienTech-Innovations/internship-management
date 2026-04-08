All workflows are in place. Here's a summary of everything created:

---

## Structure created

```
.github/
├── actions/
│   └── build-push-ecr/
│       └── action.yml          ← Reusable composite action
└── workflows/
    ├── ci.yml                  ← PR/push lint & test
    ├── build-backend.yml       ← Build BE image → ECR
    ├── build-frontend.yml      ← Build FE image → ECR
    ├── _deploy.yml             ← Reusable deploy workflow (ECS)
    ├── deploy-staging.yml      ← Manual/callable staging deploy
    ├── deploy-production.yml   ← Manual/callable production deploy
    └── release.yml             ← Tag-triggered full build + prod deploy
```

---

## How it works

**`build-push-ecr` composite action** — shared logic for all image builds: OIDC auth → ECR login → Buildx → push with `latest` + SHA tag. Uses GitHub Actions layer cache (`type=gha`).

**`ci.yml`** — runs on every PR and push to `main`/`develop`. Lints and tests both `be/` and `fe/` in parallel.

**`build-backend.yml` / `build-frontend.yml`** — trigger on path-filtered pushes to `main`/`develop`. After building, they auto-deploy to staging when the branch is `develop`.

**`_deploy.yml`** (reusable `workflow_call`) — accepts environment name, ECR image URIs, and ECS config as inputs. Updates ECS task definitions and waits for service stability. Called by all other deploy workflows.

**`deploy-staging.yml` / `deploy-production.yml`** — can be triggered manually (`workflow_dispatch`) by passing full ECR image URIs, or called programmatically by other workflows.

**`release.yml`** — triggered by `v*.*.*` tags. Builds both images tagged with the version, then deploys to production (with the GitHub environment approval gate blocking the deploy job).

---

## Required GitHub Secrets & Variables

| Secret | Used by |
|--------|---------|
| `AWS_ROLE_ARN` | Build workflows (OIDC for ECR push) |
| `AWS_ROLE_ARN_STAGING` | Staging deploy |
| `AWS_ROLE_ARN_PRODUCTION` | Production deploy |

| Variable | Used by |
|----------|---------|
| `ECS_CLUSTER_STAGING/PRODUCTION` | Deploy workflows |
| `ECS_BACKEND_SERVICE_STAGING/PRODUCTION` | Deploy workflows |
| `ECS_FRONTEND_SERVICE_STAGING/PRODUCTION` | Deploy workflows |
| `ECS_BACKEND_TASKDEF_STAGING/PRODUCTION` | Deploy workflows |
| `ECS_FRONTEND_TASKDEF_STAGING/PRODUCTION` | Deploy workflows |
| `NEXT_PUBLIC_API_BASE_URL_PRODUCTION` | Release workflow |