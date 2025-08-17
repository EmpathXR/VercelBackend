// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const user_message = body.message;

  const system_prompt = `You are a helpful AI assistant and help users.`;

  // Call OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_message },
      ],
    }),
  });

  const data = await response.json();

  return Response.json({
    message: data.choices?.[0]?.message?.content ?? "No response",
  });
}

export async function GET() {
  return Response.json({ message: "Hello User!" });
}
