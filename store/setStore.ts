import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";

export type SetType = {
  id: string;
  name: string;
  teamId: string;
};

type SetState = {
  sets: SetType[];
  addSet: (name: string, teamId: string) => void;
  removeSet: (teamId: string) => void;
};

export const useSetStore = create(
  persist<SetState>(
    (set) => ({
      sets: [],
      addSet: async (name: string, teamId: string) => {
        return set((state) => {
          return {
            ...state,
            sets: [
              {
                id: uuid.v4(),
                name,
                teamId,
              },
              ...state.sets,
            ],
          };
        });
      },
      removeSet: (setId: string) => {
        return set((state) => {
          return {
            ...state,
            sets: state.sets.filter((set) => set.id !== setId),
          };
        });
      },
    }),
    {
      name: "baskItball-set-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
