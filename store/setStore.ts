import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";
import { createSet, SetType } from "@/types/set";

type SetState = {
  sets: Record<string, SetType>;
  addSet: (name: string, teamId: string) => void;
  removeSet: (teamId: string) => void;
};

export const useSetStore = create(
  persist<SetState>(
    (set) => ({
      sets: {},
      addSet: (name: string, teamId: string) => {
        const id = uuid.v4();
        return set((state) => ({
          sets: {
            [id]: createSet(id, name, teamId),
            ...state.sets,
          },
        }));
      },
      removeSet: (setId: string) => {
        return set((state) => {
          if (!state.sets[setId]) {
            console.warn(`Set with ID ${setId} not found. Cannot remove.`);
            return state;
          }
          const newSets = { ...state.sets };
          delete newSets[setId];
          return { sets: newSets };
        });
      },
    }),
    {
      name: "baskItball-set-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
