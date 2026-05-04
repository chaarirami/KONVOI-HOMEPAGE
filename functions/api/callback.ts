interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(postMessageHTML('error', 'Missing code parameter'), {
      status: 400,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = (await tokenRes.json()) as { access_token?: string; error?: string; error_description?: string };

    if (data.error || !data.access_token) {
      return new Response(postMessageHTML('error', data.error_description || data.error || 'Token exchange failed'), {
        status: 200,
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    return new Response(postMessageHTML('success', data.access_token), {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  } catch (err) {
    return new Response(postMessageHTML('error', 'OAuth token exchange failed'), {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }
};

function postMessageHTML(status: 'success' | 'error', content: string): string {
  const message =
    status === 'success'
      ? `authorization:github:success:${JSON.stringify({ token: content, provider: 'github' })}`
      : `authorization:github:error:${JSON.stringify({ message: content })}`;

  return `<!doctype html>
<html><body><script>
(function() {
  window.opener.postMessage(${JSON.stringify(message)}, window.origin);
  window.close();
})();
</script></body></html>`;
}
