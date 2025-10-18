import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShowContext } from "../context-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import api from "../../lib/axios-config";
import { useAuth } from "../../context/authContext";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  userNumber: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Enter a valid phone number (with or without +)"),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const SettingsContent = () => {
  const myContext = useContext(ShowContext);
  if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
  const { user } = useAuth();
  console.log(user)
  const { setUserData, theme } = myContext;
 

  
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username:user?.username,
      userNumber:user?.userNumber,
    },
  });


  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  
  const onSubmitProfile = async (values: ProfileForm) => {
    try {
      const response = await api.patch(`/api/update/`, values,{
        headers: { "x-requires-auth": true }
      });
      setUserData((prev: any) => ({
        ...prev,
        username: values.username,
        userNumber: values.userNumber,
      }));
      profileForm.reset(values);
      profileForm.setFocus("username");
      alert(response.data || "Profile updated successfully!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error updating profile.");
    }
  };


  const onSubmitPassword = async (values: PasswordForm) => {
    try {
      const response = await api.patch(
        `/api/password`,
        values
      );
      passwordForm.reset();
      alert(response.data?.data || "Password updated successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Password update failed!");
    }
  };


  const themeClass = theme ? "text-white bg-black" : "text-black bg-white";

  return (
    <div className={`w-full md:w-[65%] h-full flex flex-col justify-between ${themeClass}`}>
    
      <div className="h-1/2 flex flex-col justify-between space-y-6">
        <h2 className="text-2xl font-semibold">Settings</h2>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={profileForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`${ 
                        theme ? "border-blue-200" : "border-gray-300"
                      } focus:ring-2 h-12 rounded-xl text-lg placeholder:text-lg tracking-wide placeholder:tracking-wide focus:ring-blue-500`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="userNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`${
                        theme ? "border-blue-200" : "border-gray-300"
                      } focus:ring-2 h-12 rounded-xl focus:ring-blue-500 text-lg placeholder:text-lg tracking-wide placeholder:tracking-wide`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Email</FormLabel>
              <Input value={user?.userEmail} disabled className="text-gray-400 text-lg placeholder:text-lg tracking-wide placeholder:tracking-wide h-12 rounded-xl cursor-not-allowed" />
            </div>

            <Button type="submit" className="w-fit h-12 rounded-xl text-lg tracking-wide md:w-[30%] bg-[#0032a5] text-white">
              Update Profile
            </Button>
          </form>
        </Form>
      </div>

     
      <div className="h-[40%] flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Change Password</h2>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Enter old password"
                      className={`${
                        theme ? "border-blue-200" : "border-gray-300"
                      } focus:ring-2 h-12 rounded-xl focus:ring-blue-500 text-lg placeholder:text-lg tracking-wide placeholder:tracking-wide`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Enter new password"
                      className={`${
                        theme ? "border-blue-200" : "border-gray-300"
                      } focus:ring-2 h-12 rounded-xl focus:ring-blue-500 text-lg placeholder:text-lg tracking-wide placeholder:tracking-wide`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-[30%] h-12 rounded-xl text-lg tracking-wide md:w-[20%] bg-[#0032a5] text-white"
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsContent;
