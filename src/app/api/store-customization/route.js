import customization from './store-customization.json';
import { NextResponse } from "next/server";
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/app/api/store-customization/store-customization.json');

export async function GET() {
    try {
        const data = await readFile(filePath, 'utf8');
        const customization = JSON.parse(data);
        return NextResponse.json({
            success: true,
            data: customization
        });
    } catch (error) {
        console.error('Error reading customization file:', error);
        return NextResponse.json({
            success: true,
            data: customization
        });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { carousel_images } = body;

        if (!carousel_images || !Array.isArray(carousel_images)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid carousel_images format. Expected an array.'
            }, { status: 400 });
        }

        // Update the JSON file with new carousel images
        const updatedData = {
            ...customization,
            carousel_images: carousel_images
        };

        await writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

        return NextResponse.json({
            success: true,
            message: 'Carousel images updated successfully',
            data: updatedData
        });
    } catch (error) {
        console.error('Error updating carousel images:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update carousel images',
            error: error.message
        }, { status: 500 });
    }
}