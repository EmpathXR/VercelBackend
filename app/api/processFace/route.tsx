import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {
  return Response.json({ message: "Hello Hello!" });
}


export async function POST(req: Request) {
  try {

    const body = await req.json();

    console.error("body " + JSON.stringify(body));
    // Expect body: { image_url: "https://..." } OR { image_base64: "data:image/png;base64,..." }
    const { image_base64 } = body;

    if (!image_base64) {
      return Response.json(
        { error: "Please provide or image_base64 in request body." },
        { status: 400 }
      );
    }

    const messages: any = [
      {
        role: "system",
        content: `You are an assistant that classifies emotions in images. 
                  Respond with exactly one word: "neutral", "happy", "sad", or "angry".`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Classify the emotion in this image." },
          { type: 'image', image: image_base64 },
        ],
      },
    ];



    const { object } = await generateObject({
      model: openai("gpt-4o"), // vision-enabled
      schema: z.object({
        emotion: z.enum(["neutral", "happy", "sad", "angry"]),
      }),
      messages,
    });

    return Response.json({ emotion: object.emotion });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to process image." }, { status: 500 });
  }
}


