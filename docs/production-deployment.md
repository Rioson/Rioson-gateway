# Production deployment

This repository is a complete open-banking gateway platform, not a consumer banking core. It provides the TPP-facing gateway APIs and protocol adapters required to connect to supported ASPSPs. A live launch still requires the operator's licensed legal entity, registered TPP credentials, qualified certificates, bank contracts, customer-support controls, monitoring, incident response, and jurisdiction-specific compliance approval.

## Included capabilities

The source tree includes:

- PSD2/XS2A account-information and payment-initiation protocol handling.
- HBCI/FinTS protocol handling and sandbox support.
- Consent creation, authorization, renewal, encryption, and expiry flows.
- PSU authentication and SCA redirection flows.
- TPP-facing AIS, PIS, bank search, IBAN search, token, consent, authorization, and administrative APIs.
- Fintech example server/UI, consent UI, protocol sandboxes, database migrations, OpenAPI contracts, smoke tests, and release workflows.
- PostgreSQL persistence through Liquibase and containerized development/deployment examples.

## Required production inputs

Run the embedded starter with the `production` profile and provide all of the following through a secret manager or protected runtime environment. Do not commit values to YAML, Docker images, GitHub Actions, or the repository.

| Variable | Purpose |
| --- | --- |
| `SPRING_DATASOURCE_URL` | TLS-enabled PostgreSQL connection URL. |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | Least-privilege database credentials. |
| `ASPSP_XS2A_BASE_URL` / `ASPSP_XS2A_OAUTH_URL` / `ASPSP_HBCI_BASE_URL` | Production bank connector endpoints used by Liquibase bank configuration. |
| `OBG_ADMIN_LOGIN` / `OBG_ADMIN_PASSWORD` | Protected administrative API credentials. |
| `OBG_TPP_PRIVATE_KEY` / `OBG_TPP_PUBLIC_KEY` | Registered TPP signing key pair. |
| `OBG_EMBEDDED_UI_BASE_URL` | Public HTTPS consent UI origin. |
| `OBG_DATASAFE_PSU_PASSWORD` | PSU data-protection keystore password. |
| `OBG_DATASAFE_FINTECH_PASSWORD` | Fintech data-protection keystore password. |
| `OBG_DATASAFE_FINTECH_USER_PASSWORD` | Fintech-user data-protection keystore password. |
| `OBG_QWAC_KEYSTORE` / `OBG_QWAC_KEYSTORE_PASSWORD` | Qualified certificate keystore path and password. |
| `FINAPI_CLIENT_ID` / `FINAPI_CLIENT_SECRET` | Optional FinAPI adapter credentials when that adapter is enabled. |

Use a real QWAC/QSeal certificate chain and production bank profiles. The repository's `sample-qwac.keystore`, demo private key, localhost URLs, and Docker password are test/demo material and must not be used for live traffic.

## Build and run

```bash
./mvnw -B -ntp -pl opba-embedded-starter -am verify

docker build --tag open-banking-gateway:production .
docker run --rm --name open-banking-gateway \
  --publish 8085:8085 \
  --env SPRING_PROFILES_ACTIVE=production \
  --env-file /run/secrets/open-banking-gateway.env \
  open-banking-gateway:production
```

Put PostgreSQL behind a private network, terminate public TLS at a hardened reverse proxy or load balancer, restrict the actuator endpoints to the operations network, and configure backups and point-in-time recovery before accepting customer traffic.

## Release gates

A production release is blocked until the following are complete:

1. `./mvnw -B -ntp -pl opba-embedded-starter -am verify` passes in CI; runtime deployments use `SPRING_PROFILES_ACTIVE=production`.
2. OpenAPI contract tests and smoke tests pass against the target ASPSP bank profiles.
3. Real qualified certificates are validated against the target ASPSPs.
4. Database migrations are rehearsed on a production-like PostgreSQL copy and rollback/restore procedures are tested.
5. Security review covers key rotation, cookie policy, CSRF/redirect validation, audit logging, secrets handling, dependency CVEs, rate limits, and operational access.
6. Observability confirms health, latency, error rate, consent expiry, SCA outcomes, payment status, and bank-connector failures without logging credentials or payment secrets.
7. Legal/compliance owners approve PSD2/XS2A scope, SCA behavior, data-retention periods, incident reporting, customer support, and the exact ASPSP onboarding set.

The Docker image now starts the deterministic embedded-starter executable as a non-root user and exposes the actual application port (`8085`).
