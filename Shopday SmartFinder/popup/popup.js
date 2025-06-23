chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: () => {
      return window.__SHOPPING_DATA__;
    },
  }, (results) => {
    document.getElementById("jsonOutput").textContent = JSON.stringify(results[0].result, null, 2);
  });
});
