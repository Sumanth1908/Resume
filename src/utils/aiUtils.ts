/**
 * Simulates AI polishing of resume bullet points.
 * In a real app, this would call an LLM API (OpenAI, Gemini, etc.)
 */
export const polishBulletPoint = async (text: string): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const trimmed = text.trim();
    if (!trimmed) return text;

    // Simple rule-based transformations for demonstration
    // These are common "weak" resume phrases and their "strong" counterparts
    const transformations: Record<string, string> = {
        "worked on": "Spearheaded the development of",
        "helped with": "Collaborated on the execution of",
        "responsible for": "Orchestrated",
        "did some": "Implemented sophisticated",
        "made a": "Engineered a robust",
        "using": "leveraging",
        "good at": "Expertise in",
        "fixed bugs": "Optimized system stability by resolving critical architectural defects",
        "increased sales": "Drove a 25% increase in revenue through strategic market analysis",
        "led a team": "Mentored and managed a high-performing cross-functional team",
        "fast": "expeditious",
        "helped": "facilitated",
        "started": "initiated",
    };

    let polished = trimmed;

    // Apply some simple replacements
    Object.entries(transformations).forEach(([weak, strong]) => {
        const regex = new RegExp(`\\b${weak}\\b`, "gi");
        polished = polished.replace(regex, strong);
    });

    // If no common weak words were found, just add some professional "flair"
    if (polished === trimmed) {
        if (trimmed.length < 50) {
            polished = `Strategically ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)} to maximize organizational impact.`;
        }
    }

    return polished;
};
