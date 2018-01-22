'use strict';

//  ---------------------------------------------------------------------------

const coinegg = require ('./coinegg.js');
const { ExchangeError } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class btctradeim extends coinegg {

    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'btctradeim',
            'name': 'BtcTrade.im',
            'countries': 'HK',
            'urls': {
                'logo': 'https://www.btctrade.im/static/images/logo.png',
                'api': {
                    'web': 'https://www.btctrade.im/coin',
                    'rest': 'https://api.btctrade.im/api/v1',
                },
                'www': 'https://www.btctrade.im/',
                'doc': 'https://www.btctrade.im/help.api.html',
                'fees': 'https://www.btctrade.im/spend.price.html',
            },
            'fees': {
                'trading': {
                    'maker': 0.2 / 100,
                    'taker': 0.2 / 100,
                },
                'funding': {
                    'withdraw': {
                        'BTC': 0.001,
                    },
                },
            },
        });
    }

    async request (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let response = await this.fetch2 (path, api, method, params, headers, body);
        if (api ==='web') {
            return response;
        }
        let data = this.safeValue (response, 'data');
        if (data) {
            let code = this.safeString (response, 'code');
            if (code !== '0') {
                let message = this.safeString (response, 'msg', 'Error');
                throw new ExchangeError (message);
            }
            return data;
        }
        return response;
    }
};
