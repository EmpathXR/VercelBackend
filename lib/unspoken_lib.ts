"use server";

// Simple helper to get a param from GET query or POST body
export async function extractParam(req: Request, body: any, paramName: string): Promise<string | null> {
    let paramValue: string | null = null;

    if (req.method === 'GET') {
        const url = new URL(req.url);
        paramValue = url.searchParams.get(paramName);
    }

    if (!paramValue && req.method === 'POST') {
        paramValue = body[paramName] || null;
    }

    if (!paramValue) {
        paramValue = req.headers.get(paramName);
    }

    return paramValue;
}
