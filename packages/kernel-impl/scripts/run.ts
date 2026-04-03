const main = async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.google.com");
  await page.waitForTimeout(10000);
  await browser.close();
};

main();