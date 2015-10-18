import subprocess
from firebase import firebase

subprocess.call("git pull", shell=True)

taiwanstat_firebase = firebase.FirebaseApplication('https://realtaiwanstat.firebaseio.com', None)


with open('./data/data.json', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/world_news', uv_data)
print (result)
