export type TGristValue = number | string | boolean | null | []

export type TGristAction = [string, string, number | null, Record<string, TGristValue>]

export interface TGristRow {
    id: number,
    [key: string]: TGristValue
}

export interface TGristDocAPI {
    applyUserActions: (actions: TGristAction[], options?: unknown) => Promise<unknown>
}

export interface TGristTableOperations {
    getTableId: () => Promise<string>
}

export interface TGristAPI {
    docApi: TGristDocAPI,
    ready: (settings?: Record<string, string>) => void,
    onRecord: (callback: (data: TGristRow | null) => void) => void,
    onRecords: (callback: (data: TGristRow[]) => void) => void,
    getTable: (tableId?: string) => TGristTableOperations
}