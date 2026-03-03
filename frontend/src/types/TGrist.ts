export type TGristValue = number | string | boolean | null | []

export interface TGristRow {
    id: number,
    [key: string]: TGristValue
}

export interface TGristAPI {
    ready: (settings?: Record<string, string>) => void,
    onRecord: (callback: (data: TGristRow | null) => void) => void,
    onRecords: (callback: (data: TGristRow[]) => void) => void
}