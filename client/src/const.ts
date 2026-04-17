export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  //const url = new URL(`${oauthPortalUrl}/app-auth`);

  export const getLoginUrl = () => {
    const url = import.meta.env.VITE_AUTH_URL; // ou o nome da sua variável
    console.log("Valor da URL recebida:", url);

    try {
      return new URL(url).href;
    } catch (e) {
      console.error("A URL falhou porque o valor é:", url);
      return "#"; // Retorna um fallback para não quebrar o app enquanto corrigimos
    }
  };
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
