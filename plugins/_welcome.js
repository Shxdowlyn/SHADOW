import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'

const newsletterJid = '120363423523597117@newsletter';
const newsletterName = '👑 SHADOW-BOT-MD| ᴄʜᴀɴɴᴇʟ-ʙᴏᴛ 🌌';
const packname = 'shadow-BOT-MD'

const iconos = [
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165065152-94d843.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165081580-660d44.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165160074-de0e81.jpg',
  'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165128396-b5e568.jpg',
];

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

// Configuración de imagen basada en tu JSON
const welcomeBannerData = {
  "backgroundUrl": "https://files.catbox.moe/gbp5x3.jpg",
  "profileUrl": "https://unavatar.io/github/yosue891",
  "borderColor": "#00ffff"
};

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`;
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric' });
  const groupSize = groupMetadata.participants.length + 1;
  const desc = groupMetadata.desc?.toString() || 'Sin descripción';

  let caption = (chat.welcomeText || `╭─「 👻 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍: 𝐈𝐍𝐈𝐂𝐈𝐎 」─╮\n\n@user ha sido convocado...\nBienvenid@ a *@subject*.\n\n🧿 Miembros: ${groupSize}\n📅 Fecha: ${fecha}`)
    .replace(/@user/g, username)
    .replace(/@subject/g, groupMetadata.subject)
    .replace(/@desc/g, desc);

  return { caption, mentions: [userId] };
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`;
  const groupSize = groupMetadata.participants.length - 1;

  let caption = (chat.byeText || `╭─「 🌌 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍: 𝐑𝐄𝐓𝐈𝐑𝐀𝐃𝐀 」─╮\n\n@user ha abandonado las sombras.\n\n📉 Miembros: ${groupSize}`)
    .replace(/@user/g, username)
    .replace(/@subject/g, groupMetadata.subject);

  return { caption, mentions: [userId] };
}

let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const chat = global.db.data.chats[m.chat];
  if (!chat || !chat.welcome) return !0;

  const userId = m.messageStubParameters[0];

  const contextInfo = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: { newsletterJid, newsletterName, serverMessageId: -1 },
    externalAdReply: {
      title: 'YOSOYYO - Banner Generator',
      body: 'Shadow Garden Project',
      thumbnailUrl: welcomeBannerData.profileUrl,
      sourceUrl: global.redes,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  };

  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat });
    contextInfo.mentionedJid = mentions;
    // Usamos la URL directa del fondo para que WhatsApp no rechace el mensaje
    await conn.sendMessage(m.chat, { image: { url: welcomeBannerData.backgroundUrl }, caption, contextInfo }, { quoted: null });
  }

  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    const { caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat });
    contextInfo.mentionedJid = mentions;
    await conn.sendMessage(m.chat, { image: { url: welcomeBannerData.backgroundUrl }, caption, contextInfo }, { quoted: null });
  }
};

export { generarBienvenida, generarDespedida };
export default handler;
