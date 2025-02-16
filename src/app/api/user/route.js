import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/config/db";
import userModel from "@/app/models/user.model";

await connectToDatabase();

export async function GET() {
    try {
        const users = await userModel.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function POST(req) {
    try {
        const reqData = await req.json();

        reqData.status = "ACTIVE"

        const user = await userModel.create(reqData);
        return NextResponse.json({ success: true, message: "User data added successfully !" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function PUT(req) {
    try {
        const reqData = await req.json();

        const updatedUser = await userModel.findByIdAndUpdate(reqData.userId, reqData, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User data updated successfully !" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
