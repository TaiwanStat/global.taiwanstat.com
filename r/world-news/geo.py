#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
from lib import json_io
import geocoder
import time


lang = json_io.read_json('./data/lang.json')
country_dic = {}
for en, country in iter(lang.items()):
    name = country['tw']
    if name:
        latlng = geocoder.google(en).latlng
        country_dic[name] = latlng
    time.sleep(1)

json_io.write_json('latlng.json', country_dic)
