export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          emoji: string;
          date: string;
          sets: Json;
          completed: boolean;
          repeat_mode: string;
          repeat_weekdays: Json;
          repeat_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          emoji?: string;
          date: string;
          sets: Json;
          completed?: boolean;
          repeat_mode?: string;
          repeat_weekdays?: Json;
          repeat_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          emoji?: string;
          date?: string;
          sets?: Json;
          completed?: boolean;
          repeat_mode?: string;
          repeat_weekdays?: Json;
          repeat_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type WorkoutSet = {
  reps: number;
  completed: boolean;
};

export type Workout = Database["public"]["Tables"]["workouts"]["Row"] & {
  sets: WorkoutSet[];
};
