import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://auth.dataporten.no/oauth/authorization";
const tokenEndpoint = "https://auth.dataporten.no/oauth/token";

export class Feide implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(code: string): Promise<FeideTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: FeideTokens = {
			accessToken: result.access_token,
			tokenType: result.token_type,
			expiresAt: new Date().getTime() / 1000 + result.expires_in,
			scope: result.scope,
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	id_token: string;
}

export interface FeideTokens {
	accessToken: string;
	tokenType: string;
	expiresAt: number;
	scope: string;
	idToken: string;
}
