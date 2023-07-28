import { checkApiLimit, increaseApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
})

const openai = new OpenAIApi(configuration);

export async function POST(
    req: Request
) {
    try{
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "512x512" } = body;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!configuration.apiKey){
            return new NextResponse("Open API Key not configured", { status: 500 })
        }

        if(!prompt){
            return new NextResponse("Prompt are required", { status: 400 })
        }

        if(!amount){
            return new NextResponse("Amount are required", { status: 400 })
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expried", { status: 403 })
        }

        if(!resolution){
            console.log("Resolution are required");
            return new NextResponse("Resolution are required", { status: 400 })
        }

        const response = await openai.createImage({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
        })

        if(!isPro){
            await increaseApiLimit()
        }

        return NextResponse.json(response.data.data)

    }catch(error){
        console.log("Image_Error", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}