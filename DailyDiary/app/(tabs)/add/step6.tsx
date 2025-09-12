import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'

export default function Step6() {
    const { data, setField, finish } = useWizard()
    const r = useRouter()

    return (
        <StepFrame
            step={6}
            title="What would you like to call this entry"
            onPrev={() => r.back()}
            onNext={finish}
            nextLabel="Finish"
            disableNext={!data.title.trim()}
        >
            <TextInput
                style={s.input}
                placeholder="Title"
                value={data.title}
                onChangeText={(t) => setField('title', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, height: 44 },
})
