import json
import requests

OPEN_WEATHER_API_KEY = '8a7ff34628198383c495dd2ab04d7dc4'


def openweather_api_requst(name) -> json:
    """Request to OpenWeather Api and get json response."""
    api_url = (f'https://api.openweathermap.org/data/2.5/weather?q={name}&appid={OPEN_WEATHER_API_KEY}')
    api_response = requests.get(api_url)
    api_response = api_response.json()

    return api_response
