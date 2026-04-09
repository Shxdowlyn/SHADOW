// Handler para .mlt
const handler = async (m, { conn }) => {
  // Construimos la estructura JSON simulada
  const estructura = {
    comando: '.mlt',
    modo: 'SERIALIZADO',
    inspeccion: '🔍 INSPECCIÓN DE ESTRUCTURA',
    contenido: [
      { linea: 'color', estilo: 'white' },
      { linea: 'color', estilo: 'blue' },
      { linea: 'color', estilo: 'orange' },
      { linea: 'color', estilo: 'green' },
      { linea: 'color', estilo: 'pink' },
      { linea: 'color', estilo: 'gray' }
    ]
  };

  // Texto dramático estilo Shadow Garden
  const salida = `
~ ${m.pushName}
${estructura.comando}
${estructura.inspeccion}
Modo: ${estructura.modo}

Código en Colores
${estructura.contenido.map(c => c.linea).join('\n')}
`;

  // Enviar la respuesta
  await conn.sendMessage(m.chat, { text: salida }, { quoted: m });
};

// Registro del comando
handler.command = /^mlt$/i;
handler.help = ['mlt'];
handler.tags = ['tools'];

export default handler;
