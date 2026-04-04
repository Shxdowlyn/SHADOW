import { WAMessageStubType } from '@whiskeysockets/baileys'

const packname = 'shadow-BOT-MD'

const iconos = [
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165065152-94d843.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165081580-660d44.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165160074-de0e81.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165128396-b5e568.jpg',
]

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)]

const participantCache = {}

function resolvePhoneJid(raw = '') {
  if (!raw) return ''
  const stripped = raw.replace(/@.*/, '').replace(/\D/g, '')
  return stripped ? `${stripped}@s.whatsapp.net` : ''
}

function resolveUserJid(rawId, participants, groupId) {
  const found = participants.find(p => p.id === rawId || p.lid === rawId || p.jid === rawId)
  if (found) {
    const phoneSource = found.phoneNumber || found.pn || found.jid || ''
    if (phoneSource && !phoneSource.endsWith('@lid')) return resolvePhoneJid(phoneSource)
  }
  const cached = participantCache[groupId]?.[rawId]
  if (cached) return cached
  if (!rawId.endsWith('@lid')) return rawId.includes('@') ? rawId : `${rawId}@s.whatsapp.net`
  return rawId
}

function cacheParticipants(groupId, participants = []) {
  if (!participantCache[groupId]) participantCache[groupId] = {}
  for (const p of participants) {
    const phoneJid = resolvePhoneJid(p.phoneNumber || p.pn || p.jid || '')
    if (!phoneJid) continue
    if (p.lid) participantCache[groupId][p.lid] = phoneJid
    if (p.id) participantCache[groupId][p.id] = phoneJid
    if (p.jid) participantCache[groupId][p.jid] = phoneJid
  }
}

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  if (groupMetadata?.participants?.length) cacheParticipants(m.chat, groupMetadata.participants)

  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat || !chat.welcome) return !0

  const rawId = m.messageStubParameters[0]
  const userJid = resolveUserJid(rawId, groupMetadata.participants, m.chat)

  if (userJid.endsWith('@lid')) return !0

  const userTag = userJid.split('@')[0]
  const userName = conn.getName(userJid) || userTag
  const pp = await conn.profilePictureUrl(userJid, 'image').catch(() => 'https://files.catbox.moe/gbp5x3.jpg')
  const groupName = groupMetadata.subject
  const groupSize = groupMetadata.participants.length
  const fecha = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Santo_Domingo', day: 'numeric', month: 'long', year: 'numeric' })
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  // --- CONFIGURACIÓN DEL CONTACTO FALSO (FKONTAK) ---
  const fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'ShadowWelcome' },
    message: {
      contactMessage: {
        displayName: userName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${userName}\nTEL;type=CELL;type=VOICE;waid=${userTag}:${userTag}\nEND:VCARD`
      }
    }
  }

  // --- LÓGICA DE BIENVENIDA ---
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const welcomeImg = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent('https://files.catbox.moe/gbp5x3.jpg')}&text1=${encodeURIComponent(userName)}&text2=Bienvenido+a+${encodeURIComponent(groupName)}&text3=Miembro+${groupSize}&avatar=${encodeURIComponent(pp)}`

    const caption = chat.welcomeText
      ? chat.welcomeText.replace(/@subject/g, groupName).replace(/@desc/g, desc).replace(/@user/g, `@${userTag}`)
      : `╭─「 👻 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍 」─╮\n\n${userName} ha sido convocado...\nBienvenid@ a *${groupName}*.\n\n🧿 Miembros: ${groupSize}\n📅 Fecha: ${fecha}\n\n> Usa *#setwelcome* para personalizar.`

    await conn.sendMessage(m.chat, {
      product: {
        productImage: { url: welcomeImg },
        productId: 'welcome-001',
        title: '─ W E L C O M E ─🥷🏻',
        currencyCode: 'USD',
        priceAmount1000: '0',
        retailerId: 1677,
        productImageCount: 1
      },
      businessOwnerJid: '0@s.whatsapp.net',
      caption: caption,
      footer: `© ${packname} · Welcome`,
      interactiveButtons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({ display_text: '👤 Registrarme', id: `#reg ${userName}.18` })
        }
      ],
      mentions: [userJid],
      contextInfo: {
        externalAdReply: {
          title: 'Welcome to Shadow Garden',
          body: groupName,
          thumbnailUrl: getRandomIcono(),
          mediaType: 1,
          showAdAttribution: true,
          sourceUrl: 'https://wa.me/584242773183'
        }
      }
    }, { quoted: fkontak })
  }

  // --- LÓGICA DE DESPEDIDA ---
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    const goodbyeImg = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent('https://files.catbox.moe/gbp5x3.jpg')}&text1=${encodeURIComponent(userName)}&text2=Se+fue+de+${encodeURIComponent(groupName)}&text3=Adiós+Sombra&avatar=${encodeURIComponent(pp)}`

    const caption = chat.byeText
      ? chat.byeText.replace(/@subject/g, groupName).replace(/@user/g, `@${userTag}`)
      : `╭─「 🌌 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍 」─╮\n\n${userName} abandonó el círculo.\nSu presencia se desvanece...\n\n📉 Miembros: ${groupSize}\n📅 Fecha: ${fecha}\n\n> Usa *#setbye* para personalizar.`

    await conn.sendMessage(m.chat, {
      product: {
        productImage: { url: goodbyeImg },
        productId: 'goodbye-001',
        title: '─ Ａ Ｄ Ｉ Ｏ Ｓ ─👋🏻',
        currencyCode: 'USD',
        priceAmount1000: '0',
        retailerId: 1677,
        productImageCount: 1
      },
      businessOwnerJid: '0@s.whatsapp.net',
      caption: caption,
      footer: `© ${packname} · Goodbye`,
      interactiveButtons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({ display_text: '👤 Registrarme', id: `#reg ${userName}.18` })
        }
      ],
      mentions: [userJid],
      contextInfo: {
        externalAdReply: {
          title: 'Farewell from Shadow Garden',
          body: groupName,
          thumbnailUrl: getRandomIcono(),
          mediaType: 1,
          showAdAttribution: true,
          sourceUrl: 'https://wa.me/584242773183'
        }
      }
    }, { quoted: fkontak })
  }
}

export default handler
