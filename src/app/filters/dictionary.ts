export interface Cuisine {
    key: string;
    name: string;
    suffix: string;
    recs: number;
}
export interface Price {
    key: string;
    name: string;
    suffix: string;
}

export interface IDictionary {
    amsterdamCenter: number[];
    amsterdamBounds: Array<number[]>;
    prices: Price[];
    cuisines: Object;
    areas: Object;
}

export const Dictionary: IDictionary = {
    'amsterdamCenter': [52.37, 4.895],
    'amsterdamBounds': [[52.335759, 4.834671], [52.412472, 4.956894]],
    'prices': [
        {
            'key': 'budget',
            'name': 'Budget',
            'suffix': 'Restaurants'
        }, {
            'key': 'midrange',
            'name': 'Mid-range',
            'suffix': 'Restaurants'
        }, {
            'key': 'finedining',
            'name': 'Fine dining',
            'suffix': ''
        }
    ],
    'cuisines': {
        'american': {
            'name': 'American',
            'suffix': ' restaurants',
            'recs': 0
        },
        'asian': {
            'name': 'Asian',
            'suffix': ' restaurants',
            'recs': 1
        },
        'belgian': {
            'name': 'Belgian',
            'suffix': ' restaurants',
            'recs': 0
        },
        'caribbean': {
            'name': 'Caribbean',
            'suffix': ' restaurants',
            'recs': 0
        },
        'chinese': {
            'name': 'Chinese',
            'suffix': ' restaurants',
            'recs': 0
        },
        'dutch': {
            'name': 'Dutch',
            'suffix': ' restaurants',
            'recs': 0
        },
        'dutch-eetcafes': {
            'name': 'Dutch eetcafe',
            'suffix': 's',
            'recs': 1
        },
        'east-african': {
            'name': 'East African',
            'suffix': ' restaurants',
            'recs': 1
        },
        'european': {
            'name': 'European',
            'suffix': ' restaurants',
            'recs': 0
        },
        'french': {
            'name': 'French',
            'suffix': ' restaurants',
            'recs': 1
        },
        'indian': {
            'name': 'Indian',
            'suffix': ' restaurants',
            'recs': 1
        },
        'indonesian': {
            'name': 'Indonesian',
            'suffix': ' restaurants',
            'recs': 1
        },
        'international': {
            'name': 'International',
            'suffix': ' restaurants',
            'recs': 0
        },
        'italian': {
            'name': 'Italian',
            'suffix': ' restaurants',
            'recs': 1
        },
        'japanese': {
            'name': 'Japanese',
            'suffix': ' restaurants',
            'recs': 1
        },
        'korean': {
            'name': 'Korean',
            'suffix': ' restaurants',
            'recs': 1
        },
        'lunch-and-brunch': {
            'name': 'Lunch & brunch',
            'suffix': ' cafes',
            'recs': 1
        },
        'mediterranean': {
            'name': 'Mediterranean',
            'suffix': ' restaurants',
            'recs': 0
        },
        'mexican': {
            'name': 'Mexican',
            'suffix': ' restaurants',
            'recs': 0
        },
        'middle-eastern': {
            'name': 'Middle Eastern',
            'suffix': ' restaurants',
            'recs': 1
        },
        'portuguese': {
            'name': 'Portuguese',
            'suffix': ' restaurants',
            'recs': 0
        },
        'swiss': {
            'name': 'Swiss',
            'suffix': ' restaurants',
            'recs': 0
        },
        'surinamese': {
            'name': 'Surinamese',
            'suffix': ' restaurants',
            'recs': 0
        },
        'tapas': {
            'name': 'Tapas',
            'suffix': ' restaurants',
            'recs': 1
        },
        'thai': {
            'name': 'Thai',
            'suffix': ' restaurants',
            'recs': 1
        },
        'vegetarian': {
            'name': 'Vegetarian',
            'suffix': ' restaurants',
            'recs': 1
        },
        'vietnamese': {
            'name': 'Vietnamese',
            'suffix': ' restaurants',
            'recs': 1
        }
    },
    'areas': {
        'amsterdam': {
            'name': 'Amsterdam',
            'lat': 52.37,
            'lng': 4.895
        },
        'Dam': {
            'name': 'Dam',
            'lat': 52.3713023,
            'lng': 4.89286422
        },
        'Jordaan': {
            'name': 'Jordaan',
            'lat': 52.3759135,
            'lng': 4.88531112
        },
        'Leidseplein': {
            'name': 'Leidseplein',
            'lat': 52.3640176,
            'lng': 4.88222122
        },
        'Nieuwmarkt': {
            'name': 'Nieuwmarkt',
            'lat': 52.3726909,
            'lng': 4.90024566
        },
        'Noord': {
            'name': 'Noord',
            'lat': 52.4,
            'lng': 4.9
        },
        'Oud-West': {
            'name': 'Oud-West',
            'lat': 52.3664809,
            'lng': 4.87243652
        },
        'De-Pijp': {
            'name': 'De Pijp',
            'lat': 52.3553688,
            'lng': 4.89252090
        },
        'Rembrandtplein': {
            'name': 'Rembrandtplein',
            'lat': 52.3665857,
            'lng': 4.89320755
        },
        'Westerpark': {
            'name': 'Westerpark',
            'lat': 52.3861823,
            'lng': 4.88136291
        },
        'Oostwatergraafsmeer': {
            'name': 'Oost\/Watergraafsmeer',
            'lat': 52.3532719,
            'lng': 4.920158
        },
        'Zuid': {
            'name': 'Zuid',
            'lat': 52.3,
            'lng': 4.9
        }
    }
};
