export type MenuItem = {
  id: number;
  name: string;
  serving: string;
  cals: number;
  fat: number;
  carbs: number;
  protein: number;
};

export type Category = {
  name: string;
  items: MenuItem[];
};

export type Meal = {
  name: string;
  items: Category[];
}

export type DiningHall = {
  id: number,
  name: string;
  meals: Meal[];
};

export type Day = {
  date: string; // month day year, 2 digits each
  halls: DiningHall[];
};

import Extras from '@/data/extras.json';
import MegaMenu from '@/data/megamenu.json';
import Schedule from '@/data/week.json';

export const Week: Day[] = Schedule;

export const diningHalls: DiningHall[] = MegaMenu;

export const Extra: DiningHall[] = Extras;

