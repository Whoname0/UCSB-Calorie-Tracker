import { diningHalls, Extra, MenuItem, Week } from '@/data/menu';
import { storage } from '@/data/storage';
import React, { createContext, useContext, useEffect, useState } from "react";

type CustomItem = MenuItem & {
  hall: number[];
  mealType: string[];
  category: string; // category name or id
  temporary: boolean;
  daymenu: boolean;
};

type Totals = {
  cals: number;
  fat: number;
  carbs: number;
  protein: number;
};

type Cart = Record<number, number>; // itemId -> count

type MealContextType = {
  //categories: Category[];
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  calcTotals: (cart: Cart) => Totals;
  totals: Totals;
  getCount: (id: number) => number;
  allItems: MenuItem[];
  saveMeal: (name: string, total: Totals, hall: number, mealType: string) => void;
  deleteMeal: (id: number) => void;
  toggleStar: (mealId: number) => void;
  savedMeals: SavedMeal[];
  cart: Cart;
  selectedHall: number;
  setHall: React.Dispatch<React.SetStateAction<number>>;
  DayMenu: boolean | null;
  setDayMenu: React.Dispatch<React.SetStateAction<boolean | null>>;
  selectedMealType: string;
  setMealType: React.Dispatch<React.SetStateAction<string>>;
  archivedIds: number[];
  decimal: boolean;
  setDecimal: React.Dispatch<React.SetStateAction<boolean>>;
  toggleArchive: (id: number) => void;
  customItems: CustomItem[];
  addCustomItem: (hall: number[], mealType: string[], category: string, name: string, cals: number, fat: number, carbs: number, protein: number, temporary: boolean, daymenu: boolean) => void;
  deleteCustomItem: (id: number) => void;
  removeTemporaryItems: () => void;
  fetchDate: () => string;
  getAverage: (choice: number, time: number) => Totals;
};

export type SavedMealItem = {
  id: number;
  name: string;
  count: number;
};

export type SavedMeal = {
  id: number;
  name: string;
  items: SavedMealItem[];
  total: Totals;
  hall: number;
  mealType: string;
  starred: boolean;
};

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await storage.get(key);
      if (raw) setValue(JSON.parse(raw));
      setLoaded(true);
    })();
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    storage.set(key, JSON.stringify(value));
  }, [key, value, loaded]);

  return [value, setValue] as const;
}



const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider = ({ children }: { children: React.ReactNode }) => {
  // const [categories, setCategories] = useState<Category[]>([
  //   {
  //     name: "Grill",
  //     items: [
  //       { id: 1, name: "Burger", count: 0, cals: 300, fat: 20, carbs: 30, protein: 10 },
  //       { id: 2, name: "Fries", count: 0, cals: 1000, fat: 50, carbs: 100, protein: 1 },
  //     ],
  //   },
  // ]);

  const [selectedHall, setHall] = useState(diningHalls[0].id);
  const [selectedMealType, setMealType] = useState('Lunch');
  const [DayMenu, setDayMenu] = useState<boolean | null>(null);

  const [cart, setCart] = useState<Cart>({});

  const [archivedIds, setArchivedIds] = useState<number[]>([]);

  const [customItems, setCustomItems] = usePersistentState<CustomItem[]>('Custom Items', []);


  const [decimal, setDecimal] = useState(false);

  const deltime = 3456000000; // = 1000*60*60*24*40, 40 days


  const toggleArchive = (itemId: number) => {
    setArchivedIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const addCustomItem = (hall: number[], mealType: string[], category: string, name: string, cals: number, fat: number, carbs: number, protein: number, temporary: boolean, daymenu: boolean) => {
    setCustomItems(prev => [
      ...prev,
      {
        id: 1000 + customItems.length,
        hall,
        mealType,
        category,
        name,
        serving: "",
        cals: (Number.isNaN(cals) || cals == undefined ? 0 : Math.round(cals * 10) / 10),
        fat: (Number.isNaN(fat) || fat == undefined ? 0 : Math.round(fat * 10) / 10),
        carbs: (Number.isNaN(carbs) || carbs == undefined ? 0 : Math.round(carbs * 10) / 10),
        protein: (Number.isNaN(protein) || protein == undefined ? 0 : Math.round(protein * 10) / 10),
        temporary,
        daymenu
      },
    ]);
  }

  const deleteCustomItem = (id: number) => {
    setCustomItems(prev => prev.filter(item => !(id === item.id)));
  };

  const removeTemporaryItems = () => {
    setCustomItems(prev => prev.filter(item => !item.temporary));
  };





  // const add = (id: number) => {
  //   setCategories(prev =>
  //     prev.map(category => ({
  //       ...category,
  //       items: category.items.map(item =>
  //         item.id === id
  //           ? { ...item, count: item.count + 1 }
  //           : item
  //       ),
  //     }))
  //   );
  // };

  // const remove = (id: number) => {
  //   setCategories(prev =>
  //     prev.map(category => ({
  //       ...category,
  //       items: category.items.map(item =>
  //         item.id === id
  //           ? { ...item, count: Math.max(0, item.count - 1) }
  //           : item
  //       ),
  //     }))
  //   );
  // };

  // const clear = () => {
  //   setCategories(prev =>
  //     prev.map(category => ({
  //       ...category,
  //       items: category.items.map(item => ({
  //           ...item,
  //           count: 0
  //       })),
  //     }))
  //   );
  // };

  const getCount = (id: number) => cart[id] || 0;

  const allItems = [
    ...diningHalls.flatMap(hall =>
      Object.values(hall.meals)
        .flatMap(meal => 
          Object.values(meal.items)
            .flatMap(cat => cat.items))
    ),
    ...Week.flatMap(day =>
      Object.values(day.halls)
      .flatMap(hall =>
        Object.values(hall.meals)
          .flatMap(meal =>
            Object.values(meal.items)
              .flatMap(cat => cat.items)))
    ),
    ...customItems,
    ...Extra.flatMap(hall =>
      Object.values(hall.meals)
        .flatMap(meal => 
          Object.values(meal.items)
            .flatMap(cat => cat.items))
    )
  ];

  const permItems = [
    ...diningHalls.flatMap(hall =>
      Object.values(hall.meals)
        .flatMap(meal => 
          Object.values(meal.items)
            .flatMap(cat => cat.items))
    ),
    ...Extra.flatMap(hall =>
      Object.values(hall.meals)
        .flatMap(meal => 
          Object.values(meal.items)
            .flatMap(cat => cat.items))
    )
  ];


  const add = (id: number) => {
    setCart(prev => ({
      ...prev,
      [id]: Math.round(((prev[id] || 0) + (decimal ? 0.1 : 1)) * 10)/10,
    }));
  };

  const remove = (id: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      if (current - (decimal ? 0.1 : 1) <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: Math.round((current - (decimal ? 0.1 : 1))*10)/10 };
    });
  };

  const clear = () => setCart({});

  // const calcTotals = (categories: Category[]) => {
  //   return categories.reduce(
  //     (totals, category) => {
  //       category.items.forEach(item => {
  //         totals.cals += item.cals * item.count;
  //         totals.fat += item.fat * item.count;
  //         totals.carbs += item.carbs * item.count;
  //         totals.protein += item.protein * item.count;
  //       });
  //       return totals;
  //     },
  //     {
  //       cals: 0,
  //       fat: 0,
  //       carbs: 0,
  //       protein: 0,
  //     }
  //   );
  // };

  const calcTotals = (cart: Cart): Totals => {
    const temp = allItems.reduce(
      (t, item) => {
        const count = cart[item.id] || 0;
        t.cals += item.cals * count
        t.fat += item.fat * count;
        t.carbs += item.carbs * count;
        t.protein += item.protein * count;
        return t;
      },
      { cals: 0, fat: 0, carbs: 0, protein: 0 }
    );
    temp.cals = Math.round(temp.cals*10)/10;
    temp.fat = Math.round(temp.fat*10)/10;
    temp.carbs = Math.round(temp.carbs*10)/10;
    temp.protein = Math.round(temp.protein*10)/10;
    return temp;
  };


  const totals = calcTotals(cart);


  const [savedMeals, setSavedMeals] = usePersistentState<SavedMeal[]>('Saved Meals', []);

  // const saveMeal = (name: string, total: Totals) => {
  //   const itemsInCart = categories
  //       .flatMap(category => category.items)
  //       .filter(item => item.count > 0)
  //       .map(item => ({ ...item })); // copy

  //   if (itemsInCart.length === 0) return;

  //   setSavedMeals(prev => [
  //       ...prev,
  //       {
  //       id: Date.now(),
  //       name,
  //       items: itemsInCart,
  //       total
  //       },
  //   ]);
  // };

  const saveMeal = (name: string, total: Totals, hall: number, mealType: string) => {
    const items = Object.entries(cart).map(([id, count]) => ({
      id: (Number(id) < 50000 ? (Number(id) < 10000 ? -1 : (permItems.find(i => i.name === (allItems.find(i => i.id === Number(id))?.name ?? "")))?.id ?? -1) : Number(id)),
      name: allItems.find(i => i.id === Number(id))?.name ?? "",
      count,
    }));

    setSavedMeals(prev => [
      ...prev,
      {
        id: Date.now(),
        name,
        items,
        total,
        hall,
        mealType,
        starred: false
      },
    ]);
    setSavedMeals(prev => prev.filter(meal => Date.now() - meal.id <= deltime && !meal.starred));
  };
 
  const deleteMeal = (id: number) => {
    setSavedMeals(prev =>
      prev.filter(meal => meal.id !== id)
    );
  };

  const toggleStar = (mealId: number) => {
    setSavedMeals(prev =>
      prev.map(meal =>
        meal.id === mealId
          ? { ...meal, starred: !meal.starred }
          : meal
      )
    );
  };

  function getAverage(choice: number, time: number): Totals { // choice: 0 - all, 1 - breakfast, 2 - lunch/brunch, 3 - dinner, time in days
    const daytime = 1000*60*60*24; // buffer = daytime / 8 (3 hours)
    const mealnames = [[], ["Breakfast"], ["Brunch", "Lunch"], ["Dinner"]];
    const cur: Totals = {
      cals: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    };
    const last = (savedMeals.length > 0 ? savedMeals[savedMeals.length-1] : -1);
    if (last === -1) return cur;
    let inlist: SavedMeal[] = [];
    if (choice === 0) {
      inlist = savedMeals.filter(meal => meal.id >= last.id - (daytime*time-daytime/8));
    } else {
      for (let i = savedMeals.length-1; i >= 0; i--) {
        if (inlist.length >= time) break;
        if (savedMeals[i].mealType === mealnames[choice][0] || (mealnames[choice].length>0 && savedMeals[i].mealType === mealnames[choice][1])) inlist.push(savedMeals[i]);
      }
    }
    if (inlist.length === 0) return cur;
    inlist.forEach(meal => {
      cur.cals += meal.total.cals;
      cur.fat += meal.total.fat;
      cur.carbs += meal.total.carbs;
      cur.protein += meal.total.protein;
    })
    const divi = (choice === 0 ? time : inlist.length);
    cur.cals = Math.round((cur.cals/divi)*10)/10;
    cur.fat = Math.round((cur.fat/divi)*10)/10;
    cur.carbs = Math.round((cur.carbs/divi)*10)/10;
    cur.protein = Math.round((cur.protein/divi)*10)/10;
    return cur;
  }

  const fetchDate = () => {
    const d = new Date();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear() % 100;
    return (month + "").padStart(2, '0') + (day + "").padStart(2, '0') + (year + "").padStart(2, '0');
  };

  return (
    <MealContext.Provider value={{ add, remove, clear, saveMeal, calcTotals, totals, cart, allItems, getCount,
    deleteMeal, toggleStar, savedMeals, selectedHall, selectedMealType, setHall, DayMenu, setDayMenu, setMealType, archivedIds, toggleArchive,
    customItems, addCustomItem, removeTemporaryItems, deleteCustomItem, fetchDate, decimal, setDecimal, getAverage }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMeal = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMeal must be used inside MealProvider");
  }
  return context;
};
