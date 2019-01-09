# https://api.openweathermap.org/data/2.5/forecast?zip=90210,us&appid=<appid>


import requests
import json
from secrets import * 


class WeatherForecast:
    url = 'https://api.openweathermap.org/data/2.5/forecast'

    def __init__(self):
        pass

    @staticmethod
    def get_data(zip_code):
        values = {'zip': zip_code, 'appid': appid}

        resp = requests.get(WeatherForecast.url, values)
        json_data = resp.json()
        json_data['city']['zip_code'] = zip_code
        #print(json_data)

        return json_data

    @staticmethod
    def parse_data(raw_data):

        temp_k2f = lambda x: ((x - 273.15) * 9.0/5.0) + 32
        precision = lambda x, p: round(x * pow(10,p)) / pow(10,p)

        proc_data = {'zip_code': raw_data['city']['zip_code']}
        forecast = []
        for entry in raw_data['list'][0:8]:
            #print(entry)
            d = {
                'time': entry['dt'],
                'time_str': entry['dt_txt'],
                'description': entry['weather'][0]['description'],
                'temp': precision(temp_k2f(entry['main']['temp']), 2),
                'humidity': entry['main']['humidity'],
                'pressure_sea': entry['main']['sea_level'],
                'pressure_ground': entry['main']['grnd_level'],
                'wind_speed': entry['wind']['speed'],
                'wind_dir': entry['wind']['deg'],
                'rain': entry['rain']['3h'] if ('rain' in entry and entry['rain']) else 0,
                'clouds': entry['clouds']['all']
            }
            forecast.append(d)

        proc_data['forecast'] = forecast
        return proc_data


if __name__ == '__main__':

    out_filepath = '../data/today.json'
    zip_codes = ['90042', '70119', '11217']

    json_out = []
    for zc in zip_codes:
        print(zc)
    
        raw_data = WeatherForecast.get_data(zc)
        proc_data = WeatherForecast.parse_data(raw_data)
        json_out.append(proc_data)
    
    with open(out_filepath, 'w') as outfile:
            json.dump(json_out, outfile, indent=4)

