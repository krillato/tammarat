"use client";

import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { formatAgeRange } from "../utils/formatData";
import { TransformedData, User } from "./types";
import servicesDummyjson from "./services";

// Define table structure
type DepartmentData = {
  department: string;
  male: number;
  female: number;
  ageRange: string;
  hairColors: string;
  addressUser: string;
};

export default function UserTable() {
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["userData"],
    queryFn: servicesDummyjson,
  });

  // 📌 Convert Raw User Data
  const transformUserData = (users: User[]): TransformedData => {
    const departmentData: TransformedData = {};

    users.forEach(
      ({ company, age, gender, hair, address, firstName, lastName }) => {
        const department = company.department;
        const fullName = `${firstName}${lastName}`;

        if (!departmentData[department]) {
          departmentData[department] = {
            male: 0,
            female: 0,
            ageRange: "",
            hair: {},
            addressUser: {},
          };
        }

        //  Count Male & Female
        departmentData[department][gender]++;

        //  Store user age for range calculation
        const allAges = [
          ...(departmentData[department].ageRange
            ? departmentData[department].ageRange.split("-").map(Number)
            : []),
          age,
        ];
        departmentData[department].ageRange = formatAgeRange(allAges);

        //  Count Hair Colors
        departmentData[department].hair[hair.color] =
          (departmentData[department].hair[hair.color] || 0) + 1;

        //  Store Address
        departmentData[department].addressUser[fullName] = address.postalCode;
      }
    );

    return departmentData;
  };

  const dataTranfrom = isSuccess && data && transformUserData(data);

  console.log(dataTranfrom); //ตั้งใจเก็บไว้เพื่อดูข้อมูลที่ได้จากการแปลงข้อมูล

  const columns: ColumnDef<DepartmentData>[] = [
    { accessorKey: "department", header: "Department" },
    { accessorKey: "male", header: "Male Count" },
    { accessorKey: "female", header: "Female Count" },
    { accessorKey: "ageRange", header: "Age Range" },
    { accessorKey: "hairColors", header: "Hair Colors" },
    { accessorKey: "addressUser", header: "Address Users" },
  ];

  const tableData = dataTranfrom
    ? Object.keys(dataTranfrom).map((department) => ({
        department,
        male: dataTranfrom[department].male,
        female: dataTranfrom[department].female,
        ageRange: dataTranfrom[department].ageRange,
        hairColors: Object.entries(dataTranfrom[department].hair)
          .map(([color, count]) => `${color} (${count})`)
          .join(", "),
        addressUser: Object.entries(dataTranfrom[department].addressUser)
          .map(([name, postalCode]) => `${name}: ${postalCode}`)
          .join(", "),
      }))
    : [];

  console.log(tableData); //ตั้งใจเก็บไว้เพื่อดูข้อมูลที่ได้จากการแปลงข้อมูล

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Data Table</h1>
      <div className="border border-gray-300 rounded-md">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 bg-gray-200 text-gray-600 text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`${index % 2 == 0 ? "bg-gray-500" : "bg-gray-800"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
