from lib import csv_io
from lib import json_io
import sys

data = csv_io.read_csv(sys.argv[1])
code = csv_io.read_csv(sys.argv[2])

state_hash = { \
        "LAC": {
            "latitude": "-15",\
            "longitude": "-61",\
            "code": "LCN"\
        },\
        "ECA": {\
            "latitude": "61.3",\
            "longitude": "60",\
            "code": "ECS"\
        }, \
        "EAP": {\
            "latitude": "30.8",\
            "longitude": "120",\
            "code": "EAS"\
        },\
        "MNA": {\
            "latitude": "20.3",\
            "longitude": "45.7",\
            "code": "MEA"\
        },\
        "NAC": {\
            "latitude": "41",\
            "longitude": "-103",\
            "code": "NAC"\
        },\
        "SAS": {\
            "latitude": "23.9",\
            "longitude": "78.2",\
            "code": "SAS"\
        },\
        "SSA": {\
            "latitude": "-10.82",\
            "longitude": "25.8",\
            "code": "SSF"\
        }\
}
state_hash2 = { \
  "Latin America & Caribbean": "LCN",\
  "Europe & Central Asia": "ECS", \
  "Middle East & North Africa": "MEA",\
  "Sub-Saharan Africa": "SSF",\
  "South Asia": "SAS",\
  "East Asia & Pacific": "EAS"\
}

code_map = {}
code = code[1:]
for item in code:
    if item[-1]:
        code_map[item[0]] = state_hash2[item[-1]]

header = data[0]
data = data[1:]
output = []
for item in data:
    des = item[1]
    if (item[3] != 'DT.DOD.DECT.CD' or (item[1] not in state_hash)):
        continue

    state = item[1]
    tmp = {}
    tmp['Country Name'] = item[0]
    for i in range(5, len(item)-9):
        if item[i]:
            tmp[header[i]] = float(item[i])
        else:
            tmp[header[i]] = 0
    tmp['latitude'] = state_hash[state]['latitude']
    tmp['longitude'] = state_hash[state]['longitude']
    tmp['Country Code'] = state_hash[state]['code']
    output.append(tmp)

json_io.write_json('state_data.json', output)
print (len(output))
