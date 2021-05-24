# -*- coding: UTF-8 -*-
import sys 
#reload(sys) 
#sys.setdefaultencoding('utf-8')
import json
import requests
import re
from bs4 import BeautifulSoup
import datetime
i = datetime.datetime.now()

boca_gov_html = requests.get('https://www.boca.gov.tw/sp-trwa-list-1.html', verify=False)
data = {}
# ISO_code_html.encoding = 'gb18030'
# print (ISO_code_html.encoding)


boca_soup = BeautifulSoup(boca_gov_html.text, "html.parser") #get text content of the website
tables = boca_soup.find_all("table", attrs={"class": "table-hover"}) #find the data table

for table in tables:
    tr_list = table.find_all('tr')
    for tr in tr_list:
        # print('tr', tr)
        if tr.find('span') :               #make sure the notice isn't missing
            notice_num = -1
            if not "-" in tr.find('a').text: #filter borders' notice
                notice = tr.find('span').get('class')
                if "gray" in notice:
                    notice_num =0
                elif "yellow" in notice:
                    notice_num =1
                elif "orange" in notice:
                    notice_num =2
                elif "red" in notice:
                    notice_num =3
                
                country_name =  tr.find('td').text.split(' ')[1]
                print(country_name)
                if country_name in data:
                    continue


                inner_link = 'https://www.boca.gov.tw' + tr.find('a').get('href')
                print(inner_link)
                boca_gov_html2 = requests.get(inner_link, verify=False)
                boca_soup2 = BeautifulSoup(boca_gov_html2.text, "html.parser") #get text content of the website
                alert_table = boca_soup2.find('table')
                try:
                    tds = alert_table.find_all('td')
                except:
                    continue
                # country_name =  tds[2].text.split(' ')[0]
                print(country_name)
                if country_name not in data:
                    data[country_name] = {}
                
                data[country_name]['level'] = notice_num
                data[country_name]['reason'] = str(tds[4].text)
                # print (notice_num)

update = str(i.year) + '/' + str(i.month) + '/' + str(i.day)
data['update'] = update
with open('boca_gov_notice.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)
