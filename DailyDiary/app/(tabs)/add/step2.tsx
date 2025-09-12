import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'

export default function Step2() {
    const { data, setField } = useWizard()
    const r = useRouter()

    return (
        <StepFrame
            step={2}
            title="What went well today?"
            onPrev={() => r.back()}
            onNext={() => r.push('/(tabs)/add/step3')}
            disableNext={!data.positiveReflections.trim()}
        >
            <TextInput
                style={s.input}
                placeholder="Enter your answer"
                multiline
                value={data.positiveReflections}
                onChangeText={(t) => setField('positiveReflections', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, minHeight: 120 },
})
