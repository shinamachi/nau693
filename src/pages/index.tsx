// src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../app/globals.css';
import Head from 'next/head';

interface Fund {
    fundId: string;
    fundName: string;
    totalValue: number;
}

const Home: React.FC = () => {
    const [funds, setFunds] = useState<Fund[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        // Fetch funds from your API
        const fetchFunds = async () => {
            const response = await fetch(`${apiUrl}/api/funds`);
            const data = await response.json();
            setFunds(data);
        };

        fetchFunds().catch(console.error);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Head>
                <title>NAU-693</title>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </Head>
            <h1 className="text-3xl font-bold text-center mb-8">
                NAU-693
            </h1>
            <h4 className="text-center mb-8"></h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funds.map((fund) => (
                    <Link key={fund.fundId} href={`/funds/${fund.fundId}?fundName=${encodeURIComponent(fund.fundName)}`} passHref>
                        <div className="flex flex-col justify-between border p-4 rounded shadow-lg cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out min-w-[300px] h-40">
                            <h2 className="text-xl font-semibold">{fund.fundName}</h2>
                            <p className="text-gray-600 mt-auto">总持仓：${fund.totalValue}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    );
}

export default Home;
