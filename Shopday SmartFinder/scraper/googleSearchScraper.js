export function isShoppingTabSecond() {
  const tabs = Array.from(document.querySelectorAll('a.q.qs'));
  return tabs[1]?.innerText.toLowerCase().includes('shopping');
}

export function extractGoogleSearchResults() {
  const results = [];
  document.querySelectorAll('div.g').forEach(result => {
    const title = result.querySelector('h3')?.innerText;
    const url = result.querySelector('a')?.href;
    const snippet = result.querySelector('.VwiC3b')?.innerText;
    if (title && url) {
      results.push({ title, url, snippet });
    }
  });
  return results;
}
