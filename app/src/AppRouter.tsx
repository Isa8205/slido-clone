import { Route, Routes } from "react-router-dom";
import LandingPage from "./Landing";
import DashboardPage from "./pages/dashboard/page";
import AuthPage from "./pages/auth/page";
import QuizPage from "./pages/quiz/page";
import JoinPage from "./pages/join/page";

export default function AppRouter() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" Component={LandingPage}/>
                <Route path="/dashboard" Component={DashboardPage}/>
                <Route path="/auth">
                    <Route path="login" Component={AuthPage}/>
                    <Route path="signup" element={<div>signup page</div>} />
                </Route>
                <Route path="join/:roomCode" element={<JoinPage/>}/>
                <Route path="quiz/:roomCode" element={<QuizPage/>}/>
                <Route path="*" Component={() => <div>404 Not Found</div>}/>
            </Routes>
        </div>
    )
}