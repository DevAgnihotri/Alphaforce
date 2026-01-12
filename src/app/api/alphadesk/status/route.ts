import { NextResponse } from 'next/server';

const OLLAMA_BASE_URL = process.env.OLLAMA_API_URL?.replace('/api/generate', '') || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

export async function GET() {
  try {
    // First check if Ollama is running by hitting the version endpoint
    const versionRes = await fetch(`${OLLAMA_BASE_URL}/api/version`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    if (!versionRes.ok) {
      return NextResponse.json({
        status: 'error',
        ollama: false,
        model: OLLAMA_MODEL,
        modelAvailable: false,
        ollamaVersion: null,
        availableModels: [],
        message: 'Ollama responded with an error',
      });
    }

    const versionData = await versionRes.json();

    // Now check available models
    const tagsRes = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    if (!tagsRes.ok) {
      return NextResponse.json({
        status: 'connected',
        ollama: true,
        model: OLLAMA_MODEL,
        modelAvailable: false,
        ollamaVersion: versionData.version,
        availableModels: [],
        message: 'Ollama running but could not fetch models',
      });
    }

    const tagsData = await tagsRes.json();
    const models = tagsData.models || [];
    const modelNames = models.map((m: { name: string }) => m.name);
    
    // Check for deepseek model specifically
    const modelBaseName = OLLAMA_MODEL.split(':')[0]; // e.g., 'deepseek-r1'
    const hasExactModel = modelNames.some((name: string) => name === OLLAMA_MODEL);
    const hasBaseModel = modelNames.some((name: string) => name.startsWith(modelBaseName));

    return NextResponse.json({
      status: 'connected',
      ollama: true,
      model: OLLAMA_MODEL,
      modelAvailable: hasExactModel || hasBaseModel,
      hasExactModel,
      ollamaVersion: versionData.version,
      availableModels: modelNames,
      message: hasExactModel 
        ? `✓ Ollama running with ${OLLAMA_MODEL}` 
        : hasBaseModel
          ? `✓ Ollama running with compatible ${modelBaseName} model`
          : `⚠ Ollama running but ${OLLAMA_MODEL} not installed. Run: ollama pull ${OLLAMA_MODEL}`,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isConnectionRefused = 
      errorMessage.includes('ECONNREFUSED') || 
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ENOTFOUND') ||
      errorMessage.includes('timeout');

    return NextResponse.json({
      status: 'disconnected',
      ollama: false,
      model: OLLAMA_MODEL,
      modelAvailable: false,
      ollamaVersion: null,
      availableModels: [],
      message: isConnectionRefused 
        ? 'Ollama not running. Start with: ollama serve'
        : `Connection error: ${errorMessage}`,
    });
  }
}
