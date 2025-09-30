"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizLayout } from "@/components/quiz-layout";
import { AuthGuard } from "@/components/auth-guard";
import { motion } from "framer-motion";
import { LogOut, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [quizSets, setQuizSet] = useState<{
      id: string;
      title: string;
      quizzes: { question: string; options: string[]; correctAnswer: number }[];
    }[]
  >([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [showAddQuizsetModal, setShowAddQuizsetModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const res = await api.post("/room/create");

      if (res.status === 201) {
        localStorage.setItem("room-token", res.data.token);
        const roomCode = res.data.roomCode;
        toast.success(res.data.message);
        navigate(`/dashboard/room/${roomCode}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          toast.error("Please login to create a room");
        } else if (status === 500) {
          console.error("Encountered and error creating room: ", err);
          toast.error("Server error, please try again.");
        } else {
          console.error("Encountered and error creating room: ", err);
          toast.error("Something went wrong, please try again.");
        }
      }
      console.error("Encountered and error creating room: ", err);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    await navigate("/");
  };

  useEffect(() => {
    async () => {
      try {
        const res = await api.get("/room/list");
        if (res.status === 200) {
          setQuizSet(res.data.quizes);
        }
      } catch (err) {
        console.error("Encountered and error creating room: ", err);
      }
    };
  });
  return (
    <AuthGuard>
      <QuizLayout title="Dashboard">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-muted-foreground">
                Manage your quizzes and start new sessions
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quiz Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quiz Sets</CardTitle>
                  <CardDescription>
                    Create and manage your quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setShowAddQuizsetModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>

                  <div className="space-y-2">
                    {quizSets.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center">
                        No quizzes yet. Create one to get started.
                      </p>
                    )}
                    {quizSets.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/50 cursor-pointer"
                      >
                        <div>
                          <h3 className="font-medium">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {quiz.quizzes.length} questions
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Start Session */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    Start a New Quiz Session
                  </CardTitle>
                  <CardDescription>
                    Pick a quiz set and share the room code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <select
                    className="w-full border rounded-lg p-2"
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                  >
                    <option value="">Select a quiz set...</option>
                    {quizSets.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.title}
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={handleCreateRoom}
                    disabled={isCreatingRoom || !selectedQuizId}
                    className="text-lg py-6 px-8 w-full"
                  >
                    {isCreatingRoom ? "Creating Room..." : "Start Room"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          { showAddQuizsetModal && <AddQuizsetModal onClose={() => setShowAddQuizsetModal(false)} /> }
        </div>
      </QuizLayout>
    </AuthGuard>
  );
}


const AddQuizsetModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
 return (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card p-6 rounded-lg shadow-lg"
    >
      <div className="relative">
        <h2 className="text-2xl font-bold mb-4">Add Quiz Set</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-400 rounded-lg p-2"
        />
      </div>

      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">Description</label>
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          maxLength={100}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-400 rounded-lg p-2 mb-4"
        />
      </div>

      <div className="flex justify-end">
        <button className="bg-primary/90 text-white py-2 px-4 rounded-lg">
          Add
        </button>
      </div>
    </motion.div>
  </div>
 ) 
}