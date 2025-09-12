import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'

export default function Step3() {
    const { data, setField } = useWizard()
    const r = useRouter()

    return (
        <StepFrame
            step={3}
            title="What went not so well today"
            onPrev={() => r.back()}
            onNext={() => r.push('/(tabs)/add/step4')}
            disableNext={!data.negativeReflections.trim()}
        >
            <TextInput
                style={s.input}
                placeholder="Enter your answer"
                multiline
                value={data.negativeReflections}
                onChangeText={(t) => setField('negativeReflections', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, minHeight: 120 },
})
