import puppeteer from "puppeteer";

export async function scrapeZillow(city: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Replace spaces with '-' for Zillow URL format
  const cityUrl = city.replace(/\s+/g, "-");
  const url = `https://www.zillow.com/homes/${cityUrl}_rb/`;

  await page.goto(url, { waitUntil: "networkidle2" });

  const listings = await page.evaluate(() => {
    const items: any[] = [];
    const cards = document.querySelectorAll(".list-card-info, .list-card-heading");
    
    cards.forEach((card) => {
      const price = (card.querySelector(".list-card-price") as HTMLElement)?.innerText || "";
      const address = (card.querySelector(".list-card-addr") as HTMLElement)?.innerText || "";
      const bedsBaths = (card.querySelector(".list-card-details li") as HTMLElement)?.innerText || "";
      items.push({ price, address, bedsBaths });
    });

    return items;
  });

  await browser.close();
  return listings;
}
