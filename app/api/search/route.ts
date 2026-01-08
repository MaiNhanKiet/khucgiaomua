import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"

// Định nghĩa schema cho invitationLetter
const InvitationLetterSchema = new mongoose.Schema({
    email: String,
    name: String,
    phoneNumber: String,
    letterURL: String,
}, { collection: "invitationLetter" })

const InvitationLetter = mongoose.models.InvitationLetter || mongoose.model("InvitationLetter", InvitationLetterSchema)

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { phoneNumber } = body

        if (!phoneNumber) {
            return NextResponse.json(
                { error: "Số điện thoại là bắt buộc" },
                { status: 400 }
            )
        }

        // Tìm kiếm trong database
        const result = await InvitationLetter.findOne({ phoneNumber: phoneNumber.trim() })

        if (!result) {
            return NextResponse.json(
                { error: "Không tìm thấy thông tin với số điện thoại này" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                name: result.name,
                email: result.email,
                phoneNumber: result.phoneNumber,
                letterURL: result.letterURL,
            },
        })
    } catch (error) {
        console.error("Error searching database:", error)
        return NextResponse.json(
            { error: "Lỗi server khi tìm kiếm" },
            { status: 500 }
        )
    }
}

