import URLs from '../constants/URLs';

export async function fetchStufenData() {
  const response = await fetch(`${URLs.INFOBOX_BASE_URL}stufen/`);
  if (!response.ok) {
    throw new Error('Failed to fetch stufen data');
  }
  return await response.json();
}

export function handleStufenError(error: Error) {
  console.error('Error fetching stufen data:', error);
}