import json
from collections import namedtuple

in_filename = '../data/today_raw.json'
out_filename = '../data/today.json'

with open(in_filename, "r") as read_file:
    data_in = json.load(read_file)

#print(json.dumps(data_in, indent=4, sort_keys=True))

Measures = namedtuple('Measures', 'time, time_str, description, ' +
    'temp, humidity, pressure_sea, pressure_ground, ' +
    'wind_speed, wind_dir, rain, clouds')

data_out = []
for item in data_in['list'][0:8]:
	#print(item)
	time = item['dt']
	time_str = item['dt_txt']
	description = item['weather'][0]['description']
	temp = round(((item['main']['temp'] - 273.15) * 9.0/5.0 + 32) * 100) / 100
	humidity = item['main']['humidity']
	pressure_sea = item['main']['sea_level']
	pressure_ground = item['main']['grnd_level']
	wind_speed = item['wind']['speed']
	wind_dir = item['wind']['deg']
	rain = 0 if not item['rain'] else item['rain']['3h']
	clouds = item['clouds']['all']
	d = Measures(time, time_str, description, temp, humidity, pressure_sea, pressure_ground, wind_speed, wind_dir, rain, clouds)
	data_out.append(d._asdict())

#print(data_out)

with open(out_filename, 'w') as outfile:
    json.dump(data_out, outfile, indent=4)

