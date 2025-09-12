import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export function StepFrame({
                              step,
                              title,
                              onPrev,
                              onNext,
                              nextLabel = 'Next >',
                              prevLabel = '< Previous',
                              disableNext,
                              children,
                          }: {
    step: number
    title: string
    onPrev?: () => void
    onNext?: () => void
    nextLabel?: string
    prevLabel?: string
    disableNext?: boolean
    children: React.ReactNode
}) {
    return (
        <View style={s.box}>
            <Text style={s.h1}>Daily Question {step}/6</Text>
            <Text style={s.q}>{title}</Text>

            <View style={{ flex: 1 }}>{children}</View>

            <View style={s.row}>
                <TouchableOpacity
                    onPress={onPrev}
                    disabled={!onPrev}
                    style={[s.btn, s.ghost, !onPrev && s.disabled]}
                >
                    <Text style={[s.btnText, s.ghostText]}>{prevLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onNext}
                    disabled={!!disableNext}
                    style={[s.btn, !!disableNext && s.disabled]}
                >
                    <Text style={s.btnText}>{nextLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    box: { flex: 1, padding: 24, backgroundColor: '#fff' },
    h1: { fontSize: 24, fontWeight: '800', color: '#6b0f0c', textAlign: 'center', marginBottom: 24 },
    q: { fontSize: 16, color: '#6b0f0c', textAlign: 'center', marginBottom: 16 },
    row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
    btn: { backgroundColor: '#6b0f0c', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
    btnText: { color: '#FFEFD5', fontWeight: '700' },
    ghost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
    ghostText: { color: '#6b0f0c' },
    disabled: { opacity: 0.45 },
})
