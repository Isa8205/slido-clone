import { QuizLayout } from "@/components/quiz-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const { signUp, isLoading } = useAuth()
    const [password2, setPassword2] = useState('')
    const [{ username, password, email }, setUserData] = useState<{username: string, password: string, email: string}>({
        username: '',
        password: "",
        email: ''
    })
    const navigate = useNavigate()

    const handleSubmit = async(e: any) => {
        e.preventDefault()
        if (password !== password2) {
            toast.error("Passwords should be simillar")
            return
        }

        const isSignedUp = await signUp({ username, password, email})
        if (isSignedUp) {
            toast.success("Signup successfull!")
            navigate("/auth/login")
        }
    }
    return (
        <QuizLayout showHeader={false}>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </NavLink>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">Login</CardTitle>
              <CardDescription>Enter your details to start hosting quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Username <span className="text-orange-500">*</span></Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value}))}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Email <span className="text-orange-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value}))}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Password <span className="text-orange-500">*</span></Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setUserData(prev => ({...prev, password: e.target.value}))}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Confirm Password <span className="text-orange-500">*</span></Label>
                  <Input
                    id="passwords"
                    type="password"
                    placeholder="Confirm your password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <Button type="submit" className="w-full text-lg py-6" disabled={!username.trim() || !password.trim() || !email.trim() || isLoading}>
                  {isLoading ? "Please wait..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Already have and account? <NavLink className={'text-primary hover:underline'} to={"/auth/login"}>Login</NavLink></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
        </QuizLayout>
    )
}