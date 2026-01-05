/**
 * ADVANCED JSON PARSER FOR LLM RESPONSES
 * Handles malformed JSON from LLM outputs with multiple recovery strategies
 */

interface ParseOptions {
  attemptFix?: boolean
  maxBlocks?: number
  preferFirst?: boolean
  allowPartial?: boolean
}

/**
 * Main parser function for LLM JSON responses
 * Applies multiple strategies to parse potentially malformed JSON
 */
function parseLLMJson(input: string, options: ParseOptions = {}): any {
  const {
    attemptFix = true,
    maxBlocks = 5,
    preferFirst = true,
    allowPartial = false,
  } = options

  if (!input || typeof input !== 'string') {
    return null
  }

  // Trim input
  let cleaned = input.trim()

  // Strategy 1: Try direct parse first
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Continue to next strategy
  }

  if (!attemptFix) {
    return null
  }

  // Strategy 2: Remove BOM and common escapes
  cleaned = cleaned.replace(/^\uFEFF/, '')
  cleaned = cleaned.replace(/\\"/g, '__ESCAPED_QUOTE__')
  cleaned = cleaned.replace(/\\n/g, '\\n')
  cleaned = cleaned.replace(/\\t/g, '\\t')

  // Strategy 3: Fix common LLM mistakes
  cleaned = fixCommonMistakes(cleaned)

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 4: Extract JSON blocks
  const blocks = extractJsonBlocks(cleaned, maxBlocks)
  for (const block of blocks) {
    const fixed = fixCommonMistakes(block)
    try {
      return JSON.parse(fixed)
    } catch (e) {
      // Try next block
    }
  }

  // Strategy 5: Attempt aggressive fixes
  const aggressiveFix = cleanAndFixAggressively(cleaned)
  try {
    return JSON.parse(aggressiveFix)
  } catch (e) {
    return null
  }
}

/**
 * Fix common mistakes in LLM-generated JSON
 */
function fixCommonMistakes(json: string): string {
  let fixed = json

  // Remove trailing commas
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

  // Fix unquoted keys
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

  // Convert single quotes to double quotes (be careful with strings)
  const singleQuotePattern = /'([^'\\]|\\.)*'/g
  fixed = fixed.replace(/'/g, '"')

  // Fix Python booleans and None
  fixed = fixed.replace(/\bTrue\b/g, 'true')
  fixed = fixed.replace(/\bFalse\b/g, 'false')
  fixed = fixed.replace(/\bNone\b/g, 'null')

  // Remove comments
  fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '') // /* */ comments
  fixed = fixed.replace(/\/\/.*$/gm, '') // // comments

  // Fix escaped quotes
  fixed = fixed.replace(/__ESCAPED_QUOTE__/g, '\\"')

  return fixed
}

/**
 * Extract potential JSON blocks from mixed text
 */
function extractJsonBlocks(text: string, maxBlocks: number = 5): string[] {
  const blocks: string[] = []

  // Find objects
  const objectMatches = text.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g)
  for (const match of objectMatches) {
    if (blocks.length >= maxBlocks) break
    blocks.push(match[0])
  }

  // Find arrays
  const arrayMatches = text.matchAll(/\[[^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*\]/g)
  for (const match of arrayMatches) {
    if (blocks.length >= maxBlocks) break
    blocks.push(match[0])
  }

  return blocks
}

/**
 * Aggressively clean and fix JSON
 */
function cleanAndFixAggressively(json: string): string {
  let fixed = json

  // Remove all comments
  fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '')
  fixed = fixed.replace(/\/\/.*$/gm, '')
  fixed = fixed.replace(/#.*$/gm, '')

  // Fix trailing commas in objects and arrays
  fixed = fixed.replace(/,\s*([}\]])/g, '$1')

  // Fix unquoted keys
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

  // Fix single quotes
  fixed = fixed.replace(/'/g, '"')

  // Fix boolean/null values
  fixed = fixed.replace(/\bTrue\b/g, 'true')
  fixed = fixed.replace(/\bFalse\b/g, 'false')
  fixed = fixed.replace(/\bNone\b/g, 'null')
  fixed = fixed.replace(/\bundefined\b/g, 'null')

  // Clean up whitespace
  fixed = fixed.replace(/\s+/g, ' ')

  return fixed
}

// Default export
export default parseLLMJson
