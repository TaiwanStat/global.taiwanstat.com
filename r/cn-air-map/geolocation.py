#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import csv
import sys
import requests
import time
import StringIO
import os
import json
import geocoder

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

#data = read_json('data.json')
locations = read_json('locations.json')

'''locations = {}
for city in data:
    locations[city] = geocoder.google(u'中国 ' + city).latlng
    time.sleep(1)
    print city, locations[city]

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)'''

write_json('./locations.json', locations)
