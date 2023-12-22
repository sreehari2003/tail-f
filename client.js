const eventSource = new EventSource("http://localhost:8080/tail");

const outPut = document.querySelector(".tail");

eventSource.addEventListener("message", (event) => {
  outPut.innerHTML += event.data + "\n";

  outPut.scrollTop = outPut.scrollHeight;
});

eventSource.addEventListener("error", (error) => {
  console.error("EventSource failed:", error);

  // Prevent the default behavior (automatic page reload)
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log("Connection closed");
  } else {
    // Handle the error or take appropriate action
    console.log("Connection error. Reconnecting...");
  }
});

// Close the EventSource connection when the page is closed or refreshed
window.addEventListener("beforeunload", () => {
  eventSource.close();
});
