// Shared type für den Wizard-State (ohne id)
export type AddEntryData = {
    event: string
    positiveReflections: string
    negativeReflections: string
    lessonsLearned: string
    picture?: string | null   // <- null erlaubt im Wizard
    caption?: string | null   // <- null erlaubt im Wizard
    title: string
    date: string              // ISO
}
