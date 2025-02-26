"use client";
import { useState, useCallback } from "react";

type Item = {
  type: "Fruit" | "Vegetable";
  name: string;
};

const initialItems: Item[] = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

export default function AutoDeleteTodoList() {
  const [mainList, setMainList] = useState<Item[]>(initialItems);
  const [fruits, setFruits] = useState<Item[]>([]);
  const [vegetables, setVegetables] = useState<Item[]>([]);
  const [timeouts, setTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>(
    {}
  );

  const moveBackToMain = useCallback(
    (item: Item) => {
      clearTimeout(timeouts[item.name]);
      setFruits((prev) => prev.filter((i) => i.name !== item.name));
      setVegetables((prev) => prev.filter((i) => i.name !== item.name));
      setMainList((prev) => [...prev, item]);
    },
    [timeouts]
  );

  const moveToCategory = useCallback(
    (item: Item) => {
      setMainList((prev) => prev.filter((i) => i.name !== item.name));

      if (item.type === "Fruit") {
        setFruits((prev) => [...prev, item]);
      } else {
        setVegetables((prev) => [...prev, item]);
      }

      const timeoutId = setTimeout(() => moveBackToMain(item), 5000);
      setTimeouts((prev) => ({ ...prev, [item.name]: timeoutId }));
    },
    [moveBackToMain]
  );

  const renderList = (
    items: Item[],
    onClick: (item: Item) => void,
    bgColor: string,
    textColor: string
  ) => (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.name}
          className={`w-full p-2 rounded ${bgColor} hover:bg-opacity-75 ${textColor} transition`}
          onClick={() => onClick(item)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">Auto Delete Todo List</h1>

      <div className="grid grid-cols-3 gap-5 w-full max-w-3xl">
        <div className="border p-4 rounded-lg min-h-[700px]">
          <h2 className="text-lg font-semibold mb-2 text-center border-b-gray-100 border-b-2 pb-2">
            Main List
          </h2>
          {renderList(
            mainList,
            moveToCategory,
            "bg-slate-500",
            "hover:text-slate-500"
          )}
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-center border-b-gray-100 border-b-2 pb-2">
            Fruits
          </h2>
          {renderList(fruits, moveBackToMain, "bg-red-200", "text-red-500")}
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-center border-b-gray-100 border-b-2 pb-2">
            Vegetables
          </h2>
          {renderList(
            vegetables,
            moveBackToMain,
            "bg-green-200",
            "text-green-500"
          )}
        </div>
      </div>
    </div>
  );
}
