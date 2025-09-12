import * as FileSystem from 'expo-file-system/legacy'

export async function saveAssetToAppStorage(sourceUri: string, folder = 'images') {
    const docDir = (FileSystem as any).documentDirectory as string | null | undefined
    const cacheDir = (FileSystem as any).cacheDirectory as string
    const base = (docDir ?? cacheDir) + `${folder}/`

    const dirInfo = await FileSystem.getInfoAsync(base)
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(base, { intermediates: true })
    }

    const name = sourceUri.split('/').pop() ?? `img_${Date.now()}.jpg`
    const dest = base + name

    await FileSystem.copyAsync({ from: sourceUri, to: dest })
    return dest
}
