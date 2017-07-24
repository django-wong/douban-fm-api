/*
* @Author: Django Wong
* @Date:   2017-05-31 00:06:28
* @Last Modified by:   django-wong
* @Last Modified time: 2017-07-25 01:20:28
*/

'use strict';

let axios = require('axios');
let sf = require('querystring').stringify;

class DoubanFM {


	/**
	 * The constructor
	 * @param  {String} email    The login email
	 * @param  {String} password The password
	 * @return {Object} This
	 */
	constructor(email, password) {
		this.email = email;
		this.password = password;

		this.api = this.buildRequest();

		this.channel = 0;
		this.sid = null;
		return this;
	}


	/**
	 * Get the request authorization string
	 * @return {String} authorization string
	 */
	get authorization() {
		if(!this.indentity){
			return '';
		}
		return `Bearer ${this.indentity.access_token}`;
	}

	/**
	 * Build the request instance
	 * @return {Object} axios instance
	 */
	buildRequest() {
		return axios.create({
			'baseURL': 'https://api.douban.com/v2/fm',
			'timeout': 3000,
			'params': {
				'alt': 'json',
				'app_name': 'radio_iphone',
				'apikey': '02646d3fb69a52ff072d47bf23cef8fd',
				'client': 's:mobile|y:iOS 10.2|f:115|d:b88146214e19b8a8244c9bc0e2789da68955234d|e:iPhone7,1|m:appstore',
				'client_id': '02646d3fb69a52ff072d47bf23cef8fd',
				'icon_cate': 'xlarge',
				'udid': 'b88146214e19b8a8244c9bc0e2789da68955234d',
				'douban_udid': 'b635779c65b816b13b330b68921c0f8edc049590',
				'version': '115'
			},
			'headers': {
				'Authorization': this.authorization
			}
		});
	}


	/**
	 * Login to douban
	 * @param  {String} username the user name
	 * @param  {String} password the password
	 * @return {Promise}          Promise
	 */
	login(username, password) {
		this.username = username;
		this.password = password;
		const url = 'https://www.douban.com/service/auth2/token';
		let request = axios.post(url, sf({
			'apikey': '02646d3fb69a52ff072d47bf23cef8fd',
			'client_id': '02646d3fb69a52ff072d47bf23cef8fd',
			'client_secret': 'cde5d61429abcd7c',
			'udid': 'b88146214e19b8a8244c9bc0e2789da68955234d',
			'douban_udid': 'b635779c65b816b13b330b68921c0f8edc049590',
			'device_id': 'b88146214e19b8a8244c9bc0e2789da68955234d',
			'grant_type': 'password',
			'redirect_uri': 'http://www.douban.com/mobile/fm',
			'username': this.username,
			'password': this.password
		}));
		request.then((response) => {
			this.indentity = response.data;
			this.api = this.buildRequest();
		});
		return request;
	}


	/**
	 * Fetch the channel list
	 * @return {Promise} Promise
	 */
	channelList() {
		return this.api.get('/app_channels');
	}


	/**
	 * Fetch the playlist
	 * @param  {String} channelId 	The channel id
	 * @return {Promise}           	Songs in array
	 */
	playList(channelId) {
		return this.api.get('/playlist', {
			'params': {
				'channel': channelId,
				'from': 'mainsite',
				'pt': '0.0',
				'kbps': '128',
				'formats': 'mp3',
				'type': 'n'
			}
		});
	}


	/**
	 * Rate the song
	 * @param  {String} sid 	The song id
	 * @return {Promise}     	Promise
	 */
	rate(sid) {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 'r',
				'sid': sid || this.sid
			}
		});
	}

	/**
	 * Unrate/unlike a song
	 * @param  {String} sid 	The song id
	 * @return {Promise}     	Promise
	 */
	unrate(sid) {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 'u',
				'sid': sid || this.sid
			}
		});
	}

	/**
	 * Never play this again
	 * @param  {String} sid 	The song id
	 * @return {Promise}		Promise
	 */
	bye(sid) {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 'b',
				'sid': sid || this.sid
			}
		});
	}


	/**
	 * Fetch a new playlist
	 * @return {Promise} Promise
	 */
	new() {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 'n'
			}
		});
	}


	/**
	 * Renew the playlist
	 * @return {Promise} Promise
	 */
	renew() {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 'p'
			}
		});
	}


	/**
	 * Skip this song
	 * @param  {String} sid The song id
	 * @return {Promise}     axios response
	 */
	skip(sid) {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 's',
				'sid': sid || this.sid
			}
		});
	}

	end(sid) {
		return this.api.get('/playlist', {
			'params': {
				'channel': this.channel,
				'type': 'e',
				'sid': sid || this.sid
			}
		});
	}


	/**
	 * Redheart playlist
	 * @return {Promise} axios response
	 */
	redheart() {
		return this.api.get('/redheart/basic', {
			'headers': {
				'Authorization': this.authorization
			}
		});
	}


	/**
	 * Get songs details
	 * @param  {String} sid the song id
	 * @return {Promise}     axios response
	 */
	describe(sid) {
		return this.api.get('/redheart/songs', {
			'params': {
				'sids': sid,
				'kbps': '128',
				'ck': 'K_ts'
			}
		});
	}


	/**
	 * Get user info
	 * @return {Promise} axios response
	 */
	userinfo() {
		return this.api.get('/user_info', {
			'params': {
				'avatar_size': 'large'
			}
		});
	}


	/**
	 * Fetch recent played songs
	 * @return {Promise} axios response
	 */
	recentPlaysource() {
		return this.api.get('/recent_playsource');
	}


	/**
	 * Recommend channels for you
	 * @return {Promise} axios response
	 */
	recommendChannels() {
		return this.api.get('/rec_channels', {
			'params': {
				'specific': 'all'
			}
		});
	}


	/**
	 * Fetch the play logs
	 * @return {Promise} axios response
	 */
	playLog() {
		return this.api.post('/play_log', sf({
			'records': [
				{
					'sid': '1815433',
					'type': 'p',
					'pid': 0,
					'time': '2017-05-30 18:42:31',
					'play_source': 'h',
					'play_mode': 'o'
				}
			],
			'client': 's:mainsite|y:3.0',
			'ck': 'K_ts'
		}));
	}


	/**
	 * Get the lyric
	 * @param  {String} sid  the songs id
	 * @param  {String} ssid I dont know
	 * @return {Promise}      axios response
	 */
	lyric(sid, ssid) {
		return this.api.get('/lyric', {
			'params': {
				'sid': sid,
				'ssid': ssid
			}
		})
	}

}

let instance = new DoubanFM();

module.exports = instance;