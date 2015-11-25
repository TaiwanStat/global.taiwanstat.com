import json
import requests
from bs4 import BeautifulSoup

ISO_code_html = requests.get('https://en.wikipedia.org/wiki/ISO_3166-1')
data = {}
# ISO_code_html.encoding = 'gb18030'
# print (ISO_code_html.encoding)


ISO_soup = BeautifulSoup(ISO_code_html.text, "html.parser") #get text content of the website
ISO_table = ISO_soup.find("table", attrs={"class": "wikitable"}) #find the data table
rows = ISO_table.find_all('tr')  #get each row
for row in rows:
    cols = row.find_all('td')
    cols = [ele.text.strip() for ele in cols]

    if len(cols) <= 2:		#avoid haed
        continue

    data[cols[0]] = cols[2] 
    # data.append([ele for ele in cols if ele]) # Get rid of empty values

with open('country_abbr.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)
