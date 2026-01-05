/**
 * ERROR BOUNDARY UTILITIES - Helper functions for error handling
 */

interface ErrorDetails {
  type: 'react_error' | 'api_error' | 'parse_error' | 'network_error' | 'unknown'
  message: string
  stack?: string
  timestamp: string
  userAgent: string
  url: string
}

export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export const sendErrorToParent = (error: ErrorDetails): void => {
  if (!isInIframe()) return
  try {
    window.parent.postMessage(
      { type: 'CHILD_APP_ERROR', source: 'architect-child-app', payload: error },
      '*'
    )
  } catch (e) {
    console.error('Failed to send error to parent:', e)
  }
}

export const generateFixPrompt = (error: ErrorDetails): string => {
  let prompt = `Fix the following CRITICAL error in the child application:\n\n`
  prompt += `**Error Type:** ${error.type}\n`
  prompt += `**Error Message:** ${error.message}\n`
  if (error.stack) {
    prompt += `**Stack Trace:** \`\`\`\n${error.stack.substring(0, 500)}\n\`\`\`\n`
  }
  prompt += `\n**Instructions:** Analyze and fix the code. This is a critical error that requires immediate resolution.`
  return prompt
}

export const requestFixFromParent = (error: ErrorDetails): void => {
  if (!isInIframe()) return
  try {
    window.parent.postMessage(
      {
        type: 'FIX_ERROR_REQUEST',
        source: 'architect-child-app',
        payload: { ...error, action: 'fix', fixPrompt: generateFixPrompt(error) },
      },
      '*'
    )
  } catch (e) {
    console.error('Failed to send fix request:', e)
  }
}
