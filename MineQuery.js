/**+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
/** GawdScape Server Status & Player List    **/
/** Copyright © 2025 GawdTech Inc.           **/
/**+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-**/


var servers = new Map();
var serversJava = new Map();
var serversBedrock = new Map();


// <div id="[PREFIX]_[SERVER]_[ITEM]">
var idPrefix = "minecraft";


var apiURL = "https://api.mcsrvstat.us/3/";
var queryJavaAPI = "https://api.mcsrvstat.us/3/";
var queryBedrockAPI = "https://api.mcsrvstat.us/bedrock/3/";
var avatarURL = "https://minotar.net/helm/";


var serverTimeout = "Query Timeout";
var serverStarting = "The server is Starting.";

var serverOffline = "The server is Offline.";
var serverOnline = "Server: Online <br>Version: {serverVersion} <br>Players: {playersOnline} / {playersMax}";
var serverEmpty = "Nobody is online :(";

var errorResponse = "Error: Invalid Response";
var errorRequest = "Error: HTTP Request";
var errorCode = "Error: HTTP ({errorCode})";

var serverText = "{serverName} ({playersOnline})";
var serverHover = "{serverMOTD}";

var playerText = "{playerName}";
var playerHover = "{playerName}";
var playerImageAlt = "{playerName}";
var playerImageSize = 16;
var playerImageURL = avatarURL+"{playerUUID}/"+playerImageSize+".png";
var playerLinkURL = "/player/{playerUUID}";

var modText = "{modName} {modVersion}";
var pluginText = "{pluginName} {pluginVersion}";

var statusLoading = "Loading...";
var statusOnline = "Loading...";
var statusOffline = "Loading...";
var statusError = "Loading...";



function placeholderServerIP(inputText, player)
{
	return inputText
			.replace("{playerUUID}", player.uuid)
			.replace("{playerName}", player.name);
}

function placeholderPlayer(inputText, player)
{
	return inputText
			.replace("{playerUUID}", player.uuid)
			.replace("{playerName}", player.name);
}

function placeholderMod(id, inputText, json)
{
	return inputText
			.replace("{"+id+"Name}", json.name)
			.replace("{"+id+"Version}", json.version);
}

function getElement(server, element)
{
	var parent = document.getElementById(idPrefix+server);
	var item = parent.querySelector('.'+element);
	return item;
}

function getParentElement(server)
{
	var parent = document.getElementsByClassName(idPrefix+' '+server);
	return parent;
}

function setElements(server, element, content)
{
	var parent = getParentElement(server);
	for (var i = 0; i < parent.length; i++) {
		var item = parent[i].querySelector('.'+element);
		if (item) {
			item.innerHTML = ""+content;
		}
	}
	return parent;
}



function setPlayerItem(player)
{
	var playerItem = document.createElement('li');
	playerItem.appendChild(playerIcon(player));
	playerItem.appendChild(playerLink(player));
	return playerItem;
}

function setPlayerList(server, element, players)
{
	var parent = getParentElement(server);
	for (var i = 0; i < parent.length; i++) {
		var playerList = parent[i].querySelector('.'+element);
		for (var i in players) {
			var playerItem = setPlayerItem(players[i]);
			playerList.appendChild(playerItem);
		}
	}
}

function setElement(server, element, content)
{
	setElements(server, element, content);
}

function setElementImage(server, element, content)
{
	var parent = getParentElement(server);
	for (var i = 0; i < parent.length; i++) {
		var item = parent[i].querySelector('.'+element);
		if (item) {
			item.src = ""+content;
		}
	}
}

function setError(server, text)
{
	var item = setElement(server, "error", text);
}

function setOffline(server, json)
{
	setElement(server, "online", json.online);
	setElement(server, "ip", json.ip);
	setElement(server, "port", json.port);
	setElement(server, "hostname", json.hostname);
}

function setOnline(server, json)
{
	setElement(server, "online", json.online);
	setElement(server, "ip", json.ip);
	setElement(server, "port", json.port);
	setElement(server, "hostname", json.hostname);
	setElement(server, "version", json.version);
	setElement(server, "software", json.software);
	setElement(server, "eula-blocked", json.eula_blocked);
	setElementImage(server, "icon", json.icon);
	setPlayers(server, "players-list", json.players.list);
	setMotd(server, "motd", json.motd);
	setProtocol(server, json.protocol);
}

function setStatus(status)
{
	setElement(server, "status", status);
}

function setPlayers(server, players)
{
	setElement(server, "players-online", players.online);
	setElement(server, "players-max", players.max);
	setPlayerList(server, "players-list", players.list);
}
function setProtocol(server, protocol)
{
	setElement(server, "protocol-name", protocol.name);
	setElement(server, "protocol-version", protocol.version);
}

function setQuery(server, json)
{
	setElement(server, "gamemode", json.gamemode);
	setElement(server, "serverid", json.serverid);
	setMotd(server, "map", json.map);
	setMods(server, "plugins", json.plugins);
	setMods(server, "mods", json.mods);
	setMotd(server, "info", json.info);
}

function setMotd(server, id, motd)
{
	if (!motd) {
		return;
	}
	if (motd.raw.length == 1) {
		setElement(server, id+"-raw", motd.raw[0]);
	}
	if (motd.raw.length == 2) {
		setElement(server, id+"-raw", motd.raw[0]+"\n"+motd.raw[1]);
		setElement(server, id+"-raw-0", motd.raw[0]);
		setElement(server, id+"-raw-1", motd.raw[1]);
	}
	if (motd.raw.length == 1) {
		setElement(server, id+"-clean", motd.clean[0]);
	}
	if (motd.raw.length == 2) {
		setElement(server, id+"-clean", motd.clean[0]+"<br>"+motd.clean[1]);
		setElement(server, id+"-clean-0", motd.clean[0]);
		setElement(server, id+"-clean-1", motd.clean[1]);
	}
	if (motd.raw.length == 1) {
		setElement(server, id+"-html", motd.html[0]);
	}
	if (motd.raw.length == 2) {
		setElement(server, id+"-html", motd.html[0]+"<br>"+motd.html[1]);
		setElement(server, id+"-html-0", motd.html[0]);
		setElement(server, id+"-html-1", motd.html[1]);
	}
}

function setDebug(server, debug)
{
	setElement(server, "debug-ping", debug.ping);
	setElement(server, "debug-query", debug.query);
	setElement(server, "debug-bedrock", debug.bedrock);
	setElement(server, "debug-querymismatch", debug.querymismatch);
	setElement(server, "debug-animatedmotd", debug.animatedmotd);
	setElement(server, "debug-cachehit", debug.cachehit);
	setElement(server, "debug-cachetime", debug.cachetime);
	setElement(server, "debug-cacheexpire", debug.cacheexpire);
	setElement(server, "debug-apiversion", debug.apiversion);
}

function setMods(server, element, list)
{
	var modsList = setElement(server, listID, "");
	for (var i in list) {
		var mod = list[i];
		var modItem = modElement(mod);
		modsList.appendChild(modItem);
	}
}
function modElement(mod)
{
	var modItem = document.createElement('li');
	var modText = document.createTextNode(placeholderMod(modText, mod));
	modItem.appendChild(modText);
	return playerItem;
}

function playerText(player)
{
	var playerText = document.createTextNode(placeholderPlayer(playerText, player));
	return playerText;
}

function playerLink(player)
{
	var playerLink = document.createElement('a');
	playerLink.appendChild(playerText(player));
	playerLink.title = placeholderPlayer(playerHover, player);
	playerLink.href = placeholderPlayer(playerLinkURL, player);
	return playerLink;
}

function playerIcon(player)
{
	var playerImg = document.createElement('img');
	playerImg.src = placeholderPlayer(playerImageURL, player);
	playerImg.alt = placeholderPlayer(playerImageAlt, player);
	return playerImg;
}

function playerElement(player)
{
	var spaceItem = document.createTextNode(' ');
	var playerItem = document.createElement('li');
	playerItem.appendChild(playerIcon(player));
	playerItem.appendChild(spaceItem);
	playerItem.appendChild(playerLink(player));
	return playerItem;
}


function handleResponse(server, responseText)
{
	if (!responseText) {
		setError(server, errorResponse);
		return;
	}
	console.log(responseText);
	var json = JSON.parse(responseText);
	if (json.debug) {
		setError(server, "Cached:"+json.debug.cachehit+" | "+"Time:"+json.debug.cachetime+" | "+"Expire:"+json.debug.cacheexpire);
	} else {
		setError(server, "Loaded");
	}
	setOnline(server, json);
	if (json.debug.query) {
		setQuery(server, json);
	}
	setDebug(server, json.debug);
}


function getApiUrl(serverType, serverIP, serverPort)
{
	switch (serverType) {
		case 'java':
			return queryJavaAPI+serverIP+(serverPort?':'+serverPort:'');
		case 'bedrock':
			return queryBedrockAPI+serverIP+(serverPort?':'+serverPort:'');
	}
	return false;
}

function queryServer(serverName, serverType, serverIP, serverPort)
{
	var apiURL = getApiUrl(serverType, serverIP, serverPort);
	var request = new XMLHttpRequest();
	request.open("GET", apiURL, true);
	request.onload = function() {
		if (request.status == 200) {
			setError(serverName, "Processing...");
			handleResponse(serverName, request.responseText);
		} else {
			setError(serverName, errorCode.replace("{errorCode}", request.status));
		}
	};
	request.onerror = function() {
		setError(serverName, errorRequest);
	};
	request.send();
}

function setElements(server, data) {
	setElement(server, "debug-ping", debug.ping);
	console.log(k+' = '+v);
}

function setAllContent(server, id, content)
{
	var parent = getParentElement(server);
	for (var i = 0; i < parent.length; i++) {
		setElement(parent[i], id, content);
	}
	return parent;
}

function getElement(parent, id) {
	var item = parent.querySelector('.'+id);
	return item;
}

function setContent(id, content, parent) {
	var item = getElement(parent, id);
	if (item) {
		item.innerHTML = ""+content;
	}
	return item;
}

function setAllData(server, json)
{
	var parent = getParentElement(server);
	for (var i = 0; i < parent.length; i++) {
		listObject(json, '-', setContent, parent[i]);
	}
	return parent;
}

function listObject(object, separator, func, arg) {
	next=(data,sub)=>!data|[data]==data||Object.entries(data).map(([key, value])=>next(data[key],key=sub?sub+[separator+key]:key,func(key,value,arg));
	next(object);
}

function getObjectMap(object, separator) {
	map = new Map();
	next = (data,sub) => !data|[data] == data ||
		Object.entries(data).map(([key, value]) =>
		next(
			data[key],
			key=sub ? sub+[separator+key] : key,
			map.set(key,value)
		)
	);
	next(object);
	return map;
}

function logMapElements(value, key, map) {
	if (value instanceof Array) {
		printArray(value, key);
		return;
	}
	if (typeof value == 'object') {
		printObject(value, key);
		return;
	}
	print(value, key);
}

function print(value, key) {
	var type = typeof value;
	console.log(`${type} [${key}] = ${value}`);
}

function printArray(value, key) {
	console.log(`Array [${key}] = ${value}`);
}

function printObject(value, key) {
	console.log(`Object [${key}] = ${value}`);
}

function printArrayItem(player)
{
	var playerItem = document.createElement('li');
	playerItem.appendChild(playerIcon(player));
	playerItem.appendChild(playerLink(player));
	return playerItem;
}

function printArray(server, element, players)
{
	var parent = getParentElement(server);
	for (var i = 0; i < parent.length; i++) {
		var playerList = parent[i].querySelector('.'+element);
		for (var i in players) {
			var playerItem = setPlayerItem(players[i]);
			playerList.appendChild(playerItem);
		}
	}
}

function setPlaceholders(text, json)
{
	return text
	.replace("online", json.online);
	.replace("ip", json.ip);
	.replace("port", json.port);
	.replace("hostname", json.hostname);
	.replace("version", json.version);
	.replace("software", json.software);
	.replace("eula-blocked", json.eula_blocked);
	.replace("icon", json.icon);
	.replace("motd", json.motd);
	.replace("players-online", json.players.online);
	.replace("players-max", json.players.max);
	.replace("players-list", json.players.list);
	.replace("motd", json.motd) {
	.replace("protocol-name", json.protocol.name);
	.replace("protocol-version", json.protocol.version);
}
