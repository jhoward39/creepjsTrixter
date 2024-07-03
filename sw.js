self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.url.includes('creepjs-api.web.app/fp')) {
    event.respondWith(
      fetch(request).then(response => {
        return response.text().then(body => {
          let data = JSON.parse(body);
          data.traced = 0;
          data.supervised = 0;
          let modifiedBody = JSON.stringify(data);
          return new Response(modifiedBody, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        });
      })
    );
  }
});

