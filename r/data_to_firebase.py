import subprocess
from firebase import firebase

taiwanstat_firebase = firebase.FirebaseApplication('https://realtaiwanstat.firebaseio.com', None)

result = ''
with open('./world-news/data/data.json', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/world_news', uv_data)
print (result)

with open('./cn-air-map/data/data.json', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/cn-air-map', uv_data)
print (result)
