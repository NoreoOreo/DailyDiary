import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'

export default function Step1() {
    const { data, setField } = useWizard()
    const r = useRouter()

    return (
        <StepFrame
            step={1}
            title="What did you do today"
            onNext={() => r.push('/(tabs)/add/step2')}
            disableNext={!data.event.trim()}
        >
            <TextInput
                style={s.input}
                placeholder="Enter your answer"
                multiline
                value={data.event}
                onChangeText={(t) => setField('event', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, minHeight: 120 },
})
