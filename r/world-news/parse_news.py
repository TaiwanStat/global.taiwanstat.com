#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
from lib import json_io
import requests
from bs4 import BeautifulSoup

def is_match_country (title, countries):
    for country in countries:
        if len(country) == 3 and title.startswith(country):
            return country
        elif country in title:
            return country
    return False

html_doc = requests.get('http://www.bbc.com/zhongwen/trad/world').text
soup = BeautifulSoup(html_doc, "html5lib")
articles = soup.select(".eagle .eagle-item")

country_list = json_io.read_json('./data/tw.json')

'''lang = json_io.read_json('./data/lang.json')
country_list = []
for en, country in lang.iteritems():
    if country['tw']:
        country_list.append(country['tw'])
json_io.write_json('tw.json', country_list)'''

geo = json_io.read_json('./data/latlng.json')

pages = []
has_counties = []
for article in articles:
    title_link = article.select('.title-link')
    if title_link:
        title = title_link[0].text.replace(' ', '').replace('\n', '')
        country = is_match_country(title, country_list)
        if not country or country in has_counties:
            continue

        link = 'http://www.bbc.com' + title_link[0].get('href')
        body = article.select('.eagle-item__summary')[0].text
        img = article.select('.responsive-image .js-delayed-image-load')
        if img:
            if not img[0].get('data-src'):
                print(img)
            img = img[0].get('data-src')

        date = article.select('.date')[0].get('data-datetime')

        pages.append({'title': title, 'link': link, 'body': body, 'country': country, \
                'img': img, 'latlng': geo[country], 'date': date})
        has_counties.append(country)

for page in pages:
    img = ''
    html_doc = requests.get(page['link']).text
    soup = BeautifulSoup(html_doc, "html5lib")
    span = soup.select('.image-and-copyright-container')
    if span:
        img = span[0].select('img')
    if img:
        print(img)
        page['img'] = img[0].get('src')


json_io.write_json('./data/data.json', pages)


if __name__=='__main__':
    pass
