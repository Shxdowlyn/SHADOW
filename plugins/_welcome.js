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

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`;
  const rawName = conn.getName(userId) || 'Usuario';
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg');
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric' });
  const groupSize = groupMetadata.participants.length;
  const desc = groupMetadata.desc?.toString() || 'Sin descripción';

  // API para generar la imagen personalizada usando los datos del JSON
  const apiBanner = `https://api.aggelos-007.xyz/api/welcomev2?name=${encodeURIComponent(rawName)}&description=${encodeURIComponent('Disfruta tu estancia')}&pp=${encodeURIComponent(pp)}&bg=${encodeURIComponent('https://files.catbox.moe/gbp5x3.jpg')}&groupname=${encodeURIComponent(groupMetadata.subject)}&membercount=${groupSize}`;

  let caption;
  if (chat.welcomeText) {
    caption = chat.welcomeText.replace(/@user/g, username).replace(/@subject/g, groupMetadata.subject).replace(/@desc/g, desc);
  } else {
    caption = `╭─「 👻 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍: 𝐈𝐍𝐈𝐂𝐈𝐎 」─╮\n\n@user ha sido convocado por las sombras...\n\n🧿 Miembros: ${groupSize}\n📅 Fecha: ${fecha}\n\n> Usa *#setwelcome* para personalizar.`.replace(/@user/g, username);
  }

  return { banner: apiBanner, caption, mentions: [userId] };
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`;
  const rawName = conn.getName(userId) || 'Usuario';
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165081580-660d44.jpg');
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric' });
  const groupSize = groupMetadata.participants.length;

  // API para generar la imagen personalizada de despedida
  const apiBanner = `https://api.aggelos-007.xyz/api/goodbyev2?name=${encodeURIComponent(rawName)}&description=${encodeURIComponent('SE DESPIDE UNA SOMBRA...')}&pp=${encodeURIComponent(pp)}&bg=${encodeURIComponent('https://files.catbox.moe/gbp5x3.jpg')}&groupname=${encodeURIComponent(groupMetadata.subject)}&membercount=${groupSize}`;

  let caption;
  if (chat.byeText) {
    caption = chat.byeText.replace(/@user/g, username).replace(/@subject/g, groupMetadata.subject);
  } else {
    caption = `╭─「 🌌 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍: 𝐑𝐄𝐓𝐈𝐑𝐀𝐃𝐀 」─╮\n\n@user ha abandonado el círculo...\n\n📉 Miembros: ${groupSize}\n📅 Fecha: ${fecha}`.replace(/@user/g, username);
  }

  return { banner: apiBanner, caption, mentions: [userId] };
}

let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const chat = global.db.data.chats[m.chat];
  if (!chat || !chat.welcome) return !0;

  const userId = m.messageStubParameters[0];

  // BIENVENIDA
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { banner, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat });

    await conn.sendMessage(m.chat, { 
      image: { url: banner }, 
      caption: caption,
      mentions: mentions,
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: '🌌 Bienvenido a las Sombras',
          thumbnailUrl: getRandomIcono(),
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: null });
  }

  // DESPEDIDA
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    const { banner, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat });

    await conn.sendMessage(m.chat, { 
      image: { url: banner }, 
      caption: caption,
      mentions: mentions,
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: '🌌 Una sombra se ha desvanecido...',
          thumbnailUrl: getRandomIcono(),
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: null });
  }
};

export default handler;
