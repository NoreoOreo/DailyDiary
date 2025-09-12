// app/(tabs)/add/step5.tsx
import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Platform, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'
import { Ionicons } from '@expo/vector-icons'
import { saveAssetToAppStorage } from '@/utils/saveToAppStorage' // 👈 neu

export default function Step5() {
    const { data, setField } = useWizard()
    const r = useRouter()
    const [loading, setLoading] = useState(false)

    const ensureLibraryPermission = useCallback(async () => {
        let { status, granted, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync()
        const ok = granted || (status as string) === 'limited'
        if (!ok && canAskAgain) {
            const req = await ImagePicker.requestMediaLibraryPermissionsAsync()
            return req.granted || (req.status as string) === 'limited'
        }
        return ok
    }, [])

    const pickFromLibrary = useCallback(async () => {
        const permitted = await ensureLibraryPermission()
        if (!permitted) {
            Alert.alert('Permission needed', 'Please allow photo library access to pick an image.')
            return
        }
        try {
            setLoading(true)
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.85,
                exif: false,
            })
            if (result.canceled) return

            const asset = result.assets?.[0]
            if (!asset?.uri) return

            // 👇 HIER: in App-Speicher kopieren & persistente URI speichern
            const persistedUri = await saveAssetToAppStorage(asset.uri)
            setField('picture', persistedUri)
        } catch (e: any) {
            console.error('pickFromLibrary error', e)
            Alert.alert('Error', e?.message ?? 'Failed to pick image.')
        } finally {
            setLoading(false)
        }
    }, [ensureLibraryPermission, setField])

    const takePhoto = useCallback(async () => {
        const cam = await ImagePicker.getCameraPermissionsAsync()
        if (!cam.granted) {
            const req = await ImagePicker.requestCameraPermissionsAsync()
            if (!req.granted) {
                Alert.alert('Permission needed', 'Please allow camera access to take a photo.')
                return
            }
        }
        try {
            setLoading(true)
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.85,
            })
            if (result.canceled) return

            const asset = result.assets?.[0]
            if (!asset?.uri) return

            // 👇 ebenfalls persistieren
            const persistedUri = await saveAssetToAppStorage(asset.uri)
            setField('picture', persistedUri)
        } catch (e: any) {
            console.error('takePhoto error', e)
            Alert.alert('Error', e?.message ?? 'Failed to take photo.')
        } finally {
            setLoading(false)
        }
    }, [setField])

    const removeImage = () => setField('picture', null)

    return (
        <StepFrame
            step={5}
            title="Picture of the Day"
            onPrev={() => r.back()}
            onNext={() => r.push('/add/step6')}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={!data.picture ? pickFromLibrary : undefined}
                style={s.uploadBox}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : data.picture ? (
                    <View style={{ gap: 12, alignItems: 'center', width: '100%' }}>
                        <Image source={{ uri: data.picture }} style={s.preview} />
                        <View style={s.row}>
                            <TouchableOpacity style={[s.btn, s.ghost]} onPress={pickFromLibrary}>
                                <Ionicons name="images-outline" size={16} color="#6b0f0c" />
                                <Text style={[s.btnText, s.ghostText]}>Change</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, s.primaryLight]} onPress={takePhoto}>
                                <Ionicons name="camera-outline" size={16} color="#6b0f0c" />
                                <Text style={[s.btnText, s.darkText]}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, s.danger]} onPress={removeImage}>
                                <Ionicons name="trash-outline" size={16} color="#fff" />
                                <Text style={s.btnText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={{ gap: 12, alignItems: 'center' }}>
                        <Ionicons name="cloud-upload-outline" size={24} color="#6b0f0c" />
                        <Text style={s.uploadText}>Upload your picture of Today</Text>
                        <View style={s.row}>
                            <TouchableOpacity style={[s.btn, s.primary]} onPress={pickFromLibrary}>
                                <Ionicons name="images-outline" size={16} color="#FFEFD5" />
                                <Text style={s.btnText}>From Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, s.primaryLight]} onPress={takePhoto}>
                                <Ionicons name="camera-outline" size={16} color="#6b0f0c" />
                                <Text style={[s.btnText, s.darkText]}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                        {Platform.OS === 'web' && (
                            <Text style={{ color: '#6b0f0c99', fontSize: 12, textAlign: 'center' }}>
                                On Web, a file picker dialog will open.
                            </Text>
                        )}
                    </View>
                )}
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', marginTop: 12, color: '#6b0f0c' }}>
                Add a Caption (optional)
            </Text>

            <TextInput
                style={s.caption}
                placeholder="Caption"
                value={data.caption ?? ''}
                onChangeText={(t) => setField('caption', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    uploadBox: {
        borderWidth: 2, borderStyle: 'dashed', borderColor: '#6b0f0c33',
        borderRadius: 12, padding: 24, alignItems: 'center', justifyContent: 'center', width: '100%',
    },
    uploadText: { color: '#6b0f0c', fontWeight: '700' },
    preview: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#f3f4f6' },
    caption: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginTop: 12 },
    row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    btn: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
    primary: { backgroundColor: '#6b0f0c' },
    primaryLight: { backgroundColor: '#FFEFE8', borderWidth: 1, borderColor: '#f3d0c9' },
    danger: { backgroundColor: '#b91c1c' },
    ghost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
    btnText: { color: '#FFEFD5', fontWeight: '700' },
    ghostText: { color: '#6b0f0c' },
    darkText: { color: '#6b0f0c', fontWeight: '700' },
})
