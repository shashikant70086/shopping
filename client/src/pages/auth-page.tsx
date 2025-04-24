import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

// Custom CSS for stars background
const starsStyle = `
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
    z-index: 0;
  }

  .twinkling {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: url(http://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
    z-index: 1;
    animation: move-twink-back 200s linear infinite;
  }

  @keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
  }
`;

// Custom validation schema for login
const loginSchema = insertUserSchema.extend({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Custom validation schema for registration
const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isFlipped, setIsFlipped] = useState(false);
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "shopping",
      password: "shopping123",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
  }

  // If user is logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <style>{starsStyle}</style>
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6">
        <div className={theme === 'dark' ? 'stars' : ''}></div>
        <div className={theme === 'dark' ? 'twinkling' : ''}></div>
        
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ y: -10 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="z-10 mb-4"
        >
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden mx-auto">
            <ShoppingCart className="w-full h-full p-4 text-white" />
          </div>
          <h2 className="text-white text-2xl text-center font-bold mt-3 drop-shadow">
            Shopping Assistant
          </h2>
          <p className="text-white text-center text-sm drop-shadow">✨ Making your shopping experience magical ✨</p>
        </motion.div>

        <motion.div
          className="relative w-full max-w-md"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Login Form */}
          <div
            className="absolute w-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 w-full">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter username" 
                          {...field} 
                          className="bg-white/30 placeholder-white/80 text-white border-white/30 focus:border-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter password" 
                          {...field} 
                          className="bg-white/30 placeholder-white/80 text-white border-white/30 focus:border-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-none"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
            <button
              onClick={() => setIsFlipped(true)}
              className="mt-4 text-sm text-white/80 hover:underline"
            >
              Don't have an account? Sign up
            </button>
          </div>

          {/* Sign Up Form */}
          <div
            className="absolute w-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 w-full">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Create a username" 
                          {...field} 
                          className="bg-white/30 placeholder-white/80 text-white border-white/30 focus:border-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          {...field} 
                          className="bg-white/30 placeholder-white/80 text-white border-white/30 focus:border-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 border-none"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
            <button
              onClick={() => setIsFlipped(false)}
              className="mt-4 text-sm text-white/80 hover:underline"
            >
              Already have an account? Log in
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}