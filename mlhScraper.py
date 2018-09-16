from lxml import html
from bs4 import BeautifulSoup
import requests
import pandas as pd

r = requests.get('https://mlh.io/seasons/eu-2017/events.html')
soup = BeautifulSoup(r.text, 'html.parser')
results = soup.find_all('div', attrs={'class':'event-wrapper'})

events = []
for result in results:
    name = result.find('h3').text
    startDate = result.find(itemprop="startDate")['content']
    endDate = result.find(itemprop="endDate")['content']
    city = result.find(itemprop="addressLocality").text
    state = result.find(itemprop="addressRegion").text
    image = result.find('div', attrs={'class':'image-wrap'}).contents[0]['src']
    icon = result.find('div', attrs={'class':'event-logo'}).contents[0]['src']
    website = result.find('a')['href']
    events.append((name, startDate, endDate, city, state, image, icon, website))

df=pd.DataFrame(events, columns=
['name', 'startDate', 'endDate', 'city', 'state', 'image', 'icon', 'website'])
#df['date'] = pd.to_datetime(df['date'])

df.to_csv('event_data.csv', index=False, encoding='utf-8')
