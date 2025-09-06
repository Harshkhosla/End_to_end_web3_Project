import express from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "./generated/prisma/index.js";
import { Wallet, HDNodeWallet } from "ethers";
import {mnemonicToSeedSync,validateMnemonic} from "bip39";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(express.json())

const port = process.env.PORT || 4321;

const prisma= new PrismaClient()

app.get('/', (req, res) => {
      
    const seedPhrase = process.env.SEED_PHRASE?.replace(/"/g, "").trim();
    if (!seedPhrase) throw new Error("Seed phrase not found");
     const daya =  mnemonicToSeedSync(seedPhrase)
    const rootWallet = HDNodeWallet.fromSeed(daya);
    const childWallet = rootWallet.derivePath(`m/44'/60'/0'/0/${2}`);


    res.json({ address: childWallet });
});
app.post("/hello",async(req,res)=>{
    const {username , password}= req.body;
    console.log(username)

    const userExists =await prisma.user.findFirst({
        where:{
            username:username
        }
    })
    if(userExists)return res.json({message:"user exists"})

        const salt =await  bcrypt.genSalt(10)
        console.log(salt, password)
        const hashpassowrd = await bcrypt.hash(password,salt)

        const createdUser = await prisma.user.create({
            data:{
                username:username,
                password:hashpassowrd
            },
        })
       
   const seedPhrase = process.env.SEED_PHRASE?.replace(/"/g, "").trim();
    if (!seedPhrase) throw new Error("Seed phrase not found");
     const data =  mnemonicToSeedSync(seedPhrase)
    const rootWallet = HDNodeWallet.fromSeed(data);
    const childWallet = rootWallet.derivePath(`m/44'/60'/0'/0/${createdUser.id}`);

        const createUserkeys = await prisma.key.create({
    data:{
        User:( createdUser).id,
        privateKey:childWallet.path,
        publicKey:childWallet.publicKey,
        address:childWallet.address
    }
})

        res.json({message:"User has been created", createdUser,createUserkeys})
})


app.listen(port, ()=>{
    console.log("HELLO SERVER","PORT:-",port)
})