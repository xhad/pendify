require('dotenv').config()
import { ethers } from 'ethers'

const RPC = process.env.RPC


async function pendingTxCheck(rpc, userWallet) {

	try {
		if (!rpc) throw new Error('RPC Url not provided in .env')

		const provider = new ethers.providers.JsonRpcProvider(rpc)

		// get the pending blocks
		const pendingBlocks = await provider.getBlock("pending")

		// fetch the pending transactions in the block
		const pendingTxs = await Promise.all(
			pendingBlocks.transactions.map(
				async tx => tx ? await provider.getTransaction(tx) : null
			)
		)

		// return all addresses that have pending transactions
		const fromAddresses = pendingTxs.map(tx => tx.from.toLowerCase())

		// check if there is a pending transaction for the wallet 
		// you passed into this function
		const check = fromAddresses.includes(userWallet.toLowerCase())

		if (check) return true
		return false
	} catch (err) {

	}

}

const userWallet = '0xa0b30De2833294C200a376B0e8205b9517bF021F'

// simple poller to check if there is a pending trsnaction for the wallet
console.log('Pendify is watching', userWallet)

setInterval(async () => {
	const bool = await pendingTxCheck(RPC, userWallet)
	if (bool) console.log('Pending Transaction!!!\u0007')
}, 2000)