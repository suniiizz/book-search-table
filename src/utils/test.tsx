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

    // key의 value값만 넣고 싶을 때
    accessorKey: "firstName",

    // header 컬럼을 그룹화 하고 싶어
    // columns: [
    //   {
    //     header: "아이디",
    //     accessorKey: "firstName",
    //     cell: ({ row }: { row: Row<Person> }) => {
    //       return <>{row.getValue("firstName")}</>;
    //     },
    //   },
    // ]

    // value을 수정해서 정리하고싶어
    cell: ({ row }: { row: Row<Person> }) => {
      return <span className="font-bold">{row.getValue("firstName")}</span>;
    },
  },
  {
    id: "lastName",
    header: "이름",
    accessorKey: "lastName",
  },
  { id: "age", header: "나이", accessorKey: "age" },
  {
    id: "visits",
    header: "전화번호",
    accessorKey: "visits",
  },
  {
    id: "status",
    header: "상태",
    accessorKey: "status",
  },
  {
    id: "progress",
    header: "진행",
    accessorKey: "visits",
  },
];
