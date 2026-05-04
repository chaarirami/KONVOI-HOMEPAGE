interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { GITHUB_CLIENT_ID } = context.env;
  if (!GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID not configured', { status: 500 });
  }

  const url = new URL(context.request.url);
  const scope = url.searchParams.get('scope') || 'repo,user';
  const callbackUrl = `${url.origin}/api/callback`;

  const state = crypto.randomUUID();

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  githubAuthUrl.searchParams.set('scope', scope);
  githubAuthUrl.searchParams.set('state', state);

  return Response.redirect(githubAuthUrl.toString(), 302);
};
