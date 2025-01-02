from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv
import re

def scrape_knightconnect():
    # 1. Configure Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")  # Disable GPU
    chrome_options.add_argument("--disable-software-rasterizer")
    chrome_options.add_argument("--window-size=1920,1080")  # Set window size to ensure all elements are visible
    
    # 2. Set a realistic user-agent to avoid potential blocking
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/115.0.0.0 Safari/537.36"
    )
    
    # 3. Initialize the WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    try:
        url = "https://knightconnect.campuslabs.com/engage/events"
        driver.get(url)
        
        # 4. Wait until the event discovery list is present
        wait = WebDriverWait(driver, 20)
        event_list_container = wait.until(
            EC.presence_of_element_located((By.ID, "event-discovery-list"))
        )
        
        # Optional: Scroll to the bottom to ensure all events are loaded (if lazy-loaded)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)  # Wait for additional events to load
        
        # Alternatively, handle "Load More" button if present
        try:
            while True:
                load_more_button = driver.find_element(By.XPATH, '//button[text()="Load More"]')
                load_more_button.click()
                wait.until(EC.staleness_of(load_more_button))
                time.sleep(2)  # Wait for new events to load
        except:
            print("No more 'Load More' buttons found or 'Load More' button not present.")
        
        # 5. Find all event <a> tags within the event discovery list
        event_links = event_list_container.find_elements(
            By.XPATH,
            './/a[contains(@href, "/engage/event/")]'
        )
        print(f"Found {len(event_links)} event links.\n")
        
        # 6. Prepare CSV file for storing event details
        with open('knightconnect_events.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['URL', 'Title', 'Date/Time', 'Location', 'Organization', 'Event Cover Image URL']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # 7. Extract details from each event
            for idx, link in enumerate(event_links, start=1):
                href = link.get_attribute("href")
                
                try:
                    # a) Extract Title from <h3>
                    title_el = link.find_element(By.XPATH, './/h3')
                    title = title_el.text.strip()
                except:
                    title = "(No title found)"
                
                try:
                    # b) Extract Date/Time
                    date_time_el = link.find_element(
                        By.XPATH,
                        './/div[contains(text(), "AM") or contains(text(), "PM")]'
                    )
                    date_time = date_time_el.text.strip()
                except:
                    date_time = "(No date/time found)"
                
                try:
                    # c) Extract Location
                    location_el = link.find_element(
                        By.XPATH,
                        './/div[contains(text(), "Hall") or contains(text(), "Room") or contains(text(), "Campus") or contains(text(), "Parking Lot") or contains(text(), "Online")]'
                    )
                    location = location_el.text.strip()
                except:
                    location = "(No location found)"
                
                try:
                    # d) Extract Hosting Organization
                    org_el = link.find_element(
                        By.XPATH,
                        './/img[@alt and following-sibling::span]'
                    )
                    org_text = org_el.get_attribute("alt").strip()
                    if not org_text:
                        org_text = org_el.find_element(By.XPATH, './following-sibling::span').text.strip()
                except:
                    org_text = "(No organization found)"
                
                try:
                    # e) Extract Event Cover Image URL
                    cover_image_div = link.find_element(
                        By.XPATH,
                        './/div[contains(@style, "background-image")]'
                    )
                    style_attr = cover_image_div.get_attribute("style")
                    # Extract URL from the style attribute
                    match = re.search(r'background-image: url\("(.+?)"\);', style_attr)
                    cover_img_url = match.group(1) if match else "(No cover image URL found)"
                except:
                    cover_img_url = "(No cover image URL found)"
                
                # Write the extracted details to CSV
                writer.writerow({
                    'URL': href,
                    'Title': title,
                    'Date/Time': date_time,
                    'Location': location,
                    'Organization': org_text,
                    'Event Cover Image URL': cover_img_url
                })
                
                # Print the extracted details
                print(f"Event {idx}:")
                print(f"  URL:         {href}")
                print(f"  Title:       {title}")
                print(f"  Date/Time:   {date_time}")
                print(f"  Location:    {location}")
                print(f"  Organization: {org_text}")
                print(f"  Event Cover Image URL: {cover_img_url}")
                print("---")
        
        print("Scraping completed. Event details saved to 'knightconnect_events.csv'.")
    
    except Exception as e:
        print(f"An error occurred: {e}")
    
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_knightconnect()
