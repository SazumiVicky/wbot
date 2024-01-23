const { serialize } = require("../func/sazumiviki.serialize.js");
const { commands, _commands } = require("../func/loadCommands.js");
const log = require("../func/log.js");
const config = require("../../config.js");
const chalk = require("chalk")

class onMessageReceived {
  constructor(m, sock) {
    this.m = m;
    this.sock = sock;
  }

  async main() {
    let m = serialize(this.sock, this.m.messages?.[0]);
    if (!m.message) return;
    if (m.key && m.key.remoteJid == "status@broadcast") return;
    if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return;

    m.isOwner = config.owner.find((v) => v + "@s.whatsapp.net" == m.sender)
      ? true
      : false;
    m.groupMetadata = m.isGroup
      ? await this.sock.groupMetadata(m.key.remoteJid)
      : {};
    let participant_sender =
      (m.isGroup
        ? m.groupMetadata.participants.find((v) => v.id == m.sender)
        : {}) || {};
    let participant_bot =
      (m.isGroup
        ? m.groupMetadata.participants.find((v) => v.id == m.botNumber)
        : {}) || {};
    m.isSuperAdmin = participant_sender?.admin == "superadmin" ? true : false;
    m.isAdmin =
      m.isSuperAdmin || participant_sender?.admin == "admin" ? true : false;
    m.isBotAdmin = participant_bot?.admin == "admin" ? true : false;

    require("../database/loadDatabase.js")(m)
    
    if (m.message) {
    	console.log(
    	chalk.bgMagenta(' [===>] '),
    	chalk.cyanBright('Time: ') + chalk.greenBright(new Date()) + '\n',
    	chalk.cyanBright('Message: ') + chalk.greenBright(m.body || m.mtype) + '\n' +
    	chalk.cyanBright('From:'), chalk.greenBright(m.pushName), chalk.yellow('- ' + m.sender) + '\n' +
    	chalk.cyanBright('Chat Type:'), chalk.greenBright(!m.isGroup ? 'Private Chat' : 'Group Chat - ' + chalk.yellow(m.from))
        );
    }
    // console.log(participant_bot);
    try {
      let shouldContinue = true;
      for (let _command of _commands) {
        const next = await _command[1].run({ m, sock: this.sock });
        shouldContinue = next;
        break;
      }

      if (!shouldContinue) return;

      const command = Array.from(commands.values()).find((v) =>
        v.cmd.find(
          (x) => x.toLowerCase() == m.commandWithoutPrefix.toLowerCase(),
        ),
      );
      if (!command) return;
      if (!m.withPrefix) {
        if (!command.options?.withoutPrefix) return;
      }
      command.run({ m, sock: this.sock });
    } catch (e) {
      log.error(e);
    }
  }
}

module.exports = onMessageReceived;
