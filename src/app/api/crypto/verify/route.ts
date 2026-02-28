// src/app/api/crypto/verify/route.ts
// UPDATED FOR ETHERSCAN API V2

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { txid, cryptocurrency, expectedAmount, walletAddress } = await request.json();

    console.log('=== VERIFICATION REQUEST ===');
    console.log('TXID:', txid);
    console.log('Crypto:', cryptocurrency);
    console.log('Expected Amount:', expectedAmount);
    console.log('Wallet Address:', walletAddress);

    if (!txid || !cryptocurrency || !expectedAmount || !walletAddress) {
      return NextResponse.json(
        { verified: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let verified = false;
    let actualAmount = 0;
    let overpayment = 0;
    let message = '';

    switch (cryptocurrency) {
      case 'BTC':
        const btcResult = await verifyBitcoinTransaction(txid, walletAddress, expectedAmount);
        verified = btcResult.verified;
        actualAmount = btcResult.amount;
        overpayment = btcResult.overpayment || 0;
        message = btcResult.message;
        break;

      case 'ETH':
        const ethResult = await verifyEthereumTransaction(txid, walletAddress, expectedAmount);
        verified = ethResult.verified;
        actualAmount = ethResult.amount;
        overpayment = ethResult.overpayment || 0;
        message = ethResult.message;
        break;

      case 'USDT':
      case 'USDC':
        const tokenResult = await verifyERC20Transaction(txid, walletAddress, expectedAmount, cryptocurrency);
        verified = tokenResult.verified;
        actualAmount = tokenResult.amount;
        overpayment = tokenResult.overpayment || 0;
        message = tokenResult.message;
        break;

      default:
        return NextResponse.json(
          { verified: false, message: 'Unsupported cryptocurrency' },
          { status: 400 }
        );
    }

    console.log('=== VERIFICATION RESULT ===');
    console.log('Verified:', verified);
    console.log('Message:', message);
    console.log('Amount:', actualAmount);

    return NextResponse.json({
      verified,
      message,
      actualAmount,
      expectedAmount,
      overpayment,
      txid
    });

  } catch (error) {
    console.error('Crypto verification error:', error);
    return NextResponse.json(
      { verified: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Bitcoin verification
async function verifyBitcoinTransaction(
  txid: string, 
  walletAddress: string, 
  expectedAmount: number
): Promise<{ verified: boolean; amount: number; overpayment?: number; message: string }> {
  try {
    const response = await fetch(`https://api.blockchair.com/bitcoin/dashboards/transaction/${txid}`);
    
    if (!response.ok) {
      return { verified: false, amount: 0, message: 'Transaction not found' };
    }

    const data = await response.json();
    
    if (!data.data || !data.data[txid]) {
      return { verified: false, amount: 0, message: 'Transaction not found' };
    }

    const tx = data.data[txid];
    
    if (!tx.transaction || !tx.transaction.block_id) {
      return { verified: false, amount: 0, message: 'Transaction not confirmed yet. Please wait for blockchain confirmation.' };
    }

    const outputs = tx.outputs || [];
    const ourOutput = outputs.find((output: any) => output.recipient === walletAddress);

    if (!ourOutput) {
      return { verified: false, amount: 0, message: 'Payment not sent to correct address' };
    }

    const amountBTC = ourOutput.value / 100000000;
    
    const minRequired = expectedAmount * 0.999;
    
    if (amountBTC < minRequired) {
      return { 
        verified: false, 
        amount: amountBTC, 
        message: `Insufficient amount. Expected ${expectedAmount} BTC, received ${amountBTC} BTC` 
      };
    }

    const overpayment = amountBTC > expectedAmount * 1.01 ? amountBTC - expectedAmount : 0;
    
    return { 
      verified: true, 
      amount: amountBTC,
      overpayment: overpayment,
      message: overpayment > 0 
        ? `Payment verified! Overpaid by ${overpayment.toFixed(8)} BTC. Contact support for refund.`
        : 'Payment verified successfully!'
    };

  } catch (error) {
    console.error('BTC verification error:', error);
    return { verified: false, amount: 0, message: 'Failed to verify Bitcoin transaction' };
  }
}

// Ethereum verification
async function verifyEthereumTransaction(
  txid: string,
  walletAddress: string,
  expectedAmount: number
): Promise<{ verified: boolean; amount: number; overpayment?: number; message: string }> {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY || '';
    
    const response = await fetch(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txid}&apikey=${apiKey}`
    );

    if (!response.ok) {
      return { verified: false, amount: 0, message: 'Transaction not found' };
    }

    const data = await response.json();
    
    if (!data.result) {
      return { verified: false, amount: 0, message: 'Transaction not found' };
    }

    const tx = data.result;

    if (tx.to?.toLowerCase() !== walletAddress.toLowerCase()) {
      return { verified: false, amount: 0, message: 'Payment not sent to correct address' };
    }

    const receiptResponse = await fetch(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txid}&apikey=${apiKey}`
    );

    const receiptData = await receiptResponse.json();
    
    if (!receiptData.result) {
      return { verified: false, amount: 0, message: 'Transaction not found' };
    }

    const amountWei = parseInt(tx.value, 16);
    const amountETH = amountWei / 1e18;

    const minRequired = expectedAmount * 0.999;
    
    if (amountETH < minRequired) {
      return { 
        verified: false, 
        amount: amountETH, 
        message: `Insufficient amount. Expected ${expectedAmount} ETH, received ${amountETH} ETH` 
      };
    }

    const overpayment = amountETH > expectedAmount * 1.01 ? amountETH - expectedAmount : 0;
    
    return { 
      verified: true, 
      amount: amountETH,
      overpayment: overpayment,
      message: overpayment > 0 
        ? `Payment verified! Overpaid by ${overpayment.toFixed(8)} ETH. Contact support for refund.`
        : 'Payment verified successfully!'
    };

  } catch (error) {
    console.error('ETH verification error:', error);
    return { verified: false, amount: 0, message: 'Failed to verify Ethereum transaction' };
  }
}

// USING ETHERSCAN API V2
async function verifyERC20Transaction(
  txid: string,
  walletAddress: string,
  expectedAmount: number,
  token: 'USDT' | 'USDC'
): Promise<{ verified: boolean; amount: number; overpayment?: number; message: string }> {
  try {
    console.log('\n=== ERC-20 VERIFICATION START ===');
    console.log('Token:', token);
    console.log('TXID:', txid);
    console.log('Wallet:', walletAddress);
    console.log('Expected:', expectedAmount);

    const apiKey = process.env.ETHERSCAN_API_KEY || '';
    
    // Use API V2 - Get transaction receipt with logs
    const response = await fetch(
      `https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getTransactionReceipt&txhash=${txid}&apikey=${apiKey}`
    );

    if (!response.ok) {
      console.log('❌ API request failed');
      return { verified: false, amount: 0, message: 'Failed to connect to blockchain' };
    }

    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data).slice(0, 200));
    
    if (!data.result) {
      console.log('❌ No result in response');
      return { verified: false, amount: 0, message: 'Transaction not found' };
    }

    const receipt = data.result;
    const logs = receipt.logs || [];
    
    console.log('📋 Total logs:', logs.length);

    const tokenContracts = {
      USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    };

    const tokenContract = tokenContracts[token].toLowerCase();
    console.log('🎯 Token contract:', tokenContract);

    // Find Transfer event to your wallet
    let foundTransfer = false;
    let transferAmount = 0;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      
      // Check if it's a Transfer event (topic[0] = keccak256("Transfer(address,address,uint256)"))
      if (log.topics && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
        
        const logContract = log.address?.toLowerCase();
        const toAddress = '0x' + log.topics[2].slice(26); // Remove padding
        
        console.log(`\n📦 Log ${i}:`);
        console.log('  Contract:', logContract);
        console.log('  To:', toAddress);
        console.log('  Match contract:', logContract === tokenContract);
        console.log('  Match wallet:', toAddress.toLowerCase() === walletAddress.toLowerCase());
        
        // Check if it's the right token AND to your wallet
        if (logContract === tokenContract && toAddress.toLowerCase() === walletAddress.toLowerCase()) {
          foundTransfer = true;
          
          // Decode amount (USDT/USDC have 6 decimals)
          const amountHex = log.data;
          const amountRaw = parseInt(amountHex, 16);
          transferAmount = amountRaw / 1e6;
          
          console.log('✅ MATCH FOUND!');
          console.log('  Amount:', transferAmount, token);
          
          break;
        }
      }
    }

    if (!foundTransfer) {
      console.log('❌ No matching transfer found');
      return { 
        verified: false, 
        amount: 0, 
        message: `No ${token} transfer to your wallet found in this transaction.` 
      };
    }

    console.log('💰 Transfer amount:', transferAmount, token);
    console.log('📊 Required:', expectedAmount, token);

    const minRequired = expectedAmount * 0.999;
    
    if (transferAmount < minRequired) {
      console.log('❌ Insufficient amount');
      return { 
        verified: false, 
        amount: transferAmount, 
        message: `Insufficient amount. Expected ${expectedAmount} ${token}, received ${transferAmount} ${token}` 
      };
    }

    const overpayment = transferAmount > expectedAmount * 1.01 ? transferAmount - expectedAmount : 0;
    
    console.log('✅ VERIFICATION SUCCESSFUL');
    console.log('Overpayment:', overpayment);
    
    return { 
      verified: true, 
      amount: transferAmount,
      overpayment: overpayment,
      message: overpayment > 0 
        ? `Payment verified! You received ${transferAmount} ${token}. Overpaid by ${overpayment.toFixed(2)} ${token}.`
        : `Payment verified! You received ${transferAmount} ${token}.`
    };

  } catch (error) {
    console.error('ERC20 verification error:', error);
    return { verified: false, amount: 0, message: `Failed to verify ${token} transaction` };
  }
}