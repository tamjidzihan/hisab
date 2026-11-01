export const LEDGER_UPDATED_EVENT = 'hisab:ledger-updated'

export const notifyLedgerUpdated = (): void => {
  window.dispatchEvent(new Event(LEDGER_UPDATED_EVENT))
}
