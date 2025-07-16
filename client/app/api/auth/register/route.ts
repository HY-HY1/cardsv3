import { NextResponse  } from "next/server";
import { MongoConnect } from "@/lib/mongo/MongoConnect";
import { User } from "@/lib/models/User";
import { HashString } from "@/utils/hashing/hashing";
import { uuid as v4 }  from "uuidv4";
import { signToken } from "@/utils/jwt/auth";

export async function POST(res:Response) {
    try {
        const { first_name, last_name, email, password} = await res.json()

        if (!first_name || !last_name || !email || !password) {
            return NextResponse.json({error: "Fields are missing"}, { status: 400 })
        }

        await MongoConnect() // create connection to database

        const existingUser = await User.findOne({ email: email })

        if (existingUser) { // check if the user exists
            return NextResponse.json({error: `User with email ${email} already exists`}, { status: 400 }) 
        }

        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex: RegExp = /^.{8,}$/;

        if (!emailRegex.test(email)) { // check valid email format
            return NextResponse.json({error: "Email isnt in a valid format"}, { status: 400 }) 
        }

        if (!passwordRegex.test(password)) { // check valid password format
            return NextResponse.json({error: "Password isnt in a valid format"}, { status: 400 })
        }

        const hashedPassword = await HashString(password)

        
        const uuid = v4() // Create an unique ID


        const newUser = new User({ // create a new instance of user
            userId: uuid,
            email: email,
            password: hashedPassword,
            name: {
                first: first_name,
                last: last_name
            }
        })

        newUser.save() // save the new instance to mongoDB

        const jwtPayload = { // Create an object for the jwt payload
            userId: uuid,
            email: email
        }

        const token = signToken(jwtPayload) // Sign a new JWT Token

        // Return a jwt token
        return NextResponse.json({ message: "User Successfull created", token: token }, { status: 200})

    } catch (err: unknown) {
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500})

    }

}