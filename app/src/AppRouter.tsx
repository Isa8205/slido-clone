import { Route, Routes } from "react-router-dom";
import LandingPage from "./Landing";
import DashboardPage from "./pages/dashboard/page";
import AuthPage from "./pages/auth/login/page";
import JoinPage from "./pages/join/page";
import SignUpPage from "./pages/auth/signup/page";
import RoomReceptionPage from "./pages/room/RoomReception";
import { RoomHostPage } from "./pages/dashboard/room/page";
import { ParticipantQuizView } from "./pages/quiz/page";
import QuestionsPage from "./pages/dashboard/questions/page";

export default function AppRouter() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" Component={LandingPage}/>
                <Route path="/dashboard">
                    <Route path="" element={<DashboardPage/>}/>
                    <Route path="quizzes" element={<QuestionsPage/>}/>
                    <Route path="room">
                        <Route path=":roomCode" element={<RoomHostPage/>}/>
                        <Route path=":roomCode/quiz" element={<JoinPage/>}/>
                    </Route>
                </Route>
                <Route path="/auth">
                    <Route path="login" Component={AuthPage}/>
                    <Route path="signup" element={<SignUpPage />} />
                </Route>
                <Route path="/room">
                    <Route path=":roomCode" element={<RoomReceptionPage />}/>
                    <Route path=":roomCode/quiz" element={<ParticipantQuizView/>}/>
                </Route>
                <Route path="join/:roomCode" element={<JoinPage/>}/>
                <Route path="*" Component={() => <div>404 Not Found</div>}/>
            </Routes>
        </div>
    )
}