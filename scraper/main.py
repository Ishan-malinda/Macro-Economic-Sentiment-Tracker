import asyncio
import os
import requests
from playwright.async_api import async_playwright
from utils.cleaner import clean_number, calculate_sentiment
from dotenv import load_dotenv
import datetime

load_dotenv()

TODAY = datetime.date.today().isoformat()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def insert_to_supabase(events):
    if not events:
        return
    
    url = f"{SUPABASE_URL}/rest/v1/economic_events"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    try:
        response = requests.post(url, headers=headers, json=events)
        response.raise_for_status()
        print(f"Successfully inserted {len(events)} events.")
    except Exception as e:
        print(f"Error inserting into Supabase: {e}")

async def scrape_calendar():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a real user agent to avoid being blocked
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print("Navigating to Investing.com Economic Calendar...")
        await page.goto("https://www.investing.com/economic-calendar/", wait_until="domcontentloaded", timeout=60000)
        
        # Wait a bit for JS to settle
        await asyncio.sleep(10)
        
        # Using more stable selectors found during research
        table_selector = 'table[class*="datatable-v2_table"]'
        row_selector = 'tr[class*="datatable-v2_row"]'
        
        try:
            await page.wait_for_selector(table_selector, timeout=15000)
        except:
            print("Table not found. Capturing debug screenshot...")
            await page.screenshot(path="debug_table_not_found.png")
            await browser.close()
            return []
            
        rows = await page.query_selector_all(row_selector)
        print(f"Found {len(rows)} potential rows.")
        
        events_to_insert = []
        
        for row in rows:
            try:
                # Skip header rows (they have colspan or specific classes)
                cells = await row.query_selector_all("td")
                if len(cells) < 7:
                    continue
                
                time_val = await cells[1].inner_text()
                currency_val = await cells[2].inner_text()
                event_name = await cells[3].inner_text()
                impact_cell = cells[4]
                actual_text = await cells[5].inner_text()
                forecast_text = await cells[6].inner_text()
                
                # Impact calculation: count active bull heads
                impact_icons = await impact_cell.query_selector_all("svg")
                impact_level = 0
                for icon in impact_icons:
                    cls = await icon.get_attribute("class")
                    # Investing.com uses opacity-60 for filled bull heads
                    if cls and "opacity-60" in cls:
                        impact_level += 1
                
                impact_str = "High" if impact_level >= 3 else "Medium" if impact_level == 2 else "Low"
                
                actual_num = clean_number(actual_text)
                forecast_num = clean_number(forecast_text)
                
                sentiment = calculate_sentiment(event_name, actual_num, forecast_num)
                
                # Check for empty currency to filter out non-event rows
                if not currency_val.strip():
                    continue

                events_to_insert.append({
                    "event_date": TODAY,
                    "event_time": time_val.strip(),
                    "currency": currency_val.strip(),
                    "event_name": event_name.strip(),
                    "impact": impact_str,
                    "actual": actual_text.strip(),
                    "forecast": forecast_text.strip(),
                    "actual_num": actual_num,
                    "forecast_num": forecast_num,
                    "sentiment_flag": sentiment
                })
                print(f"Parsed: {event_name.strip()} ({currency_val.strip()}) - Impact: {impact_str}")
                
            except Exception as e:
                # print(f"Error parsing row: {e}")
                continue
                
        await browser.close()
        return events_to_insert

async def main():
    events = await scrape_calendar()
    if events:
        print(f"Scraped {len(events)} events. Inserting to database...")
        insert_to_supabase(events)
    else:
        print("No events found to insert.")

if __name__ == "__main__":
    asyncio.run(main())
