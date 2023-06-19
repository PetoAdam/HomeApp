from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from xvfbwrapper import Xvfb
from selenium.webdriver.support.ui import WebDriverWait


# Create a new instance of the Firefox driver
driver = webdriver.Firefox()

# Open the webpage
driver.get('http://kabelbox.local')
time.sleep(10)

# Find the input fields and button by their CSS selectors
input_field_password = driver.find_element(By.ID, 'Password')
button = driver.find_element(By.ID, 'LoginBtn')

# Enter data into the input fields
input_field_password.send_keys('NUJREL6M')

# Press the button
button.click()

# Wait for popup
time.sleep(3)

# Do not change the default password
change_button = driver.find_element(By.ID, 'noChange')
change_button.click()

time.sleep(3)
driver.get('http://kabelbox.local/?overview')
time.sleep(10)
html = driver.page_source
time.sleep(3)
with open('result.html', 'w') as f:
    f.write(html)

# Close the browser
driver.quit()
