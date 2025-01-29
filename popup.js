document.addEventListener("DOMContentLoaded", () => {
  const cookiesList = document.getElementById("cookies-list");
  const deleteAllButton = document.getElementById("delete-all"); // Button to delete all cookies

  // To get the active tab's URL (using chrome.tabs.query API)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;  // URL of the current tab
    const domain = new URL(url).hostname; // Retrieve the domain from URL
    console.log("Active tab domain:", domain);

    // To fetch all the cookies for the domain
    chrome.cookies.getAll({ domain }, (cookies) => {
      cookiesList.innerHTML = ""; // Format the list initially

      // Display messge if no cookies are found
      if (cookies.length == 0) {
        cookiesList.innerHTML = "<p>No cookies found for this site.</p>";
        return;
      }

      //Display each cookie
      cookies.forEach((cookie) => {
        const cookieItem = document.createElement("div"); // Create a container for the cookie
        cookieItem.textContent = `${cookie.name}: ${cookie.value}`;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
          chrome.cookies.remove({
            url: `https://${domain}${cookie.path}`, // URL of the cookie
            name: cookie.name, // Name of the cookie
          });
          cookieItem.remove(); // Remove the cookie entry from the list
        });

        // Append the delete button to the cookie item
        cookieItem.appendChild(deleteButton);

        // Append the cookie item to the cookies list
        cookiesList.appendChild(cookieItem);
      });
    });
  });

  // Functionality to delete all cookies for the domain
  deleteAllButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
      const url = tabs[0].url;
      const domain = new URL(url).hostname;

      // Fetch all the cookies
      chrome.cookies.getAll({ domain }, (cookies) => {
        cookies.forEach((cookie) => { // Loop over all the cookies for the domain to remove each one
          chrome.cookies.remove({
            url: `https://${domain}${cookie.path}`, name: cookie.name, 
          });
        });

        // Update the Page to notify all the cookies are deleted
        cookiesList.innerHTML = "<p>All cookies deleted!</p>";
      });
    });
  });



});