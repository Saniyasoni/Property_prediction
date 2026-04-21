const API_BASE = 'http://localhost:8000';

/**
 * Compare two properties by address.
 * @param {string} address1 - First property address
 * @param {string} address2 - Second property address
 * @returns {Promise<{property1: Object, property2: Object}>}
 */
export async function compareProperties(address1, address2) {
  const response = await fetch(`${API_BASE}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address1, address2 }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch all available mock addresses from the backend.
 * @returns {Promise<string[]>}
 */
export async function fetchAddresses() {
  const response = await fetch(`${API_BASE}/api/addresses`);

  if (!response.ok) {
    throw new Error(`Failed to fetch addresses: ${response.status}`);
  }

  const data = await response.json();
  return data.addresses;
}
