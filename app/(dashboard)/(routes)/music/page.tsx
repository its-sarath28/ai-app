"use client"

import * as z from "zod";
import Heading from "@/components/heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loader";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const MusicPage = () => {
    const router = useRouter();
    const [music, setMusic] = useState<string[]>();
    const proModal = useProModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            setMusic(undefined);

            const response = await axios.post("/api/music", values);

            setMusic(response.data.audio);

            form.reset();
        }catch(error: any){

            if(error?.response?.status === 403){
                proModal.onOpen();
            }else{
                toast.error("Something went wrong")
            }

        }finally{
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Music Generator"
                description="Generate your music"
                icon={Music}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />

            <div className="px-4 lg:px-8">
                <div className="">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Ask something..."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button 
                                className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="mt-4 space-y-4">
                    {isLoading && (
                        <div className=" p-8 rounded-lg flex items-center w-full justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    
                    {!music && !isLoading && (
                        <div>
                           <Empty label="Start a new composition" />
                        </div>
                    )}

                    {music && (
                        <audio controls className="w-full mt-8">
                            <source src="music" />
                        </audio>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default MusicPage;