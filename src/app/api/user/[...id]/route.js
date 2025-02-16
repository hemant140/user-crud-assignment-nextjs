import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/config/db";
import userModel from "@/app/models/user.model";

await connectToDatabase();

export async function PUT(req, { params }) {

    const id = await params.id[0];

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: "UserId is required" }, { status: 400 });
        }
        const user = await userModel.findById(id);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const newStatus = user.status === "ACTIVE" ? "DEACTIVE" : "ACTIVE";

        await userModel.findByIdAndUpdate(id, { status: newStatus });

        return NextResponse.json({
            success: true,
            message: `User status ${newStatus} successfully !`,
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}