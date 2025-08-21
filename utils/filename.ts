/**
 * Sanitizes a raw string to be safe for use as a filename
 * @param raw - The raw filename string
 * @param ext - File extension to append (default: 'png')
 * @returns Sanitized filename with extension
 */
export function sanitizeFileName(raw: string, ext: string = "png"): string {
  // Trim whitespace and convert to string
  let cleaned = raw.trim();

  // Replace spaces with dashes
  cleaned = cleaned.replace(/\s+/g, "-");

  // Remove all characters except letters, numbers, and dashes
  cleaned = cleaned.replace(/[^a-zA-Z0-9-]/g, "");

  // Collapse multiple consecutive dashes into one
  cleaned = cleaned.replace(/-+/g, "-");

  // Remove leading/trailing dashes
  cleaned = cleaned.replace(/^-+|-+$/g, "");

  // Ensure we have a valid filename
  if (!cleaned) {
    cleaned = "BoxScore";
  }

  // Add extension
  return `${cleaned}.${ext}`;
}
