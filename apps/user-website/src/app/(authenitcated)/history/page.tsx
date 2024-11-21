"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Trophy,
  ClipboardList,
  User,
  Medal,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/src/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TopicInfo = {
  name: string;
};

type NormalTest = {
  category: TopicInfo;
  correctAnswers: number | null;
  id: string;
  isCompleted: boolean;
  numberOfQuestions: number;
  testType: "TIMER" | "NOTIMER";
  createdAt: string;
};

type LearningHistoryItem = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  userTopics: {
    topic: {
      id: string;
      name: string;
      pages: number;
    };
  }[];
};

type SimulationTest = {
  correctAnswers: number;
  id: string;
  isCompleted: boolean;
  numberOfQuestions: number;
  testType: "SIMULATION";
  createdAt: string;
};

interface UserTestData {
  SimulationTestDetail: SimulationTest[];
  UserTestDetail: NormalTest[];
}

type Participant = {
  id: string;
  name: string;
  grade: number;
};

const niceNames = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Edward Kenway",
  "Fiona Gallagher",
  "George Lucas",
  "Hannah Montana",
  "Ian Malcolm",
  "Jessica Jones",
  "Kevin Hart",
  "Laura Croft",
  "Michael Scott",
  "Nina Simone",
  "Oscar Isaac",
  "Paula Patton",
  "Quentin Tarantino",
  "Rachel Green",
  "Steve Jobs",
  "Tina Fey",
  "Uma Thurman",
  "Victor Frankenstein",
  "Wanda Maximoff",
  "Xena Warrior",
  "Yoda",
  "Zoe Saldana",
];

const generateMockData = (count: number): Participant[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${1000 + i}`,
    name: niceNames[Math.floor(Math.random() * niceNames.length)] || "Unknown",
    grade: +(Math.random() * 5 + 5).toFixed(2),
  })).sort((a, b) => b.grade - a.grade);
};

const MedalIcon = ({ rank }: { rank: number }) => {
  switch (rank) {
    case 1:
      return <Medal className="w-6 h-6 text-yellow-400" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
};

const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export default function TestList() {
  const [test, setTest] = useState<UserTestData>();
  const router = useRouter();
  const [grade, setGrade] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTestHistory, setShowTestHistory] = useState(false);
  const session = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showLearningHistory, setShowLearningHistory] = useState(false);
  const [learningHistory, setLearningHistory] = useState<LearningHistoryItem[]>(
    []
  );
  const [isLoadingLearningHistory, setIsLoadingLearningHistory] =
    useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) =>
    (2020 + i).toString()
  );

  const handleTestClick = (
    testId: string,
    isCompleted: boolean,
    testType: string
  ) => {
    if (isCompleted) {
      router.push(`/test/${testId}/results?testType=${testType}`);
      return;
    }
    router.push(`/test/${testId}?type=${testType}`);
  };

  const fetchLearningHistory = async () => {
    setIsLoadingLearningHistory(true);
    const loadingId = toast.loading("Loading learning history...");
    try {
      const userId = (session.data?.user as any)?.id;
      if (!userId) {
        toast.dismiss(loadingId);
        toast.error("User not authenticated");
        return;
      }

      const response = await fetch(`/api/learninghistory/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch learning history");
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.message);
      }

      setLearningHistory(result.data);
      toast.dismiss(loadingId);
      toast.success("Learning history loaded successfully");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("An error occurred while fetching learning history");
      console.error("Error fetching learning history:", error);
    } finally {
      setIsLoadingLearningHistory(false);
    }
  };

  const fetchData = async (month?: string, year?: string) => {
    setIsLoading(true);
    const loadingId = toast.loading("Loading info");
    try {
      const userId = (session.data?.user as any)?.id;
      if (!userId) {
        toast.dismiss(loadingId);
        toast.error("User not authenticated");
        return;
      }

      let url = `/api/testhistory/${userId}`;
      if (month && year) {
        url += `?month=${month}-${year.slice(-2)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed fetching data");
      }
      const result = await response.json();
      if (result.err) {
        throw new Error(result.msg);
      }
      setTest(result.data);
      toast.dismiss(loadingId);
      toast.success(`${result.msg}`);
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    const loadingId = toast.loading("Loading info");
    try {
      const response = await fetch(
        `/api/stats/${(session.data?.user as any)?.id}`
      );
      const data = await response.json();
      toast.dismiss(loadingId);
      if (data.error) {
        toast.error(data.msg);
        return;
      }
      toast.success(data.msg);
      setGrade(data.data.grade);
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("An error occurred while fetching data");
    }
  };

  const fetchLeaderboard = async () => {
    const loadingId = toast.loading("Loading leaderboard");
    try {
      const response = await fetch("/api/ranks");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.msg);
      }
      let leaderboardData = result.data;

      if (leaderboardData.length < 50) {
        const mockedData = generateMockData(50 - leaderboardData.length);
        leaderboardData = [...leaderboardData, ...mockedData];
      }

      leaderboardData.sort(
        (a: Participant, b: Participant) => b.grade - a.grade
      );

      setParticipants(leaderboardData);
      toast.dismiss(loadingId);
      toast.success("Leaderboard loaded successfully");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching leaderboard"
      );
    }
  };

  useEffect(() => {
    //@ts-ignore
    if (session.data?.user?.id) {
      fetchData();
      fetchStats();
      fetchLeaderboard();
      fetchLearningHistory();
    }
    //@ts-ignore
  }, [session.data?.user?.id]);

  const handleTopicClick = (topicId: string) => {
    router.push(`/learningTopic/${topicId}`);
  };

  const handleApplyFilters = () => {
    if (selectedMonth && selectedYear) {
      fetchData(selectedMonth, selectedYear);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Trophy className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">Average Grade</h3>
                <p className="text-xl">
                  Your average grade is{" "}
                  <span className="font-bold text-3xl">
                    {grade !== null ? grade : "0"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Trophy className="mr-2 text-yellow-400" /> Ranking
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {showLeaderboard ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <AnimatePresence>
              {showLeaderboard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Top 50 Participants
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-gray-800">
                          <TableHead className="w-[100px]">Rank</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant, index) => (
                          <TableRow
                            key={participant.id}
                            className={`cursor-pointer
                              transition-colors
                              ${index < 3 ? "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                            `}
                            onClick={() => {
                              router.push(`/profile/${participant.id}`);
                            }}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <MedalIcon rank={index + 1} />
                                <span>{index + 1}</span>
                              </div>
                            </TableCell>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {typeof participant.grade === "number"
                                ? participant.grade.toFixed(2)
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      {/* This is the part that is different from the snippet in apps/user-website/src/components/LearningHistory/LearningHistory.tsx */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <ClipboardList className="mr-2" /> Test History
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestHistory(!showTestHistory)}
                className="transition-all duration-300  ease-in-out transform hover:scale-105"
              >
                {showTestHistory ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <AnimatePresence>
              {showTestHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Select
                      onValueChange={setSelectedMonth}
                      value={selectedMonth}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month.charAt(0).toUpperCase() + month.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={setSelectedYear}
                      value={selectedYear}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleApplyFilters}
                      disabled={!selectedMonth || !selectedYear || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Apply Filters
                    </Button>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : test &&
                    (test.UserTestDetail.length > 0 ||
                      test.SimulationTestDetail.length > 0) ? (
                    <>
                      {test.UserTestDetail &&
                        test.UserTestDetail.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">
                              Normal Tests
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {test.UserTestDetail.map((test, index) => (
                                <motion.div
                                  key={test.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                >
                                  <Card
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden transform hover:scale-105"
                                    onClick={() =>
                                      handleTestClick(
                                        test.id,
                                        test.isCompleted,
                                        test.testType
                                      )
                                    }
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">
                                          {test.category?.name}
                                        </h4>
                                        <Badge
                                          variant={
                                            test.isCompleted
                                              ? "success"
                                              : "destructive"
                                          }
                                          className="text-xs"
                                        >
                                          {test.isCompleted ? (
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                          ) : (
                                            <XCircle className="w-3 h-3 mr-1" />
                                          )}
                                          {test.isCompleted
                                            ? "Completed"
                                            : "Incomplete"}
                                        </Badge>
                                      </div>
                                      <div className="mt-2 mb-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          Score:{" "}
                                          <span className="font-semibold text-lg">
                                            {test.correctAnswers || "0"}/
                                            {test.numberOfQuestions}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDateTime(test.createdAt)}
                                      </div>
                                      <div className="flex justify-end mt-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-xs"
                                        >
                                          View Details
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                      {test.SimulationTestDetail &&
                        test.SimulationTestDetail.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4">
                              Simulation Tests
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {test.SimulationTestDetail.map((test, index) => (
                                <motion.div
                                  key={test.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                >
                                  <Card
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden transform hover:scale-105"
                                    onClick={() =>
                                      handleTestClick(
                                        test.id,
                                        test.isCompleted,
                                        test.testType
                                      )
                                    }
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">
                                          Simulation Test
                                        </h4>
                                        <Badge
                                          variant={
                                            test.isCompleted
                                              ? "success"
                                              : "destructive"
                                          }
                                          className="text-xs"
                                        >
                                          {test.isCompleted ? (
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                          ) : (
                                            <XCircle className="w-3 h-3 mr-1" />
                                          )}
                                          {test.isCompleted
                                            ? "Completed"
                                            : "Incomplete"}
                                        </Badge>
                                      </div>
                                      <div className="mt-2 mb-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          Score:{" "}
                                          <span className="font-semibold text-lg">
                                            {test.correctAnswers || "0"}/
                                            {test.numberOfQuestions}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDateTime(test.createdAt)}
                                      </div>
                                      <div className="flex justify-end mt-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-xs"
                                        >
                                          View Details
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                    </>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                      You didn't perform any tests during this period.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      {/* this is the part that is different from the snippet in apps/user-website/src/components/LearningHistory/LearningHistory.tsx */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <BookOpen className="mr-2" /> Learning History
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLearningHistory(!showLearningHistory)}
                className="transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {showLearningHistory ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <AnimatePresence>
              {showLearningHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoadingLearningHistory ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : learningHistory && learningHistory.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {learningHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden border-2 border-primary/10">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg text-primary">
                                  Learning Session
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  In Progress
                                </Badge>
                              </div>
                              <div className="space-y-3">
                                {item.userTopics.map((userTopic) => (
                                  <div
                                    key={userTopic.topic.id}
                                    className="text-sm text-gray-700 dark:text-gray-300 flex items-center"
                                  >
                                    <BookOpen className="w-4 h-4 mr-2 text-primary" />
                                    {userTopic.topic.name} (
                                    {userTopic.topic.pages} pages)
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-end mt-6">
                                <Button
                                  onClick={() => handleTopicClick(item.id)}
                                  variant="default"
                                  size="sm"
                                  className="text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                  Continue Reading
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.p
                      className="text-center text-lg text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      You haven't started any learning topics yet.
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
