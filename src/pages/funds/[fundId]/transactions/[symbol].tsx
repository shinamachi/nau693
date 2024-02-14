// src/pages/transactions/[fundId]/[stockSymbol].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../../../../app/globals.css';
import Link from "next/link";

interface Transaction {
    periodOfReport: string;
    shareChange: string;
    shareChangeNumber: number;
    percentageChange: string;
    inclusionDate: string;
}

const TransactionPage: React.FC = () => {
    const router = useRouter();
    const { fundId, symbol } = router.query;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fundName = typeof router.query.fundName === 'string' ? decodeURIComponent(router.query.fundName as string) : '';

    useEffect(() => {
        if (typeof fundId === 'string' && typeof symbol === 'string') {
            const fetchTransactions = async () => {
                const response = await fetch(`${apiUrl}/api/funds/${fundId}/transactions/${symbol}`);
                const data = await response.json();
                setTransactions(data);
            };
            fetchTransactions().catch(console.error);
        }
    }, [fundId, symbol, apiUrl]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">{fundName}在{symbol}的持仓变化</h1>
            <table className="min-w-full table-auto">
                <thead >
                <tr>
                    <th className="px-1 py-1 text-left"></th>
                    <th className="px-1 py-1 text-left"></th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr
                        key={index}
                        className={`border-b ${transaction.shareChangeNumber >= 0 ? 'hover:bg-green-100' : 'hover:bg-red-100'}`}
                    >
                        <td className="px-1 py-1 text-left">
                            <span className={`inline-block mr-2 rounded-full ${transaction.shareChangeNumber >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '8px', height: '8px' }}></span>
                            {transaction.periodOfReport}
                        </td>
                        <td className="px-1 py-1 text-left">
                            {transaction.percentageChange === "0.0" ? '建仓    ' :
                                transaction.shareChangeNumber < 0 ? `减持 ${transaction.percentageChange}%    ` :
                                    `增持 ${transaction.percentageChange}%    `}
                            (
                            <span>
                                {transaction.shareChangeNumber >= 0 ? '+' : ''}
                            </span>

                            {transaction.shareChange} Shares
                            )
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionPage;
