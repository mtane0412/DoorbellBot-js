import * as tmi from 'tmi.js';
import * as fs from 'fs';
import * as toml from 'toml';
import axios from "axios";
const player = require('node-wav-player');


const config = toml.parse(fs.readFileSync('./config.toml', 'utf8'));
const userList:Set<string> = new Set();

// サウンド再生
const doorbellPlay = (username:string) => {
    const path = fs.existsSync(`./sounds/${username}.wav`) ? `./sounds/${username}.wav` : './sounds/default.wav';
    player.play({path: path})
    .then(() => {
        console.log(`${username}さんがいらっしゃいました！`);
    }).catch((error:unknown) => {
        console.error(error);
    });
};

const play = (filename:string) => {
    const isWav:boolean = filename.endsWith('.wav');
	if (!isWav) return; // wavファイル以外は再生しない
	const filePath =  `./sounds/${filename}`;
	if(!fs.existsSync(filePath)) return; // wavファイルが存在しなければ再生しない
	player.play({path: filePath})
	.then(() => {
		console.log('play: ' + filePath);
	}).catch((error:unknown) => {
		console.error(error);
	});
}

type UserInfo = {
	broadcaster_type: string // User’s broadcaster type: "partner", "affiliate", or "".
	description: string // User’s channel description.
	display_name: string // User’s display name.
	id: string // User’s ID.
	login: string // User’s login name.
	offline_image_url: string // URL of the user’s offline image.
	profile_image_url: string // URL of the user’s profile image.
	type: string // User’s type: "staff", "admin", "global_mod", or "".
	view_count: number // Total number of views of the user’s channel.
	/*
	NOTE: This field has been deprecated. For information, see Get Users API endpoint – “view_count” deprecation. The response continues to include the field; however, it contains stale data. You should stop displaying this data at your earliest convenience.
	*/
	email: string // User’s verified email address. Returned if the request includes the user:read:email scope.
	created_at: string // Date when the user was created.
}

type ChannelInfo = {
	broadcaster_id: string			// Twitch User ID of this channel owner.
	broadcaster_login: string		// Broadcaster’s user login name.
	broadcaster_name: string		// Twitch user display name of this channel owner.
	game_name: string				// Name of the game being played on the channel.
	game_id: string					// Current game ID being played on the channel.
	broadcaster_language: string 	// Language of the channel. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”.
	title: string 					// Title of the stream.
	delay: number 					// Stream delay in seconds.
}

// shoutout & raid messageの変数置換
const replaceVariables = (message:string, channelInfo:ChannelInfo, viewers?:number) => {
	let replacedMessage = message
		.replace(/\n/g, ' ')
		.replace(/\{username\}/g, channelInfo.broadcaster_login)
		.replace(/\{displayName\}/g, channelInfo.broadcaster_name)
		.replace(/\{game\}/g, channelInfo.game_name)
		.replace(/\{title\}/g, channelInfo.title);
	if (viewers) replacedMessage = replacedMessage.replace('{viewers}', viewers.toString());
	return replacedMessage
}

const main = async () => {
	// Twitch APIのvalidate
	const clientId = await axios.get('https://id.twitch.tv/oauth2/validate', { headers: {
		'Authorization': 'OAuth ' + config.botInfo.TWITCH_TOKEN.replace('oauth:', '')
	}
	}).then(response => {
		console.log(response.status + ' ' + response.statusText);
		return response.data['client_id']
	})
	.catch(error => console.log(error))
	const client = new tmi.Client({
		options: { debug: true },
		identity: {
			username: config.botInfo.bot_name,
			password: config.botInfo.TWITCH_TOKEN
		},
		channels: [ config.botInfo.channel ]
	});

	client.connect();


	
	const getUserInfoByUsername = async (username: string) => {
		const userInfo:UserInfo = await axios.get('https://api.twitch.tv/helix/users?login=' + username, {headers: {
			'Authorization': 'Bearer ' + config.botInfo.TWITCH_TOKEN.replace('oauth:', ''),
			'Client-Id': clientId
		}}).then(response => {
			return response.data.data[0]
		}).catch(error => console.log(error));

		return userInfo
	}
	const getChannelInfoById = async (broadcasterId: string) => {
		const channelInfo:ChannelInfo = await axios.get('https://api.twitch.tv/helix/channels?broadcaster_id=' + broadcasterId, {headers: {
					'Authorization': 'Bearer ' + config.botInfo.TWITCH_TOKEN.replace('oauth:', ''),
					'Client-Id': clientId
				}}).then(response => {
					return response.data.data[0]
				}).catch(error => console.log(error));
		return channelInfo
	}

	client.on("raided", async (channel:string, username:string, displayName:string, viewers:number) => {
		if (config.shoutout.enable_raid_shoutout) {
			if (config.shoutout.enable_raid_sound) play('raid.wav');
			const broadcasterId:string = await (await getUserInfoByUsername(username)).id;
			const channelInfo:ChannelInfo = await getChannelInfoById(broadcasterId);
			const shoutoutMessage = replaceVariables(config.shoutout.raid_message, channelInfo, viewers);
			client.say(channel, shoutoutMessage);
		}
	});

	client.on('message', async (channel, tags, message, self) => {
		// Ignore echoed messages.
		if(self) return;
		if(!tags.username) return;
		const ignoreUsers:Array<string> = config.botInfo.ignore_users;
		if(ignoreUsers.includes(tags.username)) return;
		if(!userList.has(tags.username)) {
			// 最初のチャットのときに音を鳴らす
			doorbellPlay(tags.username);
			userList.add(tags.username);
		}

		// command処理
		if(message.startsWith('!')) {
			const [command, ...args]:Array<string> = message.split(' ');
			if(config.shoutout.enable_shoutout && config.shoutout.shoutout_commands.includes(command.toLowerCase()) && tags.mod){
				const broadcasterId:string = await (await getUserInfoByUsername(args[0])).id;
				const channelInfo:ChannelInfo = await getChannelInfoById(broadcasterId);
				const shoutoutMessage = replaceVariables(config.shoutout.shoutout_message, channelInfo);
				client.say(channel, shoutoutMessage);
			}
		}
	});
}

main();