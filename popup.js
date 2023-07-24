// popup.js

document.addEventListener("DOMContentLoaded", function () {
    const linksDiv = document.getElementById("links");
    const clearBtn = document.getElementById("clearBtn");
    const addBtn = document.getElementById("addBtn");
    const exportBtn = document.getElementById("exportBtn");
    const openListBtn = document.getElementById("openListBtn");
  
    // Function to get saved links from storage
    function getLinksFromStorage(callback) {
      chrome.storage.local.get("links", function (result) {
        callback(result.links || []);
      });
    }
  
    // Function to save links to storage
    function saveLinksToStorage(links) {
      chrome.storage.local.set({ links: links });
    }
  
  
    // Function to add the current page's URL and title
    function addCurrentPage() {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
          const title = tabs[0].title;
          const url = tabs[0].url;
          if (title && url) {
            addLink(title, url);
            //window.alert("Link saved successfully!")
          }
        }
      });
    }
  
    // Function to add a new link
    function addLink(title, url) {
      getLinksFromStorage(function (links) {
        links.push({ title, url });
        saveLinksToStorage(links);
      });
    }
  
    // Clear links button event
    clearBtn.addEventListener("click", function () {
      saveLinksToStorage([]);
    });
  
    // Add link button event
    addBtn.addEventListener("click", function () {
      addCurrentPage();
    });
  
    // Export links button event
    exportBtn.addEventListener("click", function () {
      getLinksFromStorage(function (links) {
        const content = links.map((link) => `[${link.title}](${link.url})`).join("\n\n");
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement("a");
        a.href = url;
        a.download = "saved_links.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  
    // Function to open the list in a new tab
    function openListInNewTab() {
      getLinksFromStorage(function (links) {
        const content = links.map((link, index) => `<p>${index + 1}. <a href="${link.url}">${link.title}</a></p>`).join("\n");
        const htmlContent = `<!DOCTYPE html>
  <html>
  <head>
    <title>My Saved Links</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      p {
        margin: 5px;
      }
    </style>
  </head>
  <body>
    <h1>My Saved Links</h1>
    ${content}
  </body>
  </html>`;
  
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
  
        const newTab = window.open(url, '_blank');
        newTab.focus();
      });
    }
  
    // Open list in new tab button event
    openListBtn.addEventListener("click", function () {
      openListInNewTab();
    });

  });
  