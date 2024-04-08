---
title: "Feide"
---

# Feide

For usage, see [OAuth 2.0 provider](/guides/oauth2) or [OpenID Connect provider](/guides/oidc).

```ts
import { Feide } from "arctic";

const feide = new Feide(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await feide.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: FeideTokens = await feide.validateAuthorizationCode(code);
```
