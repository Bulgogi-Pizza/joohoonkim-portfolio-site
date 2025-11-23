import { NextResponse } from 'next/server';
import { researchAreas } from '@/data/mock-data';

export async function GET() {
    return NextResponse.json(researchAreas);
}
