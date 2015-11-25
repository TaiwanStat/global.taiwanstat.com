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

boca_gov_html = requests.get('http://www.boca.gov.tw/lp.asp?ctNode=754&CtUnit=32&BaseDSD=13&mp=1')
data = {}
# ISO_code_html.encoding = 'gb18030'
# print (ISO_code_html.encoding)


boca_soup = BeautifulSoup(boca_gov_html.text, "html.parser") #get text content of the website
boca_table = boca_soup.find("div", attrs={"class": "content_box"}) #find the data table

country_name_content = boca_table.find_all('a')
notice_content = boca_table.find_all('strong')
collection_country_event = boca_table.find_all('li')
for c in collection_country_event:
    if c.find('strong') :               #make sure the notice isn't missing
        notice_num = -1
        if not "-" in c.find('a').text: #filter borders' notice
            notice = c.find('strong').text[:1]
            if "灰" in notice:
                notice_num =0
            elif "黃" in notice:
                notice_num =1
            elif "橙" in notice:
                notice_num =2
            elif "紅" in notice:
                notice_num =3

            inner_link = 'http://www.boca.gov.tw/' + c.find('a').get('href')
            boca_gov_html2 = requests.get(inner_link)
            boca_soup2 = BeautifulSoup(boca_gov_html2.text, "html.parser") #get text content of the website
            alert_table = boca_soup2.find_all('table')[1].find_all('table')
            country_name =  alert_table[1].find_all('tr')[-1].td.text
            if country_name not in data:
                data[country_name] = {}
            
            data[country_name]['level'] = notice_num
            data[country_name]['reason'] = str(alert_table[2])
            print (notice_num)

update = str(i.year) + '/' + str(i.month) + '/' + str(i.day)
data['update'] = update
with open('boca_gov_notice.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)
