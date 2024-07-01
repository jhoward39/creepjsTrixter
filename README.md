1. Off the bat, I tried puppeteer extensions, turns out I'm not the only one who can google 'how to be like...extra stealthy with puppeteer'. 
  My trust score was 0.

[creepjs_page_1.pdf](https://github.com/user-attachments/files/16047512/creepjs_page_1.pdf)

2. I went with raw pupeteer and my trust score is *technically* better (0% -> 54%)

[creepjs_page_1-1.pdf](https://github.com/user-attachments/files/16047535/creepjs_page_1-1.pdf)

3. I tried changing browsers to brave and firefox (puppeteer-firefox), that made things worse. It seems the more I try to add privacy the more it hates it. I don't see a clear breakdown of what is counting against me as the points in the first box don't add up. 

4. I am starting to dial in on what IS affecting my score. I'm unsure how the score is calculated or what is counting against me other than visits and alive (-35), but I am getting points for loose fp being low and shadow (+7). However, 100-35+7 ≠ 54 so I'm unsure where that 54% is coming from. 

5. I tried clearing browser cookies. No dice.
   async function clearBrowserData(page) {
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');
}

6. I tried randow mouse movements. I think it's not worth making a routine for the mouse that mimics a human becasue it's not tracking mouse movement: async function simulateHumanInteractions(page) {
  await page.mouse.move(Math.random() * 500, Math.random() * 500);
  await sleep(Math.random() * 2000);
  await page.keyboard.type('test', { delay: Math.random() * 100 });
}


7. VPN Has no affect. Running out of time. goal is to just get rid of the -25!

8.  I went into the network setting of the page adn tried to set my user agent to the same user agent 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' That made things worse. 38%! :-(

9. Now I'm getting trickier, I tried hijacking the api response:
Only thing is it did not work and I got an API access denied. 

10. I tried making a service worker. Alas. No dice.
