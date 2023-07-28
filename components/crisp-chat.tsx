"use client"

import { Crisp } from "crisp-sdk-web"
import { useEffect } from "react"

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("7962c260-edcc-4d68-9ad0-fbbfb8153e85")
    }, [])

    return null;
}