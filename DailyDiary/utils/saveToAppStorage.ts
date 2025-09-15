// Wir nutzen expo-file-system um Dateien im App-Speicher abzulegen
import * as FileSystem from 'expo-file-system/legacy'

// Diese Funktion speichert ein ausgewähltes Bild dauerhaft im App-Speicher ab
export async function saveAssetToAppStorage(sourceUri: string, folder = 'images') {
    // Basis-Pfad: interner Dokumentenordner der App
    const docDir = (FileSystem as any).documentDirectory as string | null | undefined
    // Cache-Ordner (falls gebraucht, aber hier nur Info)
    const cacheDir = (FileSystem as any).cacheDirectory as string

    if (!docDir) throw new Error('Kein Dokumentenordner gefunden')

    // Zielordner erstellen (z. B. "images") falls er noch nicht existiert
    const base = `${docDir}${folder}`
    const dirInfo = await FileSystem.getInfoAsync(base)
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(base, { intermediates: true })
    }

    // Dateinamen aus der originalen URI extrahieren (z. B. image.jpg)
    const name = sourceUri.split('/').pop() ?? `img_${Date.now()}.jpg`
    const dest = `${base}/${name}`

    // Datei vom temporären Speicher an den dauerhaften Speicherort kopieren
    await FileSystem.copyAsync({ from: sourceUri, to: dest })

    // Neue URI zurückgeben, die jetzt dauerhaft gültig ist
    return dest
}
