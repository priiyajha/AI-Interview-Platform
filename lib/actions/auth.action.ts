'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";




const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams){
    const {uid, name, email } = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();
        if(!userRecord.exists){
            return{
                success: false,
                message:"User already exists, please sign-in."
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })
        return {
            success: true,
            message:"User successfully signed up. Sign-In now :)"
        }

    }catch(e: any){
        console.error("Error occurred: ",e);

        if(e.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: 'Email already exists',
            }
        }
        return{
            success: false,
            message: 'Some error occurred',
        }
    }

}


export async function signIn(params: SignInParams){
    const {email, idToken} = params;
    try{
        const userRecord = await auth.getUserById(email);
        if(!userRecord){
            return {
                success: false,
                message:"User DNE!"
            }
        }
        await setSessionCookie(idToken);
        
    }catch (e) {
        console.error("Error occurred: ",e);
        return{
            success: false,
            message: 'Failed to login!',
        }
    }
}


export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK * 1000,
    });
    cookieStore.set('session', sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });

}


export async function getCurrentUser(): Promise<User | null>{
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie) return null;


    try{

        const deccodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.
            collection('users')
            .doc(deccodedClaims.uid)
            .get();

            if(!userRecord.exists){
                return null;
            }
            return{
                ...userRecord.data(),
                id: userRecord.id,
            }as User;



    }catch(e){
        console.error("Error occurred: ",e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user;
}