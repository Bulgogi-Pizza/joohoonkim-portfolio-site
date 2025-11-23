import { NextResponse } from 'next/server';
import { publications } from '@/data/mock-data';

export async function GET() {
    return NextResponse.json(publications);
}
