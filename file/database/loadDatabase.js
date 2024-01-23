const fs = require('fs');
const path = require('path');
const config = require("../../config.js");

if (!global.db) {
    global.db = {
        users: {},
        groups: {}
    };
}

const databasePath = path.join(__dirname, '../../temp/db.json');

if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify(global.db, null, 2), 'utf-8');
}

async function loadDatabase(m) {
    const isNumber = x => typeof x === "number" && !isNaN(x);
    const isBoolean = x => typeof x === "boolean" && Boolean(x);

    if (!global.db.users[m.sender]) {
        global.db.users[m.sender] = {};
    }

    let user = global.db.users[m.sender];

    if (user) {
        if (!isNumber(user.limit)) user.limit = config.limit.free;
        if (!isBoolean(user.premium)) user.premium = m.isOwner ? true : false;
        if (!isBoolean(user.VIP)) user.VIP = m.isOwner ? true : false;
        if (!("lastChat" in user)) user.lastChat = new Date() * 1;
        if (!("name" in user)) user.name = m.pushName;
        if (!isBoolean(user.banned)) user.banned = false;
    } else {
        global.db.users[m.sender] = {
            limit: config.limit.free,
            lastChat: new Date() * 1,
            premium: m.isOwner ? true : false,
            VIP: m.isOwner ? true : false,
            name: m.pushName,
            banned: false,
        };
    }

    if (m.isGroup) {
        if (!global.db.groups[m.from]) {
            global.db.groups[m.from] = {};
        }

        let group = global.db.groups[m.from];
        if (group) {
            if (!isBoolean(group.mute)) group.mute = false;
            if (!isNumber(group.lastChat)) group.lastChat = new Date() * 1;
            if (!isBoolean(group.welcome)) group.welcome = true;
            if (!isBoolean(group.leave)) group.leave = true;
        } else {
            global.db.groups[m.from] = {
                lastChat: new Date() * 1,
                mute: false,
                welcome: true,
                leave: true,
            };
        }
    }

    fs.writeFileSync(databasePath, JSON.stringify(global.db, null, 2), 'utf-8');
}

module.exports = loadDatabase;