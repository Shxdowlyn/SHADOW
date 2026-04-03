import { WAMessageStubType } from '@whiskeysockets/baileys'

const newsletterJid = '120363423523597117@newsletter'
const newsletterName = '👑 SHADOW-BOT-MD| ᴄʜᴀɴɴᴇʟ-ʙᴏᴛ 🌌'
const packname = 'shadow-BOT-MD'

const iconos = [
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165065152-94d843.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165081580-660d44.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165160074-de0e81.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165128396-b5e568.jpg',
]

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)]

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  // Acceso seguro a la base de datos
  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat || !chat.welcome) return !0

  const userId = m.messageStubParameters[0]
  const userJid = userId.includes('@') ? userId : `${userId}@s.whatsapp.net`
  const userName = conn.getName(userJid) || 'Usuario'
  
  // Foto de perfil del que entra/sale
  const pp = await conn.profilePictureUrl(userJid, 'image').catch(() => 'https://files.catbox.moe/gbp5x3.jpg')
  const groupName = groupMetadata.subject
  const groupSize = groupMetadata.participants.length
  
  // BIENVENIDA
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const welcomeApi = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent('https://files.catbox.moe/gbp5x3.jpg')}&text1=${encodeURIComponent(userName)}&text2=Bienvenido+a+${encodeURIComponent(groupName)}&text3=Miembro+${groupSize}&avatar=${encodeURIComponent(pp)}`

    let txt = chat.welcomeText ? chat.welcomeText.replace(/@user/g, `@${userId.split('@')[0]}`).replace(/@subject/g, groupName) : `╭─「 👻 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍 」─╮\n\n@${userId.split('@')[0]} ha sido convocado por las sombras.\n\n╰─「 🌌 𝐈𝐍𝐅𝐎 」─╯`

    await conn.sendMessage(m.chat, { 
      image: { url: welcomeApi }, 
      caption: txt,
      mentions: [userJid],
      contextInfo: {
        externalAdReply: {
          title: 'Welcome to Shadow Garden',
          body: packname,
          thumbnailUrl: getRandomIcono(),
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: null })
  }

  // DESPEDIDA
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    const goodbyeApi = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent('https://files.catbox.moe/gbp5x3.jpg')}&text1=${encodeURIComponent(userName)}&text2=Se+fue+de+${encodeURIComponent(groupName)}&text3=Adiós+Sombra&avatar=${encodeURIComponent(pp)}`

    let txt = chat.byeText ? chat.byeText.replace(/@user/g, `@${userId.split('@')[0]}`).replace(/@subject/g, groupName) : `╭─「 🌌 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍 」─╮\n\n@${userId.split('@')[0]} ha abandonado el círculo.\n\n╰─「 📉 𝐄𝐒𝐓𝐀𝐃𝐎 」─╯`

    await conn.sendMessage(m.chat, { 
      image: { url: goodbyeApi }, 
      caption: txt,
      mentions: [userJid],
      contextInfo: {
        externalAdReply: {
          title: 'Farewell from Shadow Garden',
          body: packname,
          thumbnailUrl: getRandomIcono(),
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: null })
  }
}

export default handler
