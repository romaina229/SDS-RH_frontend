import type { AxiosResponse } from 'axios';

/**
 * Extrait le nom de fichier réel d'un en-tête Content-Disposition
 * (« attachment; filename="bulletin.pdf" » ou la variante RFC 5987
 * « filename*=UTF-8''bulletin.pdf »). Retourne null si l'en-tête est
 * absent ou illisible.
 */
function extractFilenameFromContentDisposition(headerValue?: string): string | null {
    if (!headerValue) return null;

    const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
        try {
            return decodeURIComponent(utf8Match[1]);
        } catch {
            // valeur mal encodée, on retente le format simple ci-dessous
        }
    }

    const simpleMatch = headerValue.match(/filename="?([^";]+)"?/i);
    return simpleMatch?.[1]?.trim() || null;
}

/**
 * Déclenche le téléchargement d'une réponse Axios en Blob, avec le
 * nom de fichier et le type MIME réels chaque fois que possible.
 *
 * Ordre de priorité pour le nom de fichier :
 * 1. En-tête Content-Disposition renvoyé par le serveur (nécessite
 *    que le backend l'expose via CORS — voir config/cors.php).
 * 2. `fallbackFilename` fourni par l'appelant — DOIT inclure une
 *    extension exacte et cohérente avec le fichier réel, jamais une
 *    extension devinée ou codée en dur (ex: ne pas supposer .pdf
 *    pour un fichier qui pourrait être .docx ou .jpg).
 *
 * Ne jamais laisser le navigateur retomber sur .txt par défaut :
 * c'est ce qui se produit quand `download` n'a pas d'extension et
 * que le Blob n'a pas de type MIME reconnu.
 */
export function downloadBlobResponse(response: AxiosResponse<Blob>, fallbackFilename: string): void {
    const contentType = String(response.headers?.['content-type'] || 'application/octet-stream');
    const filename =
        extractFilenameFromContentDisposition(response.headers?.['content-disposition']) || fallbackFilename;

    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

/**
 * Extrait l'extension (avec le point) d'un chemin de fichier stocké
 * côté serveur (ex: "contracts/12/3/fichier-abc123.docx" → ".docx").
 * Retourne une chaîne vide si aucune extension n'est détectable.
 */
export function extensionFromPath(path?: string | null): string {
    if (!path) return '';
    const match = path.match(/\.[a-zA-Z0-9]+$/);
    return match ? match[0] : '';
}
