const MICROSOFT_GRAPH_PROFILE_PHOTO_URLS = [
  "https://graph.microsoft.com/v1.0/me/photos/96x96/$value",
  "https://graph.microsoft.com/v1.0/me/photos/48x48/$value",
  "https://graph.microsoft.com/v1.0/me/photo/$value",
] as const;

const MAX_PROFILE_PHOTO_BYTES = 512 * 1024;

type MicrosoftOAuthTokens = {
  readonly accessToken?: string;
  readonly idToken?: string;
};

type MicrosoftOAuthUser = {
  readonly id: string;
  readonly name?: string;
  readonly email?: string | null;
  readonly image?: string;
  readonly emailVerified: boolean;
};

type MicrosoftOAuthUserInfo = {
  readonly user: MicrosoftOAuthUser;
  readonly data: Record<string, unknown>;
};

type MicrosoftGraphFetch = (
  url: string,
  init: { readonly headers: { readonly Authorization: string } },
) => Promise<Response>;

export async function getMicrosoftOAuthUserInfo(
  tokens: MicrosoftOAuthTokens,
  fetchImpl?: MicrosoftGraphFetch,
): Promise<MicrosoftOAuthUserInfo | null> {
  if (!tokens.idToken) return null;

  const profile = decodeJwtPayload(tokens.idToken);
  if (!profile) return null;

  const id = getStringClaim(profile, "sub");
  if (!id) return null;

  const tokenPicture = getStringClaim(profile, "picture");
  const graphPicture = await fetchMicrosoftGraphProfilePhotoDataUrl(
    tokens.accessToken,
    fetchImpl,
  );
  const image = graphPicture ?? tokenPicture;
  const name = getMicrosoftDisplayName(profile);
  const email =
    getStringClaim(profile, "email") ??
    getStringClaim(profile, "preferred_username") ??
    getStringClaim(profile, "upn") ??
    null;

  const user: MicrosoftOAuthUser = {
    id,
    ...(name !== undefined ? { name } : {}),
    email,
    ...(image !== undefined ? { image } : {}),
    emailVerified: getMicrosoftEmailVerified(profile, email),
  };

  return {
    user,
    data: image ? { ...profile, picture: image } : profile,
  };
}

export async function fetchMicrosoftGraphProfilePhotoDataUrl(
  accessToken: string | undefined,
  fetchImpl: MicrosoftGraphFetch = (url, init) => fetch(url, init),
): Promise<string | undefined> {
  if (!accessToken) return undefined;

  for (const photoUrl of MICROSOFT_GRAPH_PROFILE_PHOTO_URLS) {
    try {
      const response = await fetchImpl(photoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const dataUrl = await readMicrosoftGraphPhotoResponse(response);
      if (dataUrl) return dataUrl;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function decodeJwtPayload(idToken: string): Record<string, unknown> | null {
  const [, payload] = idToken.split(".");
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/gu, "+").replace(/_/gu, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed: unknown = JSON.parse(
      Buffer.from(padded, "base64").toString("utf8"),
    );
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function readMicrosoftGraphPhotoResponse(
  response: Response,
): Promise<string | undefined> {
  if (!response.ok) return undefined;

  const contentType = getMicrosoftGraphPhotoContentType(response);
  if (!contentType) return undefined;

  const photoBytes = await response.arrayBuffer();
  if (
    photoBytes.byteLength === 0 ||
    photoBytes.byteLength > MAX_PROFILE_PHOTO_BYTES
  ) {
    return undefined;
  }

  return `data:${contentType};base64,${Buffer.from(photoBytes).toString("base64")}`;
}

function getMicrosoftGraphPhotoContentType(
  response: Response,
): string | undefined {
  const contentType = response.headers.get("content-type")?.split(";")[0];
  if (contentType?.startsWith("image/")) return contentType;
  return "image/jpeg";
}

function getMicrosoftDisplayName(
  profile: Record<string, unknown>,
): string | undefined {
  const name = getStringClaim(profile, "name");
  if (name) return name;

  const givenName = getStringClaim(profile, "given_name") ?? "";
  const familyName = getStringClaim(profile, "family_name") ?? "";
  return normalizeString(`${givenName} ${familyName}`);
}

function getMicrosoftEmailVerified(
  profile: Record<string, unknown>,
  email: string | null,
): boolean {
  const emailVerified = profile.email_verified;
  if (typeof emailVerified === "boolean") return emailVerified;
  if (!email) return false;

  return (
    hasStringClaim(profile, "verified_primary_email", email) ||
    hasStringClaim(profile, "verified_secondary_email", email)
  );
}

function hasStringClaim(
  profile: Record<string, unknown>,
  claim: string,
  expectedValue: string,
): boolean {
  const value = profile[claim];
  return Array.isArray(value) && value.includes(expectedValue);
}

function getStringClaim(
  profile: Record<string, unknown>,
  claim: string,
): string | undefined {
  return normalizeString(profile[claim]);
}

function normalizeString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
