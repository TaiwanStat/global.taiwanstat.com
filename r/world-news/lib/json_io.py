#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import json
import io
  
def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4, ensure_ascii=False)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def load_json(content):
    return json.loads(content)

