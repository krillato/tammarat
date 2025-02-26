import { describe, it, expect, vi, Mock } from "vitest";
import { User } from "../../types";
import servicesDummyjson from "..";
import { formatAgeRange } from "../../../utils/formatData";

describe("Utility Functions", () => {
  it("should return correct age range", () => {
    expect(formatAgeRange([25, 30, 35, 40])).toBe("25-40");
    expect(formatAgeRange([18, 22, 30])).toBe("18-30");
  });
});

describe("servicesDummyjson", () => {
  it("should fetch users and return them", async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        age: 30,
        gender: "male",
        hair: { color: "brown", type: "curly" },
        address: { postalCode: "12345" },
        company: { department: "Engineering" },
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Doe",
        age: 25,
        gender: "female",
        hair: { color: "blonde", type: "straight" },
        address: { postalCode: "67890" },
        company: { department: "Marketing" },
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ users: mockUsers }),
      })
    ) as Mock;

    const users = await servicesDummyjson();
    expect(users).toEqual(mockUsers);
  });

  it("should log an error if the fetch fails", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const mockError = new Error("Fetch failed");

    global.fetch = vi.fn(() => Promise.reject(mockError)) as Mock;

    await servicesDummyjson();
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  });
});
