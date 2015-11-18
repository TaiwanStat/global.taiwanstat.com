from lib import csv_io
from lib import json_io

d1 = csv_io.read_csv('data/Facebook-Government-Report-2013-H1.csv')
d2 = csv_io.read_csv('data/Facebook-Government-Report-2014-H2.csv')
d3 = csv_io.read_csv('data/Facebook-Government-Report-2013-H2.csv')
d4 = csv_io.read_csv('data/Facebook-Government-Report-2015-H1.csv')
d5 = csv_io.read_csv('data/Facebook-Government-Report-2014-H1.csv')


raw = [d1, d2, d3, d4, d5]
data = {}

header = d1[0]

for d in raw:
    d = d[1:]
    for row in d:
        if row[0] not in data:
            data[row[0]] = {}

        for i in range(1, len(row)-2):
            header[i] = header[i].replace(' ', '_')
            if not row[i]:
                continue

            if header[i] not in data[row[0]]:
                data[row[0]][header[i]] = 0
            try:
                data[row[0]][header[i]] += int(row[i].replace(',', ''))
            except:
                data[row[0]][header[i]] = int(row[i].split('-')[1].replace(',', ''))
                print (data[row[0]])

output = []
for country in data:
    tmp = data[country]
    tmp['country'] = country
    output.append(tmp)

json_io.write_json('./data/data.json', output)
