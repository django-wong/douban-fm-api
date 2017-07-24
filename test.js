/*
* @Author: Django Wong
* @Date:   2017-05-31 00:24:37
* @Last Modified by:   django-wong
* @Last Modified time: 2017-07-25 01:44:45
*/

'use strict';

let DoubanFM = require('./index.js');

let username = 'xxxx@xx.com';
let password = 'xxxxxxxxxx';

let dump = function(t, data, raw){
	let title = t.toUpperCase();
	console.info(`------------${title}-----------`);
	if(raw){
		console.info(data);
	}else{
		for(var i in data){
			if(data.hasOwnProperty(i)){
				console.info(i, ' : ', data[i]);
			}
		}
	}
	console.info(`---------END OF ${title}-------`);
	console.info('');
};

let playList = async function(channelId){
	let {data} = await DoubanFM.playList(channelId);
	dump('playlist', data);
};

let channelList = async function(){
	try{
		let {data} = await DoubanFM.channelList();
		dump('Channel Group', data.groups)
		let [firstGroup] = data.groups;
		let index = 0;
		let channel = firstGroup.chls[index];
		dump('频道', channel)
		playList(channel.id);
	}catch(e){
		console.info(e);
	}
};

let describe = async function(song){
	let {data} = await DoubanFM.describe(song.sid);
	dump('SONG', data);
};

let unrate = async function(song){
	let {data} = await DoubanFM.rate(13408);
	dump('unrate', data);
};

let redheart = async function(){
	try{
		let {data} = await DoubanFM.redheart();
		dump('RED HEART', data);
		let {songs} = data;
		let index = 4;
		let song = songs[index];
		describe(song);
		unrate(song);
	}catch(e){
		console.info(e);
	}
};

let userinfo = async function(){
	let {data} = await DoubanFM.userinfo();
	dump('userinfo', data);
}

let recentPlaysource = async function(){
	let {data} = await DoubanFM.recentPlaysource();
	dump(data);
}

let recommendChannels = async function(){
	let {data} = await DoubanFM.recommendChannels();
	dump(data);
}

let lyric = async function(){
	try{
		let {data} = await DoubanFM.lyric(1817519, 'a314');
		dump('lyric', data)
	}catch(e){
		console.info(e);
	}
};



let index = async function(){
	let {data} = await DoubanFM.login(username, password);
	dump('login', data);

	// userinfo();
	// channelList();
	redheart();
	// lyric();
};

index();