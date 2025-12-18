type Coordinator = readonly [name: string, phone: string];

type Prize = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};

type Event = {
  readonly name: string;
  readonly description: string;
  readonly rules: readonly string[];
  readonly prize: Prize;
  readonly studentCoordinators: readonly Coordinator[];
  readonly facultyCoordinators: readonly Coordinator[];
  readonly image: string;
};

const events = [
  {
    name: "Debugging",
    description:
      "A technical event focused on identifying and fixing errors in C programs. Participants analyze given code snippets and debug them within the time limit across two competitive rounds.",
    rules: [
      "Two rounds: test paper and debugging",
      "Programming language: C",
      "Individual participation",
      "Computer will be provided",
    ],
    prize: { first: 2000, second: 1000, third: 500 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "debugging.png",
  },
  {
    name: "Coding",
    description:
      "A competitive programming event where participants solve logical and algorithmic problems using the C programming language. The event consists of two rounds to test problem-solving skills and coding efficiency.",
    rules: [
      "Two rounds: test paper and coding",
      "Programming language: C",
      "Individual participation",
      "Computer will be provided",
    ],
    prize: { first: 2000, second: 1000, third: 500 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "coding.png",
  },
  {
    name: "Speed Typing",
    description:
      "A typing accuracy and speed challenge conducted on the Monkeytype platform. Participants aim for the highest words per minute (WPM) in a 60-second test.",
    rules: [
      "Platform: Monkeytype",
      "Duration: 60 seconds",
      "Individual participation",
      "Highest WPM secures ranks",
      "Ties resolved by higher accuracy",
      "Window: 10:00 AM – 01:00 PM; one attempt (1 minute)",
    ],
    prize: { first: 1000, second: 500, third: 0 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "speed-typing.png",
  },
  {
    name: "E-Football",
    description:
      "A virtual football gaming tournament where players compete in multiple rounds to showcase skills, strategy, and reflexes.",
    rules: ["Multiple rounds", "Individual participation", "Platform: Mobile"],
    prize: { first: 1000, second: 500, third: 0 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "e-football.png",
  },
  {
    name: "BGMI",
    description:
      "A competitive battle royale tournament where participants fight for survival using strategy, reflexes, and solo gameplay.",
    rules: ["Multiple rounds", "Individual participation", "Platform: Mobile"],
    prize: { first: 1000, second: 500, third: 0 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "bgmi.png",
  },
  {
    name: "Memory Game",
    description:
      "A concentration and recall challenge designed to test short-term memory through visual or sequence-based tasks.",
    rules: ["Multiple rounds", "Individual participation"],
    prize: { first: 1000, second: 500, third: 0 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "memory-game.png",
  },
  {
    name: "Photography",
    description:
      "Participants submit their best photos based on a theme. Judges evaluate creativity, composition, and originality.",
    rules: ["Individual participation"],
    prize: { first: 1000, second: 0, third: 0 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "photography.png",
  },
  {
    name: "Treasure Hunt",
    description:
      "A team-based adventure where participants follow clues, solve puzzles, and navigate locations to find hidden treasure first.",
    rules: ["3–4 members per team"],
    prize: { first: 4000, second: 2000, third: 0 },
    studentCoordinators: [
      ["Student One", "9876543210"],
      ["Student Two", "9876543210"],
    ],
    facultyCoordinators: [
      ["Faculty One", "9876543210"],
      ["Faculty Two", "9876543210"],
    ],
    image: "treasure-hunt.png",
  },
] satisfies readonly Event[];

export type { Event, Prize, Coordinator };
export default events;
