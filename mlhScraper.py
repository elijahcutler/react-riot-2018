from lxml import html
from bs4 import BeautifulSoup
import requests
import pandas as pd

r = requests.get('https://mlh.io/seasons/na-2019/events.html')
soup = BeautifulSoup(r.text, 'html.parser')
results = soup.find_all('div', attrs={'class':'event-wrapper'})

events = []
for result in results:
    name = result.find('h3').text
    startDate = result.find('meta')['content']
    #endDate = result.find('meta' + 1)['content']
    #city = result.contents[0].contents[8].contents[0].contents[2]
    #state = result.contents[0].contents[6].contents[0].contents[1]
    #image =
    #icon =
    website = result.find('a')['href']
    events.append((name, startDate, website))

df=pd.DataFrame(events, columns=
['name', 'startDate', 'website'])
#df['date'] = pd.to_datetime(df['date'])

df.to_csv('event_data.csv', index=False, encoding='utf-8')
