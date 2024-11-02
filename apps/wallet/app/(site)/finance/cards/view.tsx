'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import DebitCard from '@/components/finance/debit-card';

// Import the DebitCard component from its dedicated file

// Define the form data structure
interface FormData {
  recipient: string;
  token: string;
  amount: string;
}

// Mock token list
const tokenList = [
  { address: '0x1', symbol: 'USDC', name: 'USD Coin' },
  { address: '0x2', symbol: 'ETH', name: 'Ethereum' },
  { address: '0x3', symbol: 'USDT', name: 'Tether' },
];

const getTokenSymbol = (tokenAddress: string) => {
  if (tokenAddress === 'custom') return 'CUSTOM';
  const selectedToken = tokenList.find((t) => t.address === tokenAddress);
  return selectedToken ? selectedToken.symbol : 'TOKEN';
};

export function FinanceCardView() {
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      recipient: '',
      token: '',
      amount: '',
    },
  });

  const [customToken, setCustomToken] = useState('');

  const { amount, token } = watch(['amount', 'token']);

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Preview Section */}
        <Card className="">
          <CardHeader>{/* <CardTitle>Preview</CardTitle> */}</CardHeader>
          <CardContent className="flex justify-center  h-full">
            <DebitCard
              amount={amount || '0'}
              tokenAddress={token === 'custom' ? customToken : token}
              chainId={1} // Assuming Ethereum mainnet, adjust as needed
              tokenSymbol={getTokenSymbol(token)}
            />
          </CardContent>
        </Card>
        {/* Form Section */}
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle>Send Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Controller
                  name="recipient"
                  control={control}
                  rules={{ required: 'Recipient address is required' }}
                  render={({ field }) => (
                    <Input id="recipient" placeholder="0x..." {...field} />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Controller
                  name="token"
                  control={control}
                  rules={{ required: 'Token is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokenList.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            {token.symbol} - {token.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom Token</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {token === 'custom' && (
                  <Input
                    placeholder="Enter custom token address"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: 'Amount is required' }}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      {...field}
                    />
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Send Tokens
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
