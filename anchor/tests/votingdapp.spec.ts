import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { startAnchor } from 'anchor-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require('../target/idl/votingdapp.json')

const votingAddress =  new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");


describe('Votingdapp', () => {

  let context;
  let provider;
  let votingProgram: Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor("" , [{name: "votingdapp" , programId: votingAddress}] , []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
  })
 


  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favourite type of peanut butter?",
      new anchor.BN(0),
      new anchor.BN(1821246480),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favourite type of peanut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  })

  it('Initialize Candidate', async () => {
    await votingProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1)
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1)
    ).rpc();

    const [candidateAddress1] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")],
      votingAddress,
    )

    const candidate1 = await votingProgram.account.candidate.fetch(candidateAddress1);
    expect (candidate1.candidateVotes.toNumber()).toEqual(0);
    const [candidateAddress2] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      votingAddress,
    )

    const candidate2 = await votingProgram.account.candidate.fetch(candidateAddress2);
    expect (candidate2.candidateVotes.toNumber()).toEqual(0);
    console.log(candidate1);
    console.log(candidate2);
  })

  it('Vote', async () => {
    await votingProgram.methods.vote(
      "Crunchy",
      new anchor.BN(1)
    ).rpc();


    const [candidateAddress1] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")],
      votingAddress,
    )
    const candidate1 = await votingProgram.account.candidate.fetch(candidateAddress1);
    expect (candidate1.candidateVotes.toNumber()).toEqual(1);


    const [candidateAddress2] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      votingAddress,
    )
    const candidate2 = await votingProgram.account.candidate.fetch(candidateAddress2);
    expect (candidate2.candidateVotes.toNumber()).toEqual(0);

    console.log(candidate1);
    console.log(candidate2);
  })
  
})
