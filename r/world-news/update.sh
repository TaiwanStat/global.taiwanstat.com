#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
python3 parse_news.py
