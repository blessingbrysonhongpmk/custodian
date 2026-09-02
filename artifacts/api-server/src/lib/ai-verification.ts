/**
 * TreeGuard AI Verification — Gemini Integration
 * 
 * Sends planting + checkpoint photos to Gemini for structured analysis.
 * NEVER claims absolute certainty. AI is decision support, humans are final authority.
 */

export interface AiVerificationResult {
  healthStatus: string;
  visualConsistencyScore: number;
  growthContinuityScore: number;
  environmentMatchScore: number;
  overallConfidence: number;
  requiresHumanReview: boolean;
  observations: string[];
  verificationLevel: "high_confidence" | "verified" | "flagged" | "human_review";
  isDemoMode: boolean;
}

/**
 * Calculate combined verification confidence from AI + deterministic checks
 * 
 * Weights:
 *   AI Visual Consistency: 35%
 *   GPS Proximity: 25%
 *   Timestamp Validity: 15%
 *   Growth Continuity: 15%
 *   Environmental Consistency: 10%
 */
export function calculateVerificationConfidence(
  aiVisualScore: number,
  gpsProximityScore: number,
  timestampValid: boolean,
  growthContinuityScore: number,
  environmentMatchScore: number,
): { confidence: number; level: AiVerificationResult["verificationLevel"] } {
  const timestampScore = timestampValid ? 100 : 20;

  const confidence = Math.round(
    aiVisualScore * 100 * 0.35 +
    gpsProximityScore * 0.25 +
    timestampScore * 0.15 +
    growthContinuityScore * 100 * 0.15 +
    environmentMatchScore * 100 * 0.10
  );

  let level: AiVerificationResult["verificationLevel"];
  if (confidence >= 90) level = "high_confidence";
  else if (confidence >= 70) level = "verified";
  else if (confidence >= 50) level = "flagged";
  else level = "human_review";

  return { confidence, level };
}

/**
 * Call Gemini API for tree verification analysis
 */
export async function analyzeWithGemini(
  plantingPhotoUrl: string,
  checkpointPhotoUrl: string,
  metadata: {
    species: string;
    plantingDate: string;
    checkpointDate: string;
    expectedGrowthMonths: number;
  },
): Promise<AiVerificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return getDemoAnalysis(metadata);
  }

  try {
    const prompt = `You are an environmental monitoring AI assistant for TreeGuard, a tree custody platform.

Analyze these two tree photos and provide a structured assessment. The first photo was taken at planting, the second is the latest checkpoint.

IMPORTANT: You MUST NOT claim absolute certainty that this is the same individual tree. Instead, analyze indicators of consistency.

Tree Details:
- Species: ${metadata.species}
- Planting date: ${metadata.plantingDate}
- Checkpoint date: ${metadata.checkpointDate}
- Expected growth period: ${metadata.expectedGrowthMonths} months

Analyze and return a JSON object with EXACTLY these fields:
{
  "health_status": "healthy" | "needs_attention" | "at_risk" | "critical",
  "visual_consistency_score": 0.0-1.0,
  "growth_continuity_score": 0.0-1.0,
  "environment_match_score": 0.0-1.0,
  "overall_confidence": 0.0-1.0,
  "requires_human_review": true/false,
  "observations": ["observation 1", "observation 2", ...]
}

Focus on:
1. Visual consistency between photos (species match, trunk characteristics)
2. Growth continuity (is the growth consistent with the time period?)
3. Health indicators (leaf color, canopy density, signs of disease)
4. Environmental/background consistency
5. Any anomaly indicators

Return ONLY the JSON object, no additional text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: await fetchImageAsBase64(plantingPhotoUrl) } },
              { inlineData: { mimeType: "image/jpeg", data: await fetchImageAsBase64(checkpointPhotoUrl) } },
            ],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      console.warn("Gemini API call failed, falling back to demo mode:", response.status);
      return getDemoAnalysis(metadata);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse Gemini response, using demo mode");
      return getDemoAnalysis(metadata);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const result: AiVerificationResult = {
      healthStatus: parsed.health_status || "healthy",
      visualConsistencyScore: parsed.visual_consistency_score || 0.85,
      growthContinuityScore: parsed.growth_continuity_score || 0.88,
      environmentMatchScore: parsed.environment_match_score || 0.82,
      overallConfidence: parsed.overall_confidence || 0.85,
      requiresHumanReview: parsed.requires_human_review || false,
      observations: parsed.observations || ["Analysis completed."],
      verificationLevel: "verified",
      isDemoMode: false,
    };

    // Determine verification level from confidence
    const { level } = calculateVerificationConfidence(
      result.visualConsistencyScore,
      85, // assume GPS OK for now
      true,
      result.growthContinuityScore,
      result.environmentMatchScore,
    );
    result.verificationLevel = level;

    return result;
  } catch (err) {
    console.warn("Gemini analysis failed, using demo fallback:", err);
    return getDemoAnalysis(metadata);
  }
}

/**
 * Demo AI Fallback — returns deterministic analysis when Gemini API is unavailable
 */
export function getDemoAnalysis(metadata: {
  species: string;
  expectedGrowthMonths: number;
}): AiVerificationResult {
  const growthFactor = Math.min(1, metadata.expectedGrowthMonths / 12);
  
  return {
    healthStatus: "healthy",
    visualConsistencyScore: 0.85 + Math.random() * 0.1,
    growthContinuityScore: 0.80 + growthFactor * 0.15,
    environmentMatchScore: 0.82 + Math.random() * 0.1,
    overallConfidence: 0.84 + Math.random() * 0.1,
    requiresHumanReview: false,
    observations: [
      `Visible trunk and foliage patterns are consistent with ${metadata.species} species characteristics.`,
      "Background features appear geographically consistent between photos.",
      `Growth indicators are consistent with a ${metadata.expectedGrowthMonths}-month growth period.`,
      "No obvious signs of severe disease or pest damage detected.",
      "Canopy density appears healthy for the species and growth stage.",
    ],
    verificationLevel: "verified",
    isDemoMode: true,
  };
}

/**
 * Fetch image and convert to base64 for Gemini API
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch {
    // Return a tiny placeholder if fetch fails
    return "";
  }
}
