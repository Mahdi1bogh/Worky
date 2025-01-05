"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slack } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { z } from "zod";
// import { signInWithGithub, signInWithGoogle } from "./actions";
import { Provider } from "@supabase/supabase-js";
import { createClient } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { registerWithEmail } from "./actions";
export default function Page() {
  const supabase = createClient();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email({ message: "Please provide a valid email" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAuthenticating(true);
    await registerWithEmail(values);
    setIsAuthenticating(false);
  };
  const socialAuth = async (provider: Provider) => {
    setIsAuthenticating(true);
    const response =
      provider === "github"
        ? await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              redirectTo: `${location.origin}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${location.origin}/auth/callback`,
            },
          });
    setIsAuthenticating(false);

    return response;
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        return router.push("/");
      }
    };
    getCurrentUser();
    setIsMounted(true);
  }, [router, supabase.auth]);

  if (!isMounted) return null;
  return (
    <div className="min-h-screen p-5 grid text-center place-content-center bg-white">
      <div className="max-w-[450px">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Slack size={30} />
          <Typography text="Workyy" variant="h2" />
        </div>
        <Typography
          text="Sign in to your Workyyspace"
          variant="h2"
          className="mb-3 text-brand-default"
        />
        <Typography
          text="Enter your email and password to access to your Workyyspace"
          variant="p"
          className="opacity-90 mb-7"
        />

        <div className="flex flex-col space-y-4">
          <Button
            disabled={isAuthenticating}
            variant="outline"
            className="py-6 border-2  flex space-x-3"
            onClick={() => socialAuth("google")}
          >
            <FcGoogle />
            <Typography
              className="text-xl"
              text="Sign in with Google"
              variant="p"
            />
          </Button>
          <Button
            disabled={isAuthenticating}
            variant="outline"
            className="py-6 border-2  flex space-x-3"
            onClick={() => socialAuth("github")}
          >
            <FaGithub />
            <Typography
              className="text-xl"
              text="Sign in with Github"
              variant="p"
            />
          </Button>
        </div>

        <div>
          <div className="flex items-center my-6">
            <div className="mr-[10px] flex-1 border-t bg-neutral-300" />
            <Typography text="OR" variant="p" />
            <div className="ml-[10px] flex-1 border-t bg-neutral-300" />
          </div>

          {/* FORM */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isAuthenticating}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="name@work-email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="secondary"
                  className="bg-brand-btn hover:bg-brand-btn/90 w-full my-5 text-white"
                  type="submit"
                >
                  <Typography text="Sign in with Email" variant="p" />
                </Button>
                <div className="px-5 py-4 bg-gray-100 rounded-sm">
                  <div className="text-gray-500 flex items-center space-x-3">
                    <MdOutlineAutoAwesome />
                    <Typography
                      text="We will email you a magic link for a password-free sign-in"
                      variant="p"
                    />
                  </div>
                </div>
              </fieldset>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
