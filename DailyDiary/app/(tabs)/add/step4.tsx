import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'

export default function Step4() {
    const { data, setField } = useWizard()
    const r = useRouter()

    return (
        <StepFrame
            step={4}
            title="Learning of Today"
            onPrev={() => r.back()}
            onNext={() => r.push('/(tabs)/add/step5')}
            disableNext={!data.lessonsLearned.trim()}
        >
            <TextInput
                style={s.input}
                placeholder="Enter your answer"
                multiline
                value={data.lessonsLearned}
                onChangeText={(t) => setField('lessonsLearned', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, minHeight: 120 },
})
