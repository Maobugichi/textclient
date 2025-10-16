import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ShowContext } from "../components/context-provider";
import logo from "../assets/textflexLogo.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../lib/axios-config";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";

// ✅ Define Zod schema
const signupSchema = z.object({
  username: z.string().min(2, "Username is required"),
  number: z.string().min(10, "Valid phone number required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const myContext = useContext(ShowContext);
  if (!myContext)
    throw new Error("ShowContext must be used within a ContextProvider");
  const { setUserData } = myContext;

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      number: "",
      email: "",
      password: "",
      referralCode: "",
    },
  });

  const [show, setShow] = useState(false);
 

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const mutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const res = await api.post("/api/register/", data);
      return res.data;
    },
    onSuccess: (data) => {
      setUserData(data);
      toast.success('Welcome onboard')
      navigate("/dashboard/1");

    },
    onError: (err: any) => {
       toast.error(err.response?.data?.message)
       setShow(true);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-[90%] mx-auto md:w-[40%] text-center gap-3 mt-16 min-h-[45vh] grid place-items-center md:min-h-[80vh]">
      
      
      <img src={logo} alt="textflex logo" className="w-32" />

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="text-gray-600">
          Enter your details below to create your account
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between w-[95%] gap-4 h-fit"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left text-gray-700 ">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter username"
                    className="text-lg h-14 placeholder:text-lg p-3 rounded-xl border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left text-gray-700 ">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    type="email"
                    className="text-lg h-14 placeholder:text-lg p-3 rounded-xl border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left text-gray-700 ">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your phone number"
                    type="tel"
                    className="text-lg h-14 placeholder:text-lg p-3 rounded-xl border-gray-300"
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
                <FormLabel className="block text-left text-gray-700 ">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your password"
                    type="password"
                    className="text-lg h-14 placeholder:text-lg p-3 rounded-xl border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left text-gray-700 ">
                  Referral Code (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Referral (optional)"
                    className="text-lg h-14 placeholder:text-lg p-3 rounded-xl border-gray-300"
                  />
                </FormControl>
              </FormItem>
            )}
          />

        
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full grid place-items-center text-lg tracking-wide bg-[#0032a5] text-white p-3 rounded-sm h-12"
          >
            {mutation.isPending ? (
             <ClipLoader size={20} color="white"/>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </Form>

      <span className="text-center text-gray-700">
        Already have an account?{" "}
        <Link className="text-blue-500 underline" to="/login/:1">
          Sign in
        </Link>
      </span>

      <p className="text-sm mt-2 text-gray-600">
        By clicking sign up, you agree to our{" "}
        <Link to="/terms/1" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy/1" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default Signup;
