import { performance } from 'node:perf_hooks'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

let handler = async (m, { conn }) => {
  const start = performance.now()
  const userId = m.sender
  const userName = escapeXml(conn.getName(userId) || 'Usuario')
  const userNumber = userId.split('@')[0]
  const botname = escapeXml(global.author || 'Shadow Bot')

  const { key } = await conn.reply(m.chat, '❐ 𝐂𝐚𝐥𝐜𝐮𝐥𝐚𝐧𝐝𝐨 𝐏𝐢𝐧𝐠... 🚀', m)

  try {
    const ping = Math.max(0, Math.round(performance.now() - start))
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)
    const uptimeText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    const shadowPath = path.join(process.cwd(), 'lib', 'Shadow.webp')
    const shadowBuffer = fs.existsSync(shadowPath) ? fs.readFileSync(shadowPath) : null

    const width = 1600
    const height = 900

    const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#04020c"/>
      <stop offset="50%" stop-color="#0e0520"/>
      <stop offset="100%" stop-color="#1a0a36"/>
    </linearGradient>
    <radialGradient id="glowTop" cx="75%" cy="10%" r="55%">
      <stop offset="0%" stop-color="#9b4dff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#9b4dff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBot" cx="10%" cy="90%" r="40%">
      <stop offset="0%" stop-color="#f0c040" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#f0c040" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardLeft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#130a24" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#080412" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="cardRight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#160d28" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0a0618" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="miniCard" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1e1035" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#120920" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="outerBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0c040"/>
      <stop offset="50%" stop-color="#c080ff"/>
      <stop offset="100%" stop-color="#f0c040"/>
    </linearGradient>
    <linearGradient id="accentGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f0c040"/>
      <stop offset="100%" stop-color="#e09020"/>
    </linearGradient>
    <linearGradient id="accentPurple" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c080ff"/>
      <stop offset="100%" stop-color="#8040e0"/>
    </linearGradient>
    <filter id="cardShadow">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
    <filter id="glowFilter">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softBlur">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
    <clipPath id="outerClip">
      <rect x="60" y="60" width="1480" height="780" rx="36"/>
    </clipPath>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#glowTop)"/>
  <rect width="1600" height="900" fill="url(#glowBot)"/>

  <g opacity="0.06">
    <line x1="0" y1="150" x2="1600" y2="150" stroke="#ffffff" stroke-width="1"/>
    <line x1="0" y1="300" x2="1600" y2="300" stroke="#ffffff" stroke-width="1"/>
    <line x1="0" y1="450" x2="1600" y2="450" stroke="#ffffff" stroke-width="1"/>
    <line x1="0" y1="600" x2="1600" y2="600" stroke="#ffffff" stroke-width="1"/>
    <line x1="0" y1="750" x2="1600" y2="750" stroke="#ffffff" stroke-width="1"/>
    <line x1="200" y1="0" x2="200" y2="900" stroke="#ffffff" stroke-width="1"/>
    <line x1="400" y1="0" x2="400" y2="900" stroke="#ffffff" stroke-width="1"/>
    <line x1="800" y1="0" x2="800" y2="900" stroke="#ffffff" stroke-width="1"/>
    <line x1="1200" y1="0" x2="1200" y2="900" stroke="#ffffff" stroke-width="1"/>
    <line x1="1400" y1="0" x2="1400" y2="900" stroke="#ffffff" stroke-width="1"/>
  </g>

  <rect x="60" y="60" width="1480" height="780" rx="36" fill="none" stroke="url(#outerBorder)" stroke-width="2.5" filter="url(#cardShadow)"/>
  <rect x="68" y="68" width="1464" height="764" rx="30" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>

  <rect x="60" y="60" width="1480" height="115" rx="36" fill="#0a0518" fill-opacity="0.85"/>
  <rect x="60" y="138" width="1480" height="37" fill="#0a0518" fill-opacity="0.85"/>
  <line x1="60" y1="175" x2="1540" y2="175" stroke="url(#outerBorder)" stroke-width="1.5" stroke-opacity="0.6"/>

  <text x="108" y="108" fill="#f0c040" font-size="18" font-family="'Courier New', monospace" letter-spacing="5" opacity="0.85">KAGE NO JITSURYOKUSHA NI NARITAKUTE</text>
  <text x="108" y="158" fill="#ffffff" font-size="52" font-weight="900" font-family="'Arial Black', 'Arial Bold', sans-serif" letter-spacing="8">PONGSHADOW</text>
  <text x="108" y="163" fill="url(#accentGold)" font-size="52" font-weight="900" font-family="'Arial Black', 'Arial Bold', sans-serif" letter-spacing="8" opacity="0.15">PONGSHADOW</text>

  <rect x="1140" y="76" width="360" height="60" rx="16" fill="#08040e" stroke="url(#accentGold)" stroke-width="1.5" stroke-opacity="0.8"/>
  <text x="1320" y="114" text-anchor="middle" fill="#f0c040" font-size="22" font-weight="700" font-family="'Courier New', monospace" letter-spacing="2">${botname}</text>

  <rect x="76" y="190" width="720" height="36" rx="0" fill="none"/>
  <text x="108" y="212" fill="#c080ff" font-size="18" font-family="'Courier New', monospace" letter-spacing="3" opacity="0.9">SHADOW GARDEN INTERFACE  ·  PERFORMANCE CARD</text>

  <g transform="translate(80 230)">
    <rect x="0" y="0" width="680" height="580" rx="20" fill="url(#cardLeft)" stroke="#f0c040" stroke-opacity="0.2" stroke-width="1.5"/>

    <rect x="20" y="18" width="640" height="44" rx="10" fill="#f0c040" fill-opacity="0.08"/>
    <text x="40" y="48" fill="#f0c040" font-size="26" font-weight="700" font-family="'Arial Black', sans-serif" letter-spacing="3">PING STATUS</text>
    <rect x="520" y="24" width="120" height="32" rx="16" fill="url(#accentGold)" fill-opacity="0.15" stroke="#f0c040" stroke-opacity="0.5" stroke-width="1"/>
    <text x="580" y="45" text-anchor="middle" fill="#f0c040" font-size="14" font-family="'Courier New', monospace" letter-spacing="1">LATENCY</text>

    <rect x="20" y="82" width="640" height="70" rx="12" fill="url(#miniCard)" stroke="#f0c040" stroke-opacity="0.15" stroke-width="1"/>
    <text x="40" y="108" fill="#f0c040" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">TIEMPO DE RESPUESTA</text>
    <text x="40" y="140" fill="#ffffff" font-size="34" font-weight="700" font-family="'Arial Black', sans-serif">${ping} <tspan font-size="18" fill="#f0c040" opacity="0.8">ms</tspan></text>
    <rect x="540" y="92" width="100" height="26" rx="13" fill="#f0c040" fill-opacity="0.18"/>
    <text x="590" y="110" text-anchor="middle" fill="#f0c040" font-size="12" font-family="'Courier New', monospace">${ping < 100 ? 'RAPIDO' : ping < 300 ? 'NORMAL' : 'LENTO'}</text>

    <rect x="20" y="170" width="640" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="40" y="196" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">USUARIO</text>
    <text x="40" y="228" fill="#ffffff" font-size="26" font-weight="700" font-family="'Arial Black', sans-serif">${userName}</text>

    <rect x="20" y="258" width="640" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="40" y="284" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">NUMERO</text>
    <text x="40" y="316" fill="#ffffff" font-size="26" font-weight="700" font-family="'Courier New', monospace">@${userNumber}</text>

    <rect x="20" y="346" width="308" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="40" y="372" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">ESTADO</text>
    <circle cx="55" cy="398" r="8" fill="#00e676" opacity="0.9"/>
    <text x="72" y="404" fill="#00e676" font-size="22" font-weight="700" font-family="'Arial Black', sans-serif">ONLINE</text>

    <rect x="352" y="346" width="308" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="372" y="372" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">UPTIME</text>
    <text x="372" y="404" fill="#ffffff" font-size="26" font-weight="700" font-family="'Courier New', monospace">${uptimeText}</text>

    <rect x="20" y="434" width="640" height="70" rx="12" fill="url(#miniCard)" stroke="#f0c040" stroke-opacity="0.12" stroke-width="1"/>
    <text x="40" y="460" fill="#f0c040" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">POTENCIA DEL SISTEMA</text>
    <rect x="40" y="474" width="540" height="14" rx="7" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="40" y="474" width="540" height="14" rx="7" fill="url(#accentGold)" opacity="0.85"/>
    <text x="620" y="490" text-anchor="end" fill="#f0c040" font-size="16" font-weight="700" font-family="'Courier New', monospace">100%</text>

    <rect x="20" y="522" width="640" height="38" rx="8" fill="#f0c040" fill-opacity="0.05"/>
    <text x="40" y="547" fill="#f0c040" font-size="14" font-family="'Courier New', monospace" letter-spacing="1" opacity="0.6">POWER: 100% CAPACITY  ·  LINUX SPEED: MAXIMA VELOCIDAD</text>
  </g>

  <g transform="translate(790 230)">
    <rect x="0" y="0" width="690" height="580" rx="20" fill="url(#cardRight)" stroke="#c080ff" stroke-opacity="0.2" stroke-width="1.5"/>

    <rect x="20" y="18" width="650" height="44" rx="10" fill="#c080ff" fill-opacity="0.08"/>
    <text x="40" y="48" fill="#c080ff" font-size="26" font-weight="700" font-family="'Arial Black', sans-serif" letter-spacing="3">SHADOW MODE</text>
    <rect x="520" y="24" width="130" height="32" rx="16" fill="#c080ff" fill-opacity="0.15" stroke="#c080ff" stroke-opacity="0.5" stroke-width="1"/>
    <text x="585" y="45" text-anchor="middle" fill="#c080ff" font-size="14" font-family="'Courier New', monospace" letter-spacing="1">KAGE VIBES</text>

    <rect x="20" y="82" width="650" height="70" rx="12" fill="url(#miniCard)" stroke="#c080ff" stroke-opacity="0.15" stroke-width="1"/>
    <text x="40" y="108" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">DOMINIO</text>
    <text x="40" y="140" fill="#ffffff" font-size="28" font-weight="700" font-family="'Arial Black', sans-serif">${botname}</text>

    <rect x="20" y="170" width="308" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="40" y="196" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">TIERRA</text>
    <text x="40" y="228" fill="#ffffff" font-size="22" font-weight="700" font-family="'Arial Black', sans-serif">Shadow Garden</text>

    <rect x="362" y="170" width="308" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="382" y="196" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">SISTEMA</text>
    <text x="382" y="228" fill="#ffffff" font-size="22" font-weight="700" font-family="'Arial Black', sans-serif">Max Speed</text>

    <rect x="20" y="258" width="650" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="40" y="284" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">PERFIL</text>
    <text x="40" y="316" fill="#ffffff" font-size="22" font-weight="700" font-family="'Arial Black', sans-serif">Convocado por las sombras</text>

    <rect x="20" y="346" width="308" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="40" y="372" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">BOT MODE</text>
    <circle cx="55" cy="398" r="8" fill="#c080ff" opacity="0.9"/>
    <text x="72" y="404" fill="#c080ff" font-size="22" font-weight="700" font-family="'Arial Black', sans-serif">ACTIVO</text>

    <rect x="352" y="346" width="308" height="70" rx="12" fill="url(#miniCard)" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <text x="372" y="372" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">PLATAFORMA</text>
    <text x="372" y="404" fill="#ffffff" font-size="20" font-weight="700" font-family="'Courier New', monospace">WhatsApp</text>

    <rect x="20" y="434" width="650" height="70" rx="12" fill="url(#miniCard)" stroke="#c080ff" stroke-opacity="0.15" stroke-width="1"/>
    <text x="40" y="460" fill="#c080ff" font-size="13" font-family="'Courier New', monospace" letter-spacing="2" opacity="0.7">OWNER</text>
    <text x="40" y="492" fill="#ffffff" font-size="26" font-weight="700" font-family="'Arial Black', sans-serif">Yosue <tspan fill="#f0c040">(Shadow)</tspan> &amp; Ado</text>

    <rect x="20" y="522" width="650" height="38" rx="8" fill="#c080ff" fill-opacity="0.05"/>
    <text x="40" y="547" fill="#c080ff" font-size="14" font-family="'Courier New', monospace" letter-spacing="1" opacity="0.6">SHADOW GARDEN INTERFACE  ·  GENERATED IN REAL TIME</text>
  </g>

  <text x="108" y="868" fill="#ffffff" fill-opacity="0.35" font-size="16" font-family="'Courier New', monospace" letter-spacing="2">SHADOW GARDEN INTERFACE  ·  PING VISUAL CARD</text>
  <text x="1492" y="868" text-anchor="end" fill="#f0c040" fill-opacity="0.5" font-size="16" font-family="'Courier New', monospace">© ${botname}</text>

  <g opacity="0.12">
    <polygon points="1540,62 1560,80 1540,98 1520,80" fill="#f0c040"/>
    <polygon points="62,820 80,838 62,856 44,838" fill="#c080ff"/>
  </g>
</svg>`

    let base = sharp(Buffer.from(svg)).png()

    if (shadowBuffer) {
      const resized = await sharp(shadowBuffer)
        .resize(520, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer()

      base = base.composite([
        { input: resized, left: 1050, top: 170, blend: 'over' }
      ])
    }

    const image = await base.toBuffer()

    const fkontak = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'ShadowPing'
      },
      message: {
        contactMessage: {
          displayName: botname,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${botname}\nORG:${botname};\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`
        }
      }
    }

    await conn.sendMessage(m.chat, { delete: key })

    await conn.sendMessage(m.chat, {
      image,
      caption: `✨ ¡𝐏𝐎𝐍𝐆! ✨\n\n> 🌌 𝐓𝐢𝐞𝐦𝐩𝐨: ${ping}𝐦𝐬\n> 👤 𝐔𝐬𝐮𝐚𝐫𝐢𝐨: ${userName} (@${userNumber})\n> 👑 𝐃𝐮𝐞𝐧̃𝐨𝐬: 𝐘𝐨𝐬𝐮𝐞 (𝐒𝐡𝐚𝐝𝐨𝐰) & 𝐀𝐝𝐨\n> 🏎️ 𝐋𝐢𝐧𝐮𝐱 𝐒𝐩𝐞𝐞𝐝: 𝐌𝐚́𝐱𝐢𝐦𝐚 𝐕𝐞𝐥𝐨𝐜𝐢𝐝𝐚𝐝 🚀\n\n*જ 𝐒𝐡𝐚𝐝𝐨𝐰 𝐆𝐚𝐫𝐝𝐞𝐧 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 🧪 𖤓*`,
      footer: `© ${botname} · Pong shadow`,
      mentions: [userId]
    }, { quoted: fkontak })

  } catch (e) {
    console.error('PING ERROR:', e)
    await conn.sendMessage(m.chat, { text: `❌ Error en el sistema de ping.\n\n${e?.message || e}` }, { quoted: m })
  }
}

handler.help = ['ping']
handler.tags = ['informacion']
handler.command = ['ping', 'p']

export default handler
