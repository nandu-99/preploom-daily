export type InterviewQuestion = {
  id: string;
  question: string;
  answer: string;
  points?: string[];
  code?: string;
  note?: string;
};

export const behavioralCategories = [
  "Introduction and motivation",
  "Ownership and problem-solving",
  "Teamwork and communication",
  "Leadership and initiative",
  "Failure and growth",
  "Pressure and adaptability",
] as const;

export type BehavioralCategory = (typeof behavioralCategories)[number];

export type BehavioralQuestion = {
  id: string;
  category: BehavioralCategory;
  question: string;
  howToAnswer: string;
  example: string;
};

export const operatingSystemCategories = [
  "OS fundamentals",
  "Processes and threads",
  "CPU scheduling",
  "Synchronization",
  "Deadlocks",
  "Memory management",
  "File systems",
  "I/O and storage",
  "Protection and security",
  "Practical scenarios",
] as const;

export type OperatingSystemCategory =
  (typeof operatingSystemCategories)[number];

export type OperatingSystemQuestion = InterviewQuestion & {
  category: OperatingSystemCategory;
};

export const computerNetworksCategories = [
  "Networking fundamentals",
  "HTTP, HTTPS, and DNS",
  "TCP, UDP, and sockets",
  "TCP reliability and congestion",
  "IP addressing and NAT",
  "Routing and diagnostics",
  "Ethernet, ARP, and DHCP",
  "Wi-Fi and transmission",
  "Network security",
  "Practical scenarios",
] as const;

export type ComputerNetworksCategory =
  (typeof computerNetworksCategories)[number];

export type ComputerNetworksQuestion = InterviewQuestion & {
  category: ComputerNetworksCategory;
};

export const oopCategories = [
  "OOP foundations",
  "Encapsulation and abstraction",
  "Inheritance and relationships",
  "Polymorphism and binding",
  "Interfaces and abstract classes",
  "Equality, copying, and immutability",
  "Object context and lifecycle",
  "SOLID and good design",
  "Design patterns",
  "Practical design scenarios",
] as const;

export type OopCategory = (typeof oopCategories)[number];

export type OopQuestion = InterviewQuestion & {
  category: OopCategory;
};

export const dbmsCategories = [
  "DBMS foundations and architecture",
  "Relational model, keys and constraints",
  "ER modelling and schema design",
  "SQL filtering, grouping and aggregation",
  "Joins, subqueries, views and CTEs",
  "Functional dependencies and normalization",
  "Transactions, ACID and isolation levels",
  "Concurrency, locking and deadlocks",
  "Indexing, storage and query optimization",
  "Recovery and practical scenarios",
] as const;

export type DbmsCategory = (typeof dbmsCategories)[number];

export type DbmsQuestion = InterviewQuestion & {
  category: DbmsCategory;
};
