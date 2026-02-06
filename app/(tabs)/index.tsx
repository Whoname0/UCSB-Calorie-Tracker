import { useMeal } from '@/context/MealContext';
import { Week } from '@/data/menu';
import { useRouter } from 'expo-router';
import 'expo-router/entry';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();

  const { clear, setHall, selectedHall, DayMenu, setDayMenu, selectedMealType, setMealType, fetchDate, setDecimal } = useMeal();
  
  //const [showStartPrompt, setShowStartPrompt] = useState(false);

  //const [hallOpen, setHallOpen] = useState(false);
  //const [mealOpen, setMealOpen] = useState(false);

  const mealTypes: string[] = ["Breakfast", "Brunch", "Lunch", "Dinner"];

  //const [mealItems, setMealItems] = useState(
    //mealTypes.map(m => ({ label: m, value: m }))
  //);

  //const [halls, setHalls] = useState(
    //diningHalls.map(hall => ({ label: hall.name, value: hall.id }))
  //);

  function handleChange(newHall: number, newMealtype: string) {
    const dayindex = Week.findIndex(d => d.date === fetchDate());
    if (dayindex === -1 || Week[dayindex].halls.length <= newHall) { setDayMenu(null); return; } 
    setDayMenu((Week[dayindex].halls[newHall].meals.findIndex(d => d.name === newMealtype) != -1 ? true : null));
  }

  useEffect(() => {
    if (selectedHall !== null && selectedMealType != null) {
      handleChange(selectedHall, selectedMealType);
    }
  }, [selectedHall, selectedMealType]);
 
  return (
    <>
      {/* <Modal visible={showStartPrompt} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.prompt}>
            <Text style={styles.title}>Select Dining Hall and Meal Type:</Text>
            <View style={{zIndex: 100, margin: 10}}>
              <DropDownPicker
                open={hallOpen}
                value={selectedHall}
                items={halls}
                setOpen={setHallOpen}
                setValue={setHall}
                setItems={setHalls}
                placeholder="Select Meal Type"
              />
            </View>
            <View style={{zIndex: 99, margin: 10}}>
              <DropDownPicker
                open={mealOpen}
                value={selectedMealType}
                items={mealItems}
                setOpen={setMealOpen}
                setValue={setMealType}
                setItems={setMealItems}
                placeholder="Select Meal Type"
              />
            </View>

            {DayMenu != null && (
              <View>
                <Text>Use Day Menu?</Text>
                <Pressable onPress={() => setDayMenu(!DayMenu)}>
                  <View style={{width: 30, height: 30, alignSelf: 'center', margin: 10, backgroundColor: (DayMenu ? "black" : "white")}}></View>
                </Pressable>
              </View>
            )}

            <View style={styles.boxes}>
              <Pressable
                onPress={() => {
                  setShowStartPrompt(false);
                  clear();
                  setDecimal(false);
                  router.push('../create-meal');
                }}
              >
                <View style={styles.saveBox}>
                  <Text style={styles.save}>Start</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setShowStartPrompt(false)}>
                <View style={styles.cancelBox}>
                  <Text style={styles.cancel}>Cancel</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal> */}

      <View style={{backgroundColor: '#FF7777',paddingTop: 50}}>
        <Text style={styles.headtitle}>Create Meal</Text>
      </View>
      <View style={styles.overlay}>
        <Text style={styles.instruct}>Select a Dining Hall:</Text>
        <View style={{flexDirection:'row'}}>
          <Pressable style={[styles.button, {backgroundColor:(selectedHall === 0 ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setHall(0)}>
            <Text>De La Guerra</Text>
          </Pressable>
          <Pressable style={[styles.button, {backgroundColor:(selectedHall === 1 ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setHall(1)}>
            <Text>Portola</Text>
          </Pressable>
          <Pressable style={[styles.button, {backgroundColor:(selectedHall === 2 ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setHall(2)}>
            <Text>Carrillo</Text>
          </Pressable>
        </View>
        <Text style={styles.instruct}>Select a Meal Type:</Text>
        <View style={{flexDirection:'row'}}>
          <Pressable style={[styles.button, {backgroundColor:(selectedMealType === "Breakfast" ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setMealType("Breakfast")}>
            <Text>Breakfast</Text>
          </Pressable>
          <Pressable style={[styles.button, {backgroundColor:(selectedMealType === "Brunch" ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setMealType("Brunch")}>
            <Text>Brunch</Text>
          </Pressable>
          <Pressable style={[styles.button, {backgroundColor:(selectedMealType === "Lunch" ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setMealType("Lunch")}>
            <Text>Lunch</Text>
          </Pressable>
          <Pressable style={[styles.button, {backgroundColor:(selectedMealType === "Dinner" ? "#B2B2B7" : "#F2F2F7")}]} onPress={() => setMealType("Dinner")}>
            <Text>Dinner</Text>
          </Pressable>
        </View>
        {/* <Pressable
          onPress={() => {
            setShowStartPrompt(true);
          }}
          style={{
            backgroundColor: '#007AFF',
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>
            + Create Meal
          </Text>
        </Pressable> */}
      </View>
      {DayMenu != null && (
        <View style={{position:'absolute',alignSelf:'center',bottom:200}}>
          <Text style={styles.instruct}>Use Day Menu?</Text>
          <Pressable onPress={() => setDayMenu(!DayMenu)}>
            <View style={{width: 30, height: 30, alignSelf: 'center', margin: 10, backgroundColor: (DayMenu ? "#B2B2B7" : "#F2F2F7")}}></View>
          </Pressable>
        </View>
      )}
      <Pressable
        onPress={() => {
          clear();
          setDecimal(false);
          router.push('../create-meal');
        }}
        //style={{alignSelf:'center'}}
      >
        <View style={styles.startBox}>
          <Text style={styles.start}>Start Meal</Text>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,                 // ← fill the whole screen
    justifyContent: "center",// ← vertical center
    alignItems: "center",    // ← horizontal center
    paddingBottom:100,
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
  headtitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'white',
    textAlign:'center',
    marginTop:20,
  },
  instruct: {
    color:'white',
    fontSize:24,
    fontWeight:'500',
  },
  button: {
    //position: 'absolute',
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  startBox: {
    position: 'absolute',
    bottom: 100,
    alignSelf:'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  start: {
    fontSize: 24,
    color: "green",
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
});