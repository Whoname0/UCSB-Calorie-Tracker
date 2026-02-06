import { useMeal } from '@/context/MealContext';
import { diningHalls, Extra, MenuItem, Week } from '@/data/menu';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const getTodayString = () => {
  const d = new Date();
  const month = d.getMonth() + 1; // 0-based
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

const getDayOfweek = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date();
  const currentDayOfWeek = daysOfWeek[d.getDay()];
  return currentDayOfWeek;
}

export default function CreateMeal() {
  
  const router = useRouter();

  const { getCount, saveMeal, add, remove, cart, totals, selectedHall, selectedMealType, DayMenu,
    archivedIds, toggleArchive, customItems, addCustomItem, removeTemporaryItems, deleteCustomItem,
    fetchDate, decimal, setDecimal } = useMeal();

  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showCancelConf, setShowCancelConf] = useState(false);
  const [showCustConf, setShowCustConf] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [custDelete, setCustDelete] = useState<MenuItem | null>(null);
  const [nutrition, setNutrition] = useState<MenuItem | null>(null);

  const [mealName, setMealName] = useState("");
  const [searchy, setSearchy] = useState("");

  const [cCategory, setcCategory] = useState("Other");
  const [cName, setcName] = useState("");
  const [cCals, setcCals] = useState("");
  const [cFat, setcFat] = useState("");
  const [cCarbs, setcCarbs] = useState("");
  const [cProtein, setcProtein] = useState("");
  const [cTemp, setcTemp] = useState(false);
  const [cAllHalls, setcAllHalls] = useState(false);
  const [cAllMeals, setcAllMeals] = useState(false);
  const [cDaymenu, setcDaymenu] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const calsRef = useRef<TextInput>(null);
  const fatRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const proteinRef = useRef<TextInput>(null);

  const MealIndex = (DayMenu ? Week[Week.findIndex(d => d.date === fetchDate())].halls : diningHalls)[selectedHall].meals.findIndex(m => m.name === selectedMealType);

  const [catOpen, setCatOpen] = useState(false);

  const [collapsed, setCollapsed] = useState<string[]>([]);

  const toggleCollapsed = (catName: string) => {
    setCollapsed(prev =>
      prev.includes(catName) ? prev.filter(id => id !== catName) : [...prev, catName]
    );
  };

  const trimmed = (s: string) =>
    s.toLowerCase().replace(/\s+/g, ' ').trim();

  const AllCategories = (
    DayMenu ?
    [...Week.find(d => d.date === fetchDate())?.halls[selectedHall].meals[MealIndex].items ?? [],
      ...Extra[selectedHall].meals.flatMap(meal => meal.items)]
    :
    [...diningHalls[selectedHall].meals[MealIndex].items,
      ...Extra[selectedHall].meals.flatMap(meal => meal.items)]
  );

  const [catItems, setCatItems] = useState(
    AllCategories.map(cat => ({ label: cat.name, value: cat.name }))
  );

  useEffect(() => {
    // This runs only once, after the first render
    Extra[selectedHall].meals
      .flatMap(meal => meal.items)
      .forEach(c => toggleCollapsed(c.name));
  }, []); // empty array → run only once

  


  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Meal',
          headerBackVisible: false,
          gestureEnabled: false,
          headerLeft: () => (
            <Pressable onPress={() => setShowSavePrompt(true)}>
              <Text
                style={{ color: "#557A33", marginHorizontal: 5, fontSize: 16 }}
              > Save </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => Object.values(cart).length === 0 ? router.back() : setShowCancelConf(true)}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Cancel</Text>
            </Pressable>
          ),
        }}
      />

      <Modal visible={showCancelConf} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.prompt}>
            <Text style={styles.title}>Cancel this meal?</Text>

            <View style={[styles.boxes, {paddingHorizontal:40,marginTop:20}]}>
              <Pressable onPress={() => { setShowCancelConf(false); router.back(); }}>
                <View style={styles.saveBox}>
                  <Text style={styles.save}>Yes</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => {
                  setShowCancelConf(false);
                }}>
                <View style={[styles.cancelBox, {paddingHorizontal:15}]}>
                  <Text style={styles.cancel}>No</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSavePrompt} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.prompt}>
            <Text style={styles.title}>Name This Meal:</Text>

            <TextInput
              value={mealName}
              onChangeText={setMealName}
              placeholder={getTodayString() + " " + getDayOfweek() + " " + selectedMealType}
              style={[styles.input, {width:300}]}
            />

            <View style={styles.boxes}>
              <Pressable
                onPress={() => {
                  saveMeal(mealName.length > 0 ? mealName : getTodayString() + " " + getDayOfweek() + " " + selectedMealType, totals, selectedHall, selectedMealType);
                  removeTemporaryItems();
                  setMealName("");
                  setShowSavePrompt(false);
                  router.replace('/(tabs)/explore');
                }}
              >
                <View style={styles.saveBox}>
                  <Text style={styles.save}>Save</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => {
                  setShowSavePrompt(false);
                }}>
                <View style={styles.cancelBox}>
                  <Text style={styles.cancel}>Cancel</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCustomPrompt} transparent animationType="fade">
        <View style={{marginTop:150,justifyContent:'center',alignItems:'center'}}>
          <View style={styles.prompt}>
            <Text style={styles.title}>Create Custom Item:</Text>

            <Text>Select Category:</Text>
            <View style={{zIndex: 100, margin: 10}}>
              <DropDownPicker
                open={catOpen}
                value={cCategory}
                items={catItems}
                setOpen={setCatOpen}
                setValue={setcCategory}
                setItems={setCatItems}
                placeholder="Select Category"
              />
            </View>
            <Text>Item Name:</Text>
            <TextInput
              ref={nameRef}
              value={cName}
              onChangeText={setcName}
              placeholder={"Custom Item " + (customItems.length+1) + ""}
              style={[styles.input, {width: 250}]}
              returnKeyType="next"
              onSubmitEditing={() => calsRef.current?.focus()}
            />
            <View style={{flexDirection:'row', marginRight:5}}>
            <View style={{justifyContent:'center', alignItems:'center', padding: 20, marginHorizontal:27}}>
            <Text>Calories:</Text>
            <TextInput
              ref={calsRef}
              selectTextOnFocus
              value={cCals}
              onChangeText={setcCals}
              placeholder={"0"}
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => fatRef.current?.focus()}
            />
            </View>
            <View style={{justifyContent:'center', alignItems:'center', padding: 20, marginHorizontal:27}}>
            <Text>Fat:</Text>
            <TextInput
              ref={fatRef}
              selectTextOnFocus
              value={cFat}
              onChangeText={setcFat}
              placeholder={"0"}
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => carbsRef.current?.focus()}
            />
            </View>
            </View>
            <View style={{flexDirection:'row'}}>
            <View style={{justifyContent:'center', alignItems:'center', padding: 20, marginHorizontal:30}}>
            <Text>Carbs:</Text>
            <TextInput
              ref={carbsRef}
              selectTextOnFocus
              value={cCarbs}
              onChangeText={setcCarbs}
              placeholder={"0"}
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => proteinRef.current?.focus()}
            />
            </View>
            <View style={{justifyContent:'center', alignItems:'center', padding: 20, marginHorizontal:30}}>
            <Text>Protein:</Text>
            <TextInput
              ref={proteinRef}
              selectTextOnFocus
              value={cProtein}
              onChangeText={setcProtein}
              placeholder={"0"}
              style={styles.input}
              returnKeyType="done"
            />
            </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{alignItems:'center', marginRight:23,marginLeft:8}}>
                <Text>Temporary?</Text>
                <Pressable onPress={() => setcTemp(!cTemp)}>
                  <View style={{width: 30, height: 30, backgroundColor: (cTemp ? "black" : "white")}}></View>
                </Pressable>
              </View>
              <View style={{alignItems:'center'}}>
                <Text>On Day Menus?</Text>
                <Pressable onPress={() => !cTemp && setcDaymenu(!cDaymenu)}>
                  <View style={{width: 30, height: 30, backgroundColor: (cDaymenu && !cTemp ? "black" : (cTemp ? "#CC0000" : "white"))}}></View>
                </Pressable>
              </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{alignItems:'center', marginRight:50}}>
                <Text>All Halls?</Text>
                <Pressable onPress={() => !cTemp && setcAllHalls(!cAllHalls)}>
                  <View style={{width: 30, height: 30, backgroundColor: (cAllHalls && !cTemp ? "black" : (cTemp ? "#CC0000" : "white"))}}></View>
                </Pressable>
              </View>
              <View style={{alignItems:'center', marginBottom:30}}>
                <Text>All Meals?</Text>
                <Pressable onPress={() => !cTemp && setcAllMeals(!cAllMeals)}>
                  <View style={{width: 30, height: 30, backgroundColor: (cAllMeals && !cTemp ? "black" : (cTemp ? "#CC0000" : "white"))}}></View>
                </Pressable>
              </View>
            </View>

            <View style={styles.boxes}>
              <Pressable
                onPress={() => {
                  addCustomItem((cAllHalls && !cTemp ? [0,1,2] : [selectedHall]), (cAllMeals && !cTemp ? ["Breakfast", "Brunch", "Lunch", "Dinner"] : [selectedMealType]), cCategory,
                  (cName === "" ? "Custom Item " + (customItems.length+1) + "" : cName),
                  Number(cCals), Number(cFat), Number(cCarbs), Number(cProtein), cTemp, cDaymenu || cTemp);
                  setcCategory("Other"); setcName(""); setcCals(""); setcFat(""); setcCarbs(""); setcProtein(""); setcTemp(false); setcDaymenu(false); setcAllHalls(false); setcAllMeals(false);
                  setShowCustomPrompt(false);
                }}
              >
                <View style={styles.saveBox}>
                  <Text style={styles.save}>Add</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setShowCustomPrompt(false)}>
                <View style={styles.cancelBox}>
                  <Text style={styles.cancel}>Cancel</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 250, paddingTop: 80 }}>
        {AllCategories.map(category => {
          const mergedItems = [
            ...category.items.filter(item => !archivedIds.includes(item.id) && trimmed(item.name).includes(trimmed(searchy))),
            ...customItems.filter(
              item =>
                !archivedIds.includes(item.id) &&
                trimmed(item.name).includes(trimmed(searchy)) &&
                item.hall.includes(selectedHall) &&
                item.mealType.includes(selectedMealType) &&
                (item.daymenu || !DayMenu) &&
                item.category === category.name
            ),
          ];
          if (mergedItems.length === 0) return;
          
          return (
            <View key={category.name}>
              {/* Category header */}
              <Pressable onPress={() => toggleCollapsed(category.name)}>
                <Text style={[styles.category, collapsed.includes(category.name) && {color:"gray"}]}>{category.name}</Text>
              </Pressable>

              {/* Items in this category */}
              {!collapsed.includes(category.name) && (
                <View>
                  {mergedItems.map(item => (
                    <View key={item.id} style={styles.item}>
                      <View style={{flexDirection: 'row',alignItems:'center',maxWidth:(item.id < 5000 ? '45%' : '55%')}}>
                        <Text style={styles.itemText}>{item.name}{item.serving}</Text>
                        <Pressable onPress={() => setNutrition(item)}>
                          <View style={styles.info}>
                            <MaterialIcons size={20} name="info-outline" color="black" />
                          </View>
                        </Pressable>
                      </View>

                      <View style={styles.actions}>
                        {item.id < 5000 && (
                          <Pressable onPress={() => { setCustDelete(item); setShowCustConf(true); }}>
                            <View style={styles.delete}>
                              <MaterialIcons size={20} name="delete" color="black" />
                            </View>
                          </Pressable>
                        )}
                        <Pressable onPress={() => toggleArchive(item.id)}>
                          <View style={styles.archive}>
                            <MaterialIcons size={20} name="folder-open" color="black" />
                          </View>
                        </Pressable>

                        <Text style={styles.counter}>{getCount(item.id)}</Text>
                      
                        <Pressable onPress={() => add(item.id)}>
                          <View style={styles.pmButton}>
                              <MaterialIcons size={15} name="add" color="black" />
                          </View>
                        </Pressable>

                        <Pressable onPress={() => remove(item.id)}>
                          <View style={styles.pmButton}>
                              <MaterialIcons size={15} name="horizontal-rule" color="black" />
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
        )})}
      </ScrollView>

      {custDelete && (
        <Modal visible={showCustConf} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.prompt}>
              <Text style={styles.title}>Delete {custDelete != null ? custDelete.name : "[null]"}?</Text>

              <View style={[styles.boxes, {paddingHorizontal:40,marginTop:20}]}>
                <Pressable onPress={() => { if (custDelete != null) deleteCustomItem(custDelete.id); setShowCustConf(false); setCustDelete(null); }}>
                  <View style={styles.saveBox}>
                    <Text style={styles.save}>Yes</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => {
                    setShowCustConf(false); setCustDelete(null);
                  }}>
                  <View style={[styles.cancelBox, {paddingHorizontal:15}]}>
                    <Text style={styles.cancel}>No</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {!!nutrition && (
        <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,justifyContent:'center'}}>
          <View style={styles.nutriBox}>
            <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
              <Text style={styles.totalsText}>{nutrition.name}</Text>
              <Pressable onPress={() => setNutrition(null)}>
                <View style={styles.cancelBox}>
                  <MaterialIcons size={20} name="close" color="black" />
                </View>
              </Pressable>
            </View>
            <Text style={styles.totalsText}>Calories: {nutrition.cals}    Fat: {nutrition.fat}g</Text>
            <Text style={styles.totalsText}>Carbs: {nutrition.carbs}g    Protein: {nutrition.protein}g</Text>
          </View>
        </View>
      )}
      <View style={styles.searchContainer}>
          <TextInput
            value={searchy}
            onChangeText={setSearchy}
            placeholder={"Filter..."}
            style={[styles.input, {width:250, textAlign:'left', paddingHorizontal:20}]}
          />
        <View style={{padding: 10, borderRadius: 16, zIndex: 10, backgroundColor: '#E7E7EC'}}>
          <MaterialIcons size={30} name="search" color="black"></MaterialIcons>
        </View>
      </View>

      <View style={[styles.decimalButtonContainer, decimal && {backgroundColor:'#FF6666'}]}>
        <Pressable 
          onPress={() => setDecimal(!decimal)}
        >
          <Text style={{fontSize:30,color:'black'}}>0.1</Text>
        </Pressable>
      </View>

      <View style={styles.customButtonContainer}>
        <Pressable 
          onPress={() => setShowCustomPrompt(true)}
        >
          <MaterialIcons size={40} name="add" color="black" />
        </Pressable>
      </View>

      <View style={styles.archiveButtonContainer}>
        <Pressable 
          onPress={() => router.push('/archive')}
        >
          <MaterialIcons size={40} name="folder" color="black" />
        </Pressable>
      </View>
      
      <View style={styles.cartButtonContainer}>
        <Pressable 
          onPress={() => router.push('/cart')}
        >
          <MaterialIcons size={40} name="expand-less" color="black" />
        </Pressable>
      </View>

      <View style={styles.totalsBox}>
        <Text style={styles.totalsText}>Calories: {totals.cals}    Fat: {totals.fat}g</Text>
        <Text style={styles.totalsText}>Carbs: {totals.carbs}g    Protein: {totals.protein}g</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },

  // checkbox: {
  //   backgroundColor: "white",
  // },

  category: {
    color: "white",
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },

  item: {
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",          // ← horizontal layout
    justifyContent: "space-between", // ← pushes name left, buttons right
    alignItems: "center",
    paddingVertical: 4,
  },

  itemText: {
    flex: 1,
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",          // ← lays these 3 out left→right
    alignItems: "center",
  },

  pmButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#D2D2FF',
    marginLeft: 8,                 // ← spacing between buttons
  },

  counter: {
    color: "black",
    fontSize: 14,
    marginRight: 12,
  },

  info: {
    backgroundColor: '#D2D2FF',
    padding: 5,
    borderRadius: 10,
    marginLeft: 10,
  },

  archive: {
    backgroundColor: '#FFFFC2',
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },

  delete: {
    backgroundColor: '#DD6666',
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },

  cartButtonContainer: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 10,
    borderRadius: 24,
    marginBottom: 16,
    zIndex: 10,
  },

  archiveButtonContainer: {
    position: "absolute",
    bottom: 100,
    right: 32,
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 10,
    borderRadius: 24,
    marginBottom: 16,
    zIndex: 10,
  },

  customButtonContainer: {
    position: "absolute",
    bottom: 168,
    right: 32,
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 10,
    borderRadius: 24,
    marginBottom: 16,
    zIndex: 10,
  },

  decimalButtonContainer: {
    position: "absolute",
    bottom: 130,
    left: 32,
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 10,
    borderRadius: 24,
    marginBottom: 16,
    zIndex: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    position: "absolute",
    alignSelf: 'center',
    justifyContent:'center',
    top: 10,
    backgroundColor: '#C2C2C7', // light grey iOS style
    padding: 0,
    borderRadius: 16,
    zIndex: 10,
  },

  totalsBox: {
    position: "absolute",
    bottom: 32,
    left: 32,
    backgroundColor: '#F2F2F7',
    padding : 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    zIndex: 10,
  },

  totalsText: {
    fontSize: 18,
    margin: 5,
  },

  nutriBox: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },

  overlay: {
    flex: 1,                 // ← fill the whole screen
    justifyContent: "center",// ← vertical center
    alignItems: "center",    // ← horizontal center
  },
  
  prompt: {
    backgroundColor: '#C2C2C7',
    padding: 20,
    alignSelf: 'center',
    alignItems:'center',
    borderRadius: 20,
  },
  
  title: {
    fontSize: 24,
  },

  input: {
    width: 50,
    fontSize: 24,
    color: "#555555",
    textAlign: 'center',
  },

  saveBox: {
    backgroundColor: '#B9B9BF',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  cancelBox: {
    backgroundColor: '#B9B9BF',
    padding: 7,
    borderRadius: 10,
  },

  boxes: { 
    flexDirection: "row",          // ← lays these 3 out left→right
    width: '60%',
    alignItems: "center",
    justifyContent: "space-between",
  },

  cancel: {
    fontSize: 16,
    color: "red",
  },

  save: {
    fontSize: 16,
    color: "green",
  },
});
