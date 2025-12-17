import { resolveMx } from 'dns/promises';

export interface VerificationResult {
  email: string;
  valid: boolean;
  reason?: string;
}

/**
 * Basic email regex validation
 */
function isValidEmailSyntax(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email domain has MX records
 */
async function hasMxRecords(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1];
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

/**
 * Verify email using basic checks (no API key required)
 */
export async function verifyEmailBasic(email: string): Promise<VerificationResult> {
  // Check syntax
  if (!isValidEmailSyntax(email)) {
    return {
      email,
      valid: false,
      reason: 'Invalid email syntax',
    };
  }

  // Check MX records
  const hasMx = await hasMxRecords(email);
  if (!hasMx) {
    return {
      email,
      valid: false,
      reason: 'Domain has no MX records',
    };
  }

  return {
    email,
    valid: true,
  };
}

/**
 * Verify email using Hunter.io (if API key is provided)
 */
export async function verifyEmailWithHunter(email: string): Promise<VerificationResult> {
  if (!process.env.HUNTER_API_KEY) {
    return verifyEmailBasic(email);
  }

  try {
    const response = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${process.env.HUNTER_API_KEY}`
    );
    const data = await response.json();

    if (data.data?.result === 'deliverable') {
      return {
        email,
        valid: true,
        reason: data.data.result,
      };
    } else {
      return {
        email,
        valid: false,
        reason: data.data?.result || 'Invalid email',
      };
    }
  } catch {
    // Fallback to basic verification
    return verifyEmailBasic(email);
  }
}

/**
 * Verify multiple emails in batch
 */
export async function verifyEmailsBatch(
  emails: string[],
  useAPI: boolean = false
): Promise<VerificationResult[]> {
  const results = await Promise.all(
    emails.map((email) => (useAPI ? verifyEmailWithHunter(email) : verifyEmailBasic(email)))
  );
  return results;
}
