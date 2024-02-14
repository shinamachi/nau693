// src/pages/funds/[fundId].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../../app/globals.css';
import Link from "next/link";

interface Holding {
    stockName: string;
    symbol: string;
    averagePurchasePrice: number;
    currentPrice: number;
    totalValue: number;
    portfolioPercentage: number;
    lastTransactionTime: string;
}

const FundDetails: React.FC = () => {
    const router = useRouter();
    const { fundId } = router.query;
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fundName = typeof router.query.fundName === 'string' ? decodeURIComponent(router.query.fundName) : null;

    useEffect(() => {
        if (typeof fundId === 'string') {
            const fetchHoldings = async () => {
                const response = await fetch(`${apiUrl}/api/funds/${fundId}/holdings`);
                const data = await response.json();
                setHoldings(data);
            };
            fetchHoldings().catch(console.error);
        }
    }, [fundId, apiUrl]);
    const handleRowClick = (symbol: string) => {
        router.push(`/funds/${fundId}/transactions/${symbol}?fundName=${encodeURIComponent(fundName as string)}`);
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">{decodeURIComponent(fundName as string)} 持仓</h1>
            <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                <tr>
                    <th className="px-1 py-1 text-left">公司名</th>
                    <th className="px-1 py-1 text-right">持有金额</th>
                    <th className="px-1 py-1 text-right">持有金额占总持仓的比例</th>
                    <th className="px-1 py-1 text-right">最后交易时间</th>
                </tr>
                </thead>
                <tbody>
                {holdings.map((holding, index) => (
                    <tr
                        key={index}
                        className="border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRowClick(holding.symbol || holding.stockName)}
                    >
                        <td className="px-1 py-1  text-left">
                                {holding.stockName}{holding.symbol && `  (${holding.symbol})`}
                        </td>
                        <td className="px-1 py-1 text-right">{holding.totalValue}</td>
                        <td className="px-1 py-1 text-right">{holding.portfolioPercentage}%</td>
                        <td className="px-1 py-1 text-right">
                                {holding.lastTransactionTime}
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );
}

export default FundDetails;
