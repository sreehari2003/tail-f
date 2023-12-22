# Tail -f

### this is a mocking of tail -f  linux command written in node js when ever the file changed the changes are updated in client side




## Uses Eventsource in client side to check for updates



files changes are read via node js fs api
```js
   const tail = fs.watch(p, (type, file) => {
      // on file change
      if (type === "change") {
        const lines = tailLog(p, 10);

        // Send each line as an event to the client
        lines.forEach((line) => {
          res.write(`data: ${line}\n\n`);
        });
      }
```

Event source api is used in client side

```js
const eventSource = new EventSource("http://localhost:8080/tail");

const outPut = document.querySelector(".tail");

eventSource.addEventListener("message", (event) => {
  outPut.innerHTML += event.data + "\n";

  outPut.scrollTop = outPut.scrollHeight;
});




```