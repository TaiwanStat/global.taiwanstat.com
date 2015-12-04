from lib import csv_io
from lib import json_io
import sys

data = csv_io.read_csv(sys.argv[1])
code = csv_io.read_csv(sys.argv[2])

state_hash = { \
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
        code_map[item[0]] = state_hash[item[-1]]

header = data[0]
data = data[1:]
output = {}
for item in data:
    des = item[1]
    if (item[3] != 'DT.DOD.DECT.CD' or (item[1] not in code_map)):
        continue
    state = code_map[item[1]]
    if state not in output:
        output[state] = []
    tmp = {}
    tmp['Country Name'] = item[0]
    tmp['CountryCode'] = item[1]
    for i in range(5, len(item)-9):
        if item[i]:
            tmp[header[i]] = float(item[i])
        else:
            tmp[header[i]] = 0
    output[state].append(tmp)

json_io.write_json('data.json', output)
