const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const handler = async (request: Request): Promise<Response> => {
    const { email, list } = await request.json();

    if (!email || !list) {
      return new Response(
        JSON.stringify({ error: 'Something went wrong.' }),
        {
          status: 505,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Something went wrong.' }),
      {
        status: 506,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    }

    const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'groceries@spillt.co',
      to: email,
      subject: 'Your Grocery List',
      html: '<strong>Your Grocery List</strong><br><p>'+list+'</p><br><b>Like to cook? Check out <a href="https://spillt.co/download">Spillt!</a></b>',
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

Deno.serve(handler)
