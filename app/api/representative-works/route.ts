import { NextResponse } from 'next/server';
import { representativeWorks } from '@/data/mock-data';

export async function GET() {
    return NextResponse.json(representativeWorks);
}
