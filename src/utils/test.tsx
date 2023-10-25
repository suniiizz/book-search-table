import { Person } from "test";

export const personData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

export const personColumns = [
  {
    id: "firstName",
    header: "아이디",
    accessorFn: (row: Person) => row.firstName,
  },
  {
    id: "lastName",
    header: "이름",
    accessorFn: (row: Person) => row.lastName,
  },
  { id: "age", header: "나이", accessorFn: (row: Person) => row.age },
  {
    id: "visits",
    header: "전화번호",
    accessorFn: (row: Person) => row.visits,
  },
  {
    id: "status",
    header: "상태",
    accessorFn: (row: Person) => row.status,
  },
  {
    id: "progress",
    header: "진행",
    accessorFn: (row: Person) => row.progress,
  },
];
