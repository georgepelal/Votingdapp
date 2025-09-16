import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { startAnchor } from 'anchor-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require('../target/idl/votingdapp.json')

const votingAddress =  new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");


describe('votingdapp', () => {

  it('Initialize Poll', async () => {
    const context = await startAnchor("" , [{name: "votingdapp" , programId: votingAddress}] , []);
    const provider = new BankrunProvider(context);

  })
})
