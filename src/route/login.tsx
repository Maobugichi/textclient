import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios-config";
import logo from "../assets/textflexLogo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";
import { useAuth } from "../context/authContext";


const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {

  const {  login } = useAuth();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
 
 
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormData) => {
      const { data } = await api.post("/api/login", values);
      return data;
    },
    onSuccess: (data) => {
      console.log(data)
      login(data)
      const socket = io("https://api.textflex.net", {
        query: {
          userId: data.userId,
          eventType: data.eventTag,
        },
      });

      socket.emit("client-ready");
      toast.success('Welcome back!')
      navigate("/dashboard/1");
    },
    onError: (error: any) => {
        console.log(error)
      toast.error(error.response?.data?.error)
      //setErrorMessage(error.response?.data?.error || "Login failed");
      setShow(true);
    },
  });

 
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  const onSubmit = (values: LoginFormData) => {
    loginMutation.mutate(values);
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="relative font-montserrat w-[90%] mx-auto md:w-[40%] mt-20 grid place-items-center">
   

      <div className="text-center pb-5 grid gap-4 place-items-center">
        <img src={logo} alt="textflex logo" className="w-32" />
        <p className="text-lg font-semibold">
          Enter your details below to log into your account
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-[95%]"
        >
        
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="border border-gray-300 rounded-xl h-11  text-lg placeholder:text-lg "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="border border-gray-300 rounded-xl h-11  text-lg placeholder:text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl text-lg bg-[#0032a5] h-12 text-white font-medium"
          >
            {isLoading ? (
              <ClipLoader size={20} color="white"/>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <Link className="text-blue-400 underline mt-5" to="/forgot-password/:1">
        Forgot password?
      </Link>
    </div>
  );
};

export default Login;
