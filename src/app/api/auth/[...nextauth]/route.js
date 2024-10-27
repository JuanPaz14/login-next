import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from "@/libs/prismadb";
import bcrypt from 'bcrypt';

const authOptions = {
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                email:{label:'email',type:'text',placeholder:'ajsndns'},
                password:{label:'password',type:'password'}
            },
            async authorize(credentials,req){

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if(!userFound) throw new Error('No user Found');
                console.log(userFound);

                const passwordValid = await bcrypt.compare(credentials.password,userFound.password);

                if(!passwordValid) throw new Error('Wrong password');

                return {
                    id: userFound.id,
                    name: userFound.username,
                    email: userFound.email
                }
            }
        })
    ]
}
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}