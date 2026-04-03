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
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg');
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric' });
  const groupSize = groupMetadata.participants.length + 1;
  const desc = groupMetadata.desc?.toString() || 'Sin descripción';

  // Configuración del banner de bienvenida
  const bannerUrl = "https://files.catbox.moe/gbp5x3.jpg"; 

  let caption;
  if (chat.welcomeText) {
    caption = chat.welcomeText
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject)
      .replace(/@desc/g, desc);
  } else {
    const defaultWelcomeMessage = `╭─「 👻 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍: 𝐈𝐍𝐈𝐂𝐈𝐎 」─╮\n\n@user ha sido convocado por las sombras...\nBienvenid@ al dominio secreto de *@subject*.\n\nTu llegada no es casual. Cada paso será observado.\nTu poder será forjado en silencio. Tu lealtad, puesta a prueba.\n\n╰─「 🌌 𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 」─╯\n🧿 Miembros: ${groupSize}\n📅 Fecha: ${fecha}\n📜 Descripción:\n${desc}\n\n> Usa *#setwelcome* para personalizar este mensaje.`;

    caption = defaultWelcomeMessage
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject);
  }

  return { pp, caption, bannerUrl, mentions: [userId] };
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`;
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763165081580-660d44.jpg');
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric' });
  const groupSize = groupMetadata.participants.length - 1;

  // Configuración del banner de despedida (usando el link del JSON)
  const bannerUrl = "https://files.catbox.moe/gbp5x3.jpg";

  let caption;
  if (chat.byeText) {
    caption = chat.byeText
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject);
  } else {
    const defaultByeMessage = `╭─「 🌌 𝐒𝐇𝐀𝐃𝐎𝐖 𝐆𝐀𝐑𝐃𝐄𝐍: 𝐑𝐄𝐓𝐈𝐑𝐀𝐃𝐀 」─╮\n\n@user ha abandonado el círculo de las sombras.\nSu presencia se desvanece... como todo lo que no deja huella.\n\nGrupo: *@subject*\n\nQue su memoria permanezca en silencio.\nLas sombras no olvidan, pero tampoco lloran.\n\n╰─「 🌌 𝐄𝐒𝐓𝐀𝐃𝐎 𝐀𝐂𝐓𝐔𝐀𝐋 」─╯\n📉 Miembros: ${groupSize}\n📅 Fecha: ${fecha}\n\n> Usa *#setbye* para personalizar este mensaje.`;

    caption = defaultByeMessage
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject);
  }

  return { pp, caption, bannerUrl, mentions: [userId] };
}

let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const chat = global.db.data.chats[m.chat];
  if (!chat) return !0;

  const primaryBot = chat.botPrimario;
  if (primaryBot && conn.user.jid !== primaryBot) return !0;

  const userId = m.messageStubParameters[0];

  // LÓGICA DE BIENVENIDA
  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { pp, caption, bannerUrl, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat });

    const contextInfo = {
      mentionedJid: mentions,
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: '🌌 𝐒𝐡𝐚𝐝𝐨𝐰 𝐆𝐚𝐫𝐝𝐞𝐧 𝐭𝐞 𝐝𝐚 𝐥𝐚 𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚...',
        thumbnailUrl: pp, // Usamos la foto del usuario aquí para que se vea mejor
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };

    // Enviamos la imagen del banner con el caption (Sin el texto JSON feo)
    await conn.sendMessage(m.chat, { image: { url: bannerUrl }, caption, contextInfo }, { quoted: null });
  }

  // LÓGICA DE DESPEDIDA
  if (chat.welcome && (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
    const { pp, caption, bannerUrl, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat });

    const contextInfo = {
      mentionedJid: mentions,
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: '🌌 𝐋𝐚𝐬 𝐬𝐨𝐦𝐛𝐫𝐚𝐬 𝐬𝐞 𝐜𝐢𝐞𝐫𝐫𝐚𝐧 𝐬𝐢𝐧 𝐫𝐞𝐦𝐨𝐫𝐬𝐨...',
        thumbnailUrl: pp,
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };

    // Enviamos la imagen del banner de despedida con su caption
    await conn.sendMessage(m.chat, { image: { url: bannerUrl }, caption, contextInfo }, { quoted: null });
  }
};

export { generarBienvenida, generarDespedida };
export default handler;
