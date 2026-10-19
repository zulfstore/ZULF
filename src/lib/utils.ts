export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs. 0';
  }
  return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
}

/**
 * Validates Pakistani mobile phone numbers:
 * Must match 03XX-XXXXXXX, 03XXXXXXXXX, or +923XXXXXXXXX
 */
export function validatePakistaniPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone) {
    return { isValid: false, normalized: '', error: 'Phone number is required' };
  }
  
  // Strip spaces, dashes, parentheses
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  
  // Format: 03001234567 (11 digits starting with 03)
  if (/^03\d{9}$/.test(clean)) {
    return { isValid: true, normalized: clean };
  }
  
  // Format: +923001234567 (13 digits starting with +923)
  if (/^\+923\d{9}$/.test(clean)) {
    return { isValid: true, normalized: '0' + clean.slice(3) };
  }

  // Format: 923001234567 (12 digits starting with 923)
  if (/^923\d{9}$/.test(clean)) {
    return { isValid: true, normalized: '0' + clean.slice(2) };
  }

  return {
    isValid: false,
    normalized: clean,
    error: 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567)'
  };
}

export function formatPhoneDisplay(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11 && clean.startsWith('03')) {
    return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  }
  return phone;
}

export function createWhatsAppLink(phone: string, message: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('03')) {
    clean = '92' + clean.slice(1);
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
