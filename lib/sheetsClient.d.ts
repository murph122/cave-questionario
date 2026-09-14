declare module '../lib/sheetsClient.js' {
  export function postSheets(webhook: string, data: unknown): Promise<Record<string, unknown>>
  export function getSheets(webhook: string, query: string): Promise<Record<string, unknown>>
}

declare module './lib/sheetsClient.js' {
  export function postSheets(webhook: string, data: unknown): Promise<Record<string, unknown>>
  export function getSheets(webhook: string, query: string): Promise<Record<string, unknown>>
}
