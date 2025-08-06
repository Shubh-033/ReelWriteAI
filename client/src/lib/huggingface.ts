export interface ScriptGenerationParams {
  niche: string;
  contentType: string;
  tone: string;
  length: string;
  notes?: string;
}

export interface GeneratedScript {
  hook: string;
  body: string;
  cta: string;
}

export async function generateScript(params: ScriptGenerationParams, token: string): Promise<GeneratedScript> {
  const response = await fetch('/api/scripts/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate script');
  }

  return response.json();
}

export async function saveScript(
  scriptData: {
    title: string;
    niche: string;
    contentType: string;
    tone: string;
    length: string;
    notes?: string;
    hook: string;
    body: string;
    cta: string;
  },
  token: string
) {
  const response = await fetch('/api/scripts/save', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scriptData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save script');
  }

  return response.json();
}
