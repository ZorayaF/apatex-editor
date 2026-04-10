/**
 * Parser Heurístico de Referencias Bibliográficas
 * Soporta múltiples formatos de artículos científicos y autores.
 */
export function parseReference(input) {
  const cleanInput = input.trim().replace(/\s+/g, " ");

  // --- REGLA DEL PIVOTE (AÑO) ---
  const yearRegex = /(\(?\b(1[89]\d{2}|20\d{2})\b\)?)/;
  const yearMatch = cleanInput.match(yearRegex);

  let zoneA, zoneB, zoneC;
  if (yearMatch) {
    const splitIndex = yearMatch.index;
    zoneA = cleanInput.substring(0, splitIndex).trim();
    zoneB = yearMatch[2];
    zoneC = cleanInput.substring(splitIndex + yearMatch[0].length).trim();
  } else {
    zoneB = "s.f.";
    const firstDot = cleanInput.indexOf(".");
    zoneA =
      firstDot !== -1 ? cleanInput.substring(0, firstDot).trim() : cleanInput;
    zoneC = firstDot !== -1 ? cleanInput.substring(firstDot + 1).trim() : "";
  }

  // --- LÓGICA DE AUTORES ---
  const authorsArray = zoneA
    .split(/&| y | y\/o |,/g)
    .map((a) => a.trim())
    .filter((a) => a.length > 2);
  const formattedAuthors = authorsArray.map((a) => formatAuthorName(a));

  // --- LÓGICA ZONA C (TÍTULO Y METADATOS) ---
  zoneC = zoneC.replace(/^[\s\.\)\,-]+/, ""); // Limpiar basura al inicio
  const segments = zoneC.split(/\.\s/).map((s) => s.trim());

  const title = segments[0] ? segments[0].replace(/[.,]$/, "") : "";

  // Buscamos información de la revista en lo que sobra del texto
  const remainingText = segments.slice(1).join(". ");

  let journalData = {
    journal: null,
    volume: null,
    number: null,
    pages: null,
    publisher: segments[1] || null, // Fallback si no es artículo
  };

  // PATRÓN A: Revista, Vol(Num), pag-pag (Ej: Journal of Trade, 31(1), 9–22)
  const patternA = /([^,]+),\s*(\d+)\s*\((\d+)\),\s*(\d+[\–\-]\d+)/;

  // PATRÓN B: Revista. Vol:pag-pag (Ej: Annual Review Microbiology. 55:105-137)
  const patternB = /([^.]+)\.\s*(\d+):(\d+[\–\-]\d+)/;

  const matchA = remainingText.match(patternA);
  const matchB = remainingText.match(patternB);

  if (matchA) {
    journalData.journal = matchA[1].trim();
    journalData.volume = matchA[2];
    journalData.number = matchA[3];
    journalData.pages = matchA[4];
    journalData.publisher = null;
  } else if (matchB) {
    journalData.journal = matchB[1].trim();
    journalData.volume = matchB[2];
    journalData.pages = matchB[3];
    journalData.number = null; // En este formato el número suele estar implícito o ausente
    journalData.publisher = null;
  }

  const urlRegex = /(https?:\/\/[^\s]+|doi\.org\/[^\s]+)/i;
  const urlMatch = zoneC.match(urlRegex);

  return {
    author: formattedAuthors.join(", "),
    year: zoneB,
    title: title,
    url: urlMatch ? urlMatch[0] : null,
    ...journalData,
  };
}

/**
 * Helper: Formatea nombres extrayendo iniciales correctamente
 */
function formatAuthorName(nameStr) {
  if (!nameStr) return "";
  // Limpiamos puntos previos para evitar "N.."
  const cleanName = nameStr.replace(/\./g, "").trim();

  if (cleanName.includes(",")) {
    const parts = cleanName.split(",");
    const lastName = parts[0].trim();
    const firstName = parts[1].trim();
    return `${lastName}, ${getInitial(firstName)}`;
  } else {
    const words = cleanName.split(/\s+/);
    if (words.length === 1) return words[0];

    // El último es el apellido
    const lastName = words.pop();
    // Los anteriores son nombres, sacamos inicial de cada uno
    const initials = words.map((n) => getInitial(n)).join(" ");
    return `${lastName}, ${initials}`;
  }
}

function getInitial(name) {
  if (!name) return "";
  // Maneja nombres compuestos o iniciales ya puestas
  const firstLetter = name.trim().charAt(0).toUpperCase();
  return firstLetter ? `${firstLetter}.` : "";
}
