import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(request){
    try {
        const data = await request.json();

    const emailFound = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if(emailFound){
        return NextResponse.json({
            mesaje:'email Aldready exist',
        },{
            status:400
        })
    }

    const userFound = await prisma.user.findUnique({
        where: {
            username: data.username
        }
    })

    if(userFound){
        return NextResponse.json({
            mesaje:'User Aldready exist',
        },{
            status:400
        })
    }

    const {confirmPassword,...rest}= data
    rest.password = await bcrypt.hash(rest.password,10);
    
    console.log(rest);
    const newUser = await prisma.user.create({
        data : {
            ...rest
        }
    })

    const {password,...user} = newUser;
    return NextResponse.json(user)


    } catch (error) {
        NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }

        )
    }
}