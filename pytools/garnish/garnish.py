import sqlite3
from functools import wraps
from json import loads
from flask import Flask, request, g, jsonify
from datetime import datetime, timedelta

'''
Configuration options. Change these later (environment variables?).
'''
DATABASE = '/Library/WebServer/Documents/qadan.github.io/pytools/garnish/garnish.db'
DEBUG = True

garnish = Flask(__name__)
garnish.config.from_object(__name__)

'''
Invalid things exceptions.
'''
class InvalidRequestException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

'''
Database connection/utils
'''
def make_dicts(cursor, row):
    json_indices = [
        'address',
        'hours_of_operation',
    ]
    return dict((cursor.description[idx][0], loads(value) if cursor.description[idx][0] in json_indices else value) for idx, value in enumerate(row))

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(garnish.config['DATABASE'])
        db.row_factory = make_dicts
    return db

def query_db(query, args=(), one=True):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@garnish.before_request
def before_request():
    g.db = get_db()

@garnish.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

'''
Helpers.
'''
@garnish.errorhandler(InvalidRequestException)
def handle_invalid_request(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

def jsonp(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return garnish.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

def now_is_within_time_ranges(weekday_times, offset):
    if weekday_times is None:
      return False

    try:
      offset = int(offset)
    except ValueError:
      offset = 0
    now = datetime.now() + timedelta(hours=offset)
    for weekday_time in weekday_times:
      start_time = datetime.now().replace(hour=weekday_time['start_time']['h'], minute=weekday_time['start_time']['m'], second=0, microsecond=0)
      if weekday_time['end_time']['h'] < weekday_time['start_time']['h']:
        end_day = start_time.day + 1
      else:
        end_day = start_time.day
      end_time = datetime.now().replace(day=end_day, hour=weekday_time['end_time']['h'], minute=weekday_time['end_time']['m'], second=0, microsecond=0)
      if now > start_time and now < end_time:
        return True

    return False

'''
Main routes.
'''
@garnish.route('/')
@jsonp
def rest_info():
    description = {
        'description': 'Garnish is a RESTful burger API, written in Python and running Flask on the backend. It serves content for Burger Love stuff.',
        'endpoints': {
            '/burgers': {
                'description': 'Info about all burgers.',
                'structure': 'A list of BurgerInfo objects.',
                },
            '/burger/@id': {
                'description': 'Info about a single burger.',
                'structure': 'A single BurgerInfo object.',
                'variables': {
                    '@id': 'The ID of the burger.',
                    },
                },
            '/restaurants': {
                'description': 'Info about all participating restaurant.',
                'structure': 'A list of RestaurantInfo objects.',
                },
            '/restaurant/@id': {
                'description': 'Info about a single restaurant.',
                'structure': 'A single RestaurantInfo object.',
                'variables': {
                    '@id': 'The ID of the restaurant.',
                    },
                },
            '/restaurant/@id/partners': {
                'description': 'The restaurants using the same burger as the given one.',
                'structure': 'A list of RestaurantPartner objects.',
                'variables': {
                    '@id': 'The ID of the restaurant.',
                    },
                },
            '/coordinates': {
                'description': 'Lists coordinates of all restaurants.',
                'structure': 'A list of RestaurantCoordinates objects.',
                },
            '/coordinates/open?offset=""': {
                'description': 'Lists coordinates of all restaurants currently open.',
                'structure': 'A list of RestaurantCoordinates objects.',
                'variables': {
                    '?offset': 'An integer designating the number of hours to offset the hours of operation by (e.g. ?offset=1 to search for restaurants that will be open for at least the next hour). Leave unset to use no offset.',
                    },
                },
            '/search?term=""': {
                'description': 'Runs a search using the given term.',
                'structure': 'A list of SearchResult objects.',
                'variables': {
                    '?term': 'The search term to use.',
                    },
                },
            },
        'structures': {
            'BurgerInfo': {
                'description': 'Information about an individual burger.',
                'keys': {
                    'id': 'A unique integer identifier for this burger.',
                    'ingredients': 'A string containing the ingredients list for this burger.',
                    'name': 'The string name of the burger.',
                    'quote': 'The string quote describing the burger.',
                    'restaurants': 'A list containing restaurant ID integers representing restaurants this burger can be found at.',
                    'url_suffix': 'A string describing the URL  suffix for the burger\'s view and vote pages.',
                    },
                },
            'HoursInfo': {
                'description': 'Information about the hours of operation of a restaurant.',
                'keys': {
                    '[n]': 'The ISO weekday this list of hours of operation are for. This contains a list of objects, each containing "start_time" and "end_time", containing an "h" and "m" for the hour (24h format) and minute corresponding to each time.',
                    },
                },
            'RestaurantInfo': {
                'description': 'Information about an individual restaurant.',
                'keys': {
                    'address': 'A list of strings representing individual lines of this restaurant\'s address.',
                    'burgers': 'A list containing burger ID integers representing burgers this restaurant serves.',
                    'hours_of_operation': 'A list containing string entries of dates and times this restaurant is open.',
                    'hours_table': 'An HoursTable structure.',
                    'id': 'A unique integer identifier for this restaurant.',
                    'latitude': 'A signed float representing the latitude coordinate of this restaurant.',
                    'longitude': 'A signed float representing the longitude coordinate of this restaurant.',
                    'name': 'The name of the restaurant.',
                    'phone_number': 'The restaurant\'s phone number.',
                    'website': 'The restaurant\'s business website.',
                    },
                },
            'RestaurantPartner': {
                'description': 'Information about restaurants carrying the same burger as a given restaurant.',
                'under_key': 'partners',
                'keys': {
                    'restaurant_id': 'The ID of an affiliated restaurant.',
                    },
                },
            'RestaurantCoordinates': {
                'description': 'Coordinates for a restaurant.',
                'under_key': 'coordinates',
                'keys': {
                    'id': 'The unique integer ID of the restaurant.',
                    'latitude': 'A signed float representing the latitude coordinate of this restaurant.',
                    'longitude': 'A signed float representing the longitude coordinate of this restaurant.',
                    'name': 'The name of the restaurant.',
                    },
                },
            'SearchResult': {
                'description': 'A result from a search representing the restaurant the searched term can be found at.',
                'under_key': 'An integer representing the result number.',
                'keys': {
                    'id': 'The unique ID integer of the restaurant.',
                    'latitude': 'A signed float representing the latitude coordinate of this restaurant.',
                    'longitude': 'A signed float representing the longitude coordinate of this restaurant.',
                    'name': 'The name of the restaurant.',
                    }
                },
            },
        }
    return jsonify(description)

@garnish.route('/burgers')
@jsonp
def get_all_burgers():
    burgers = query_db('select * from burgers', one=False)
    burgers = {
        'burgers': burgers
    }
    return jsonify(burgers)

@garnish.route('/burger/<int:id>')
@jsonp
def get_burger_info(id):
    properties = query_db('select * from burgers where id = ?', [id])
    if properties is not None:
        restaurants = query_db('select restaurant_id from restaurant_burgers where burger_id = ?', [id], one=False)
        properties['restaurants'] = [r['restaurant_id'] for r in restaurants]
        return jsonify(properties)
    else:
        raise InvalidRequestException('The given ID does not exist.')

@garnish.route('/burger/<int:id>/restaurants')
@jsonp
def get_restaurants_for_burger(id):
    restaurants = query_db('select restaurant_id from restaurant_burgers where burger_id = ?', [id], one=False)
    if restaurants is not None:
        restaurants = {
            'restaurants': restaurants
        }
        return jsonify(restaurants)
    else:
        raise InvalidRequestException('No restaurants found for this burger.')

@garnish.route('/restaurants')
@jsonp
def get_all_restaurants():
    restaurants = query_db('select * from restaurants', one=False)
    restaurants = {
        'restaurants': restaurants
    }
    return jsonify(restaurants)

@garnish.route('/restaurant/<int:id>')
@jsonp
def get_restaurant_info(id):
    properties = query_db('select * from restaurants where id = ?', [id])
    if properties is not None:
        burgers = query_db('select burger_id from restaurant_burgers where restaurant_id = ?', [id], one=False)
        properties['burgers'] = [b['burger_id'] for b in burgers]
        return jsonify(properties)
    else:
        raise InvalidRequestException('The given ID does not exist.')

@garnish.route('/restaurant/<int:id>/partners')
@jsonp
def get_restaurant_partners(id):
    ''' Some restaurants may team up to create the same burger; handle that.'''
    burger = query_db('select burger_id from restaurant_burgers where restaurant_id = ?', [id])
    if burger is not None:
        partners = query_db('select restaurant_id from restaurant_burgers where burger_id = ? and restaurant_id != ?', [burger['burger_id'], id], one=False)
        partners = {
            'partners': partners
        }
        return jsonify(partners)
    else:
        raise InvalidRequestException('The given ID does not exist.')

@garnish.route('/coordinates')
@jsonp
def get_all_restaurant_coordinates():
    coordinates = query_db('select id, name, latitude, longitude from restaurants', one=False)
    coordinates = {
        'coordinates': coordinates,
    }
    return jsonify(coordinates)

@garnish.route('/coordinates/open')
@jsonp
def get_all_open_restaurant_coordinates():
    offset = request.args.get('offset', default=0)
    coordinates = query_db('select id, name, latitude, longitude, hours_table from restaurants', one=False)
    coordinates_to_return = {
        'coordinates': [],
    }
    weekday = datetime.now().weekday()
    for coordinate in coordinates:
      hours_table = loads(coordinate['hours_table'])
      try:
        if now_is_within_time_ranges(hours_table[str(weekday)], offset):
          coordinates_to_return['coordinates'].append(coordinate)
      except KeyError:
        continue

    return jsonify(coordinates_to_return)

@garnish.route('/search')
@jsonp
def search():
    '''
    TODO: This is just awful but it's like 3 AM.
    '''
    results = {}
    ids = []
    i = 0;
    search_term = "%" + '%'.join(request.args.getlist('term')) + '%'

    from_restaurants = query_db('select id, latitude, longitude from restaurants where name like ? or address like ?', [search_term, search_term], one=False)
    for restaurant in from_restaurants:
        if restaurant['id'] not in ids:
            results[i] = {
                'id': restaurant['id'],
                'latitude': restaurant['latitude'],
                'longitude': restaurant['longitude'],
            }
            ids.append(restaurant['id'])
            i = i + 1

    from_burgers = query_db('select distinct id from burgers where name like ? or quote like ? or ingredients like ?', [search_term, search_term, search_term], one=False)
    for burger in from_burgers:
        burger_restaurants = query_db('select restaurant_id from restaurant_burgers where burger_id = ?', [burger['id']], one=False)
        for new_restaurant in burger_restaurants:
            if new_restaurant['restaurant_id'] not in ids:
                new_info = query_db('select latitude, longitude from restaurants where id = ?', [new_restaurant['restaurant_id']])
                results[i] = {
                    'id': new_restaurant['restaurant_id'],
                    'latitude': new_info['latitude'],
                    'longitude': new_info['longitude'],
                }
                ids.append(new_restaurant['restaurant_id'])
                i = i + 1

    return jsonify(results)

'''
Aaaaaaaand go.
'''
if __name__ == '__main__':
    garnish.run(host='0.0.0.0')
