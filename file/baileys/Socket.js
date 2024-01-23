const { default:makeWASocket, 
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  WASocket,
  makeInMemoryStore,
  jidDecode
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const fs = require('fs')
const log = require("../func/log.js")
const sessions = new Map()
const retryCount = new Map()
const chalk = require("chalk")
const Database = require("../database/database.js")

const usePairing = process.argv.includes('--pairing')
const database = new Database()

const credentials = {
  dir : "./temp/sessions/",
  prefix : "_sazumi",
};

const startSession = async(sessionId = 'sazumiviki') => {
  if (isSessionExistAndRunning(sessionId)) return getSession(sessionId)

  const { version } = await fetchLatestBaileysVersion();
  const startSocket = async() => {
      const { state, saveCreds } = await useMultiFileAuthState(credentials.dir + sessionId + credentials.prefix)
      const sock = makeWASocket({
        version: [2, 2316, 6],
        browser: ['Linux', 'Chrome', '1.0.0'],
        printQRInTerminal: false,
        syncFullHistory: true,
        auth: state,
        logger: pino({ level: "silent" }),
        markOnlineOnConnect: false,
      });

      sessions.set(sessionId, { ...sock })

      try {
        if (usePairing && !state.creds?.pairingCode) {
          let phoneNumber = await new Promise(resolve => readline.question(chalk.bgBlue('Enter Your Phone Number:'), resolve))
          phoneNumber = phoneNumber.replace(/\D/g, '')
          let code = await sock.requestPairingCode(phoneNumber)
          console.log(chalk.bgGreen('Your Pairing code:'), chalk.bold.blue(code.replace(/(.{4})/, '$1-')))
        }
      } catch (error) {
        console.error(chalk.bgRed('Error during pairing:'), chalk.red(error))
      } finally {}
      
      try{
          sock.ev.on('connection.update', (update) => {
              const { connection, lastDisconnect } = update
              if (connection == "connecting") {
                  log.debug(`SESSION : ${sessionId} Conecting.`)
              }
              if (connection === "close") {
                  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode

                  let retryAttempt = retryCount.get(sessionId) ?? 0;
                  let shouldRetry;
                  if (code != DisconnectReason.loggedOut && retryAttempt < 10) {
                      shouldRetry = true;
                  }
                  if (shouldRetry) {
                      retryAttempt++;
                  }
                  if (shouldRetry) {
                      retryCount.set(sessionId, retryAttempt);
                      startSocket();
                  } else {
                      log.error(`SESSION : ${sessionId} Disconnected.`)
                      retryCount.delete(sessionId);
                      deleteSession(sessionId);
                  }
              }
              if (connection == "open") {
                  log.info(`SESSION : ${sessionId} Connected.`)
                  retryCount.delete(sessionId);
              }
          })
          sock.ev.on("creds.update", async () => {
              await saveCreds();
          })
      }catch(e){
          log.error("SOCKET : "+e)
      }
      
      return sock
  }

  return startSocket()
}

const getSession = (sessionId = 'sazumiviki') => {
  return sessions.get(sessionId)
}

const isSessionExistAndRunning = (sessionId) => {
  if (
      fs.existsSync(credentials.dir) &&
      fs.existsSync(credentials.dir + sessionId + credentials.prefix) &&
      fs.readdirSync(credentials.dir + sessionId + credentials.prefix).length &&
      getSession(sessionId)
  ) {
      return true;
  }
  return false;
}

const shouldLoadSession = (sessionId) => {
  if (
      fs.existsSync(credentials.dir) &&
      fs.existsSync(credentials.dir + sessionId + credentials.prefix) &&
      fs.readdirSync(credentials.dir + sessionId + credentials.prefix).length &&
      !getSession(sessionId)
  ) {
      return true;
  }
  return false;
}

const loadSessionsFromStorage = async() => {
  if (!fs.existsSync(credentials.dir)) {
      fs.mkdirSync(credentials.dir);
  }
  fs.readdir(credentials.dir, async (err, dirs) => {
      if (err) {
          throw err;
      }
      for (const dir of dirs) {
          const sessionId = dir.split("_")[0];
          if (!shouldLoadSession(sessionId)) continue;
          startSession(sessionId);
      }
  })
}

const deleteSession = async(sessionId = 'ilsya') => {
  const session = getSession(sessionId)
  try{
      await session?.logout()
  }catch{}
  session?.end(undefined);
  sessions.delete(sessionId);
  if (fs.existsSync(credentials.dir + sessionId + credentials.prefix)) {
    fs.rmSync(credentials.dir + sessionId + credentials.prefix, { force: true, recursive: true });
  }
}

module.exports = {
  startSession,
  getSession,
  loadSessionsFromStorage
}