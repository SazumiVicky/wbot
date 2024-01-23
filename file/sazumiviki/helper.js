function formatRuntime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedTime = `${hours}h ${minutes}m ${remainingSeconds}s`;

  return formattedTime;
}

function getVersionFromPackageJson() {
  try {
    const packageJson = fs.readFileSync('./package.json', 'utf8');
    const { version } = JSON.parse(packageJson);
    return version;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return 'Unknown';
  }
}

const Styles = (text, style = 1) => {
  if (typeof text !== 'string') {
    return text;
  }

  var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = Object.freeze({
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  });
  var replacer = [];
  xStr.map((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split('')[i]
  }));
  var str = text.toLowerCase().split('');
  var output = [];
  str.map(v => {
    const find = replacer.find(x => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};


const smsg = (conn, m, hasParent) => {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  m = M.fromObject(m);
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false;
    m.chat = conn.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '');
    m.isGroup = m.chat.endsWith('@g.us');
    m.sender = conn.decodeJid(m.key.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '');
    m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, conn.user.id);
  }
  if (m.message) {
    let mtype = Object.keys(m.message);
    m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) ||
        (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) ||
        mtype[mtype.length - 1];

    m.msg = m.message[m.mtype];

    if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) {
      m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender;
    }

    if (m.mtype == 'protocolMessage' && m.msg.key) {
      if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat;
      if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender;
      m.msg.key.fromMe = conn.decodeJid(m.msg.key.participant) === conn.decodeJid(conn.user.id);
      if (!m.msg.key.fromMe && m.msg.key.remoteJid === conn.decodeJid(conn.user.id)) m.msg.key.remoteJid = m.sender;
    }

    m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || '';
    if (typeof m.text !== 'string') {
      if (['protocolMessage', 'messageContextInfo', 'stickerMessage', 'audioMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) {
        m.text = '';
      } else {
        m.text = m.text.selectedDisplayText || m.text.hydratedTemplate?.hydratedContentText || m.text;
      }
    }

    m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || [];
    let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null;

    if (m.quoted) {
      let type = Object.keys(m.quoted)[0];
      m.quoted = m.quoted[type];
      if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };

      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender);
      m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false;
      m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === conn.user.jid;
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || '';
      m.quoted.name = conn.getName(m.quoted.sender);
      m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || [];

      let vM = m.quoted.fakeObj = M.fromObject({
        key: {
          fromMe: m.quoted.fromMe,
          remoteJid: m.quoted.chat,
          id: m.quoted.id
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {})
      });

      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return null;
        let q = M.fromObject(await conn.loadMessage(m.quoted.id) || vM);
        return smsg(conn, q);
      };

      if (m.quoted.url || m.quoted.directPath) {
        m.quoted.download = (saveToFile = false) => conn.downloadM(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile);
      }
    }
  }

  return m;
};

module.exports = {
  Styles,
  formatRuntime,
  smsg,
  getVersionFromPackageJson
};
