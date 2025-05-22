
/**
 * Format a date string to a user-friendly format
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Format a date with time
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Format an address to a string
 */
export function formatAddress(address: {
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}): string {
  const parts = [
    address.address_line1,
    address.address_line2,
    address.city,
    `${address.state} ${address.postal_code}`,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Format a name
 */
export function formatName(firstName?: string | null, lastName?: string | null): string {
  if (!firstName && !lastName) return 'Customer';
  return [firstName, lastName].filter(Boolean).join(' ');
}

/**
 * Format order status to user-friendly text with proper capitalization
 */
export function formatOrderStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Format tracking number with a link if carrier is known
 */
export function formatTrackingNumber(number: string, carrier?: string): { text: string; url?: string } {
  if (!number) return { text: 'Not available' };
  
  // Map of known carriers and their tracking URL formats
  const carrierMap: Record<string, string> = {
    'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${number}`,
    'ups': `https://www.ups.com/track?tracknum=${number}`,
    'fedex': `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`,
    'dhl': `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${number}`,
  };
  
  const normalizedCarrier = carrier?.toLowerCase();
  const trackingUrl = normalizedCarrier ? carrierMap[normalizedCarrier] : undefined;
  
  return {
    text: number,
    url: trackingUrl
  };
}

/**
 * Format a phone number
 */
export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}
