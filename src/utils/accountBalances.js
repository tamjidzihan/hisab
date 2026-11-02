const incomingTransferDescription = /^(?:transfer\s+from\b|cash\s+in\b|cash\s+deposit\b|deposit(?:ed)?\s+to\b|received\b|inflow\b)/i
const outgoingTransferDescription = /^(?:transfer\s+to\b|cash\s+out\b|cash\s+withdraw(?:al|n)?\b|withdraw(?:al|n)?\s+from\b|sent\s+to\b|outflow\b)/i

const getTransferDirection = (description) => {
  if (incomingTransferDescription.test(description || '')) return 1n
  if (outgoingTransferDescription.test(description || '')) return -1n
  return null
}

const getCreationTime = (transaction) => {
  const timestamp = new Date(transaction.createdAt || 0).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const calculateAccountBalances = (accounts, transactions) => {
  const balances = new Map(
    accounts.map((account) => [account.id, BigInt(account.openingBalanceMinor)])
  )
  const transferGroups = new Map()

  for (const transaction of transactions) {
    if (transaction.type !== 'transfer' || !transaction.transferGroupId) continue
    const group = transferGroups.get(transaction.transferGroupId) || []
    group.push(transaction)
    transferGroups.set(transaction.transferGroupId, group)
  }

  const transferDirections = new Map()
  for (const group of transferGroups.values()) {
    if (group.length === 2) {
      const directions = group.map((transaction) =>
        getTransferDirection(transaction.description)
      )
      if (directions[0] !== null && directions[1] === null) {
        transferDirections.set(group[0].id, directions[0])
        transferDirections.set(group[1].id, -directions[0])
      } else if (directions[1] !== null && directions[0] === null) {
        transferDirections.set(group[1].id, directions[1])
        transferDirections.set(group[0].id, -directions[1])
      } else if (
        directions[0] === null ||
        directions[1] === null ||
        directions[0] === directions[1]
      ) {
        const [outgoing, incoming] = [...group].sort(
          (a, b) => getCreationTime(a) - getCreationTime(b)
        )
        transferDirections.set(outgoing.id, -1n)
        transferDirections.set(incoming.id, 1n)
      }
    }
  }

  for (const transaction of transactions) {
    const balance = balances.get(transaction.accountId)
    if (balance === undefined) continue

    const amount = BigInt(transaction.amountMinor)
    if (transaction.type === 'income') {
      balances.set(transaction.accountId, balance + amount)
    } else if (transaction.type === 'expense') {
      balances.set(transaction.accountId, balance - amount)
    } else if (transaction.type === 'transfer') {
      const direction =
        transferDirections.get(transaction.id) ??
        getTransferDirection(transaction.description) ??
        -1n
      balances.set(transaction.accountId, balance + amount * direction)
    }
  }

  return balances
}

module.exports = { calculateAccountBalances }
