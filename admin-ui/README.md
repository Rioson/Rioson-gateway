# Open Banking Gateway Admin Console

The Admin Console is the operator control plane for the gateway. It authenticates to the existing Admin API with HTTP Basic authentication held in memory for the current browser session.

## Features

- Secure administrator sign-in against `/admin/v1/banks`.
- Bank inventory with active/inactive state, BIC, and bank code.
- Bank detail inspection.
- Bank configuration create, update, and delete operations.
- Protocol profile inspection and editing for adapter ID, protocol type, ASPSP URL, identity-provider URL, SCA approach, and consent model.
- Explicit destructive-action confirmation and visible gateway/error states.
- Responsive layout for operations laptops and tablets.

## Development

```bash
npm install
npm run serve
```

The development server runs on `http://localhost:4500` and proxies `/gateway-api/*` to the embedded gateway on `http://localhost:8085`.

## Production

Serve the built static files behind the same HTTPS origin as the gateway or configure a reverse proxy that forwards `/gateway-api` to the gateway. The Admin API must be enabled and must be protected by network access controls, HTTPS, strong credentials, and an operator identity/access-management policy. This UI does not replace gateway-side authorization.

The existing `fintech-examples/fintech-ui` remains the core-user portal for bank search, consent initiation, accounts, balances, transactions, and payment initiation. The existing `consent-ui` remains the PSU SCA and consent authorization interface.
