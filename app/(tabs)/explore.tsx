import { SavedMeal, useMeal } from "@/context/MealContext";
import { diningHalls } from "@/data/menu";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";



export default function TabTwoScreen() {

  const { savedMeals, deleteMeal, toggleStar, customItems, getAverage } = useMeal();

  const [selectedMeal, setSelectedMeal] = useState<SavedMeal | null>(null);


  const [showDelConf, setShowDelConf] = useState(false);
  const [saveDelete, setSaveDelete] = useState<SavedMeal | null>(null);
  const [showAverage, setShowAverage] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);

  const choicesList = ["All Meals", "Breakfast", "Lunch/Brunch", "Dinner"];
  const [choice, setChoice] = useState(0);
  const [choices, setChoices] = useState(
    choicesList.map(ch => ({ label: ch, value: choicesList.indexOf(ch) }))
  );
  const [avgTime, setAvgTime] = useState("7");

  // const staticItems = diningHalls.flatMap(hall =>
  //   Object.values(hall.meals)
  //     .flatMap(meal => meal.items)
  //     .flatMap(category => category.items)
  // );

  // const extraItems = Extra.flatMap(hall =>
  //   Object.values(hall.meals)
  //     .flatMap(meal => meal.items)
  //     .flatMap(category => category.items)
  // );

  // // Add static items
  // [...staticItems, ...extraItems, ...customItems].forEach(item => {
  //   itemById.set(item.id, item);
  // });

  return (
    <>
      <Modal visible={!!selectedMeal} animationType="slide">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.mealname}>
              {selectedMeal?.name}
            </Text>
            <Text style={styles.hallname}>
              {selectedMeal ? diningHalls[selectedMeal?.hall].name : ""}
            </Text>
            <Text style={styles.hallname}>
              {selectedMeal?.mealType}
            </Text>
          </View>
          <ScrollView style={{padding:20}}>

            {selectedMeal?.items.map(item => (
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  {item.name} × {item.count}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Pressable onPress={() => setSelectedMeal(null)}>
            <View style={[styles.closeBox, {bottom:50}]}>
              <Text style={styles.close}>Close</Text>
            </View>
          </Pressable>

          <View style={styles.totalsBox}>
            <Text style={styles.totalsText}>Calories: {selectedMeal?.total.cals}    Fat: {selectedMeal?.total.fat}g</Text>
            <Text style={styles.totalsText}>Carbs: {selectedMeal?.total.carbs}g    Protein: {selectedMeal?.total.protein}g</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={[styles.mealname, {marginTop:20}]}>Saved Meals</Text>
      </View>
      <ScrollView style={[styles.container, {paddingTop:30}]}>
        {(showStarred ? savedMeals.filter(m => m.starred) : savedMeals).map(meal => (
          <Pressable
            //key={meal.id}
            style={styles.item}
            onPress={() => setSelectedMeal(meal)}
          >
            <Text style={styles.itemText}>{meal.name}</Text>
            <View style={{flexDirection:'row'}}>
              <Pressable style={[styles.delete, {backgroundColor:(meal.starred ? "#EFEF00" : "white")}]} onPress={() => toggleStar(meal.id)}>
                <MaterialIcons size={20} name={meal.starred ? "star" : "star-outline"} color={meal.starred ? "#FFFF99" : "black"} />
              </Pressable>
              <Pressable style={styles.delete} onPress={() => {setSaveDelete(meal); setShowDelConf(true); }}>
                <MaterialIcons size={20} name="delete" color="black" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {saveDelete && (
        <Modal visible={showDelConf} transparent animationType="fade"> 
          <View style={styles.overlay}>
            <View style={styles.prompt}>
              <Text style={styles.title}>Delete saved meal -{`\n`}{saveDelete != null ? saveDelete.name : "[null]"}?</Text>

              <View style={[styles.boxes, {paddingHorizontal:40,marginTop:20}]}>
                <Pressable onPress={() => { if (saveDelete != null) deleteMeal(saveDelete.id); setShowDelConf(false); setSaveDelete(null);}}>
                  <View style={styles.saveBox}>
                    <Text style={styles.save}>Yes</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => { setShowDelConf(false); setSaveDelete(null); }}>
                  <View style={[styles.cancelBox, {paddingHorizontal:15}]}>
                    <Text style={styles.cancel}>No</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View style={[styles.starButtonContainer, {backgroundColor: (showStarred ? '#EFEF00' : '#F2F2F7')}]}>
        <Pressable onPress={() => setShowStarred(!showStarred)}>
            <MaterialIcons size={40} name={showStarred ? "star" : "star-outline"} color={showStarred ? "#FFFF99" : "black"} />
        </Pressable>
      </View>

      <View style={styles.averageButtonContainer}>
        <Pressable onPress={() => setShowAverage(true)}>
          <MaterialIcons size={40} name="schedule" color="black" />
        </Pressable>
      </View>

      <Modal visible={showAverage} transparent animationType="fade">
        <View style={{marginTop:175,justifyContent:'center',alignItems:'center'}}>
          <View style={styles.prompt}>
            <Text style={styles.title}>Calculate Average</Text>

            <Text style={{fontSize:20, marginTop:20}}>Select Meal Type:</Text>
            <View style={{zIndex: 100, margin: 10}}>
              <DropDownPicker
                open={choiceOpen}
                value={choice}
                items={choices}
                setOpen={setChoiceOpen}
                setValue={setChoice}
                setItems={setChoices}
                placeholder="Select Category"
              />
            </View>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', padding: 20}}>
              <Text style={{fontSize:20}}>Days:</Text>
              <TextInput
                selectTextOnFocus
                value={avgTime}
                onChangeText={setAvgTime}
                placeholder={"7"}
                style={styles.input}
              />
            </View>

            <View style={[styles.totalsBox, {position: "relative", bottom:0,left:0,marginVertical:20}]}>
              <Text style={styles.totalsText}>Calories: {getAverage(choice, Number(avgTime)).cals}    Fat: {getAverage(choice, Number(avgTime)).fat}g</Text>
              <Text style={styles.totalsText}>Carbs: {getAverage(choice, Number(avgTime)).carbs}g    Protein: {getAverage(choice, Number(avgTime)).protein}g</Text>
            </View>

            <Pressable onPress={() => setShowAverage(false)}>
              <View style={[styles.closeBox, {bottom:0}]}>
                <Text style={styles.close}>Close</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: '#FF7777',
    paddingTop: 50,
  },
  mealname: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'white',
    textAlign:'center',
  },
  hallname: {
     fontSize: 20,
     fontWeight: 'bold',
     marginBottom: 16,
     color:'white',
     textAlign: 'center'
  },
  category: {
    color: "white",
    fontSize: 20,
    fontWeight: '600',
    marginTop: 100,
    marginBottom: 40,
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
    fontSize: 16,
    margin: 5,
  },
  delete: {
    backgroundColor: '#FF4444',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  closeBox: {
    alignSelf: 'center',
    backgroundColor: '#D2D2D7',
    padding: 7,
    borderRadius: 10,
  },
  starBox: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    backgroundColor: '#B9B9BF',
    padding: 7,
    borderRadius: 10,
  },
  cancelBox: {
    backgroundColor: '#B9B9BF',
    padding: 7,
    borderRadius: 10,
  },
  close: {
    fontSize: 25,
    color: "red",
  },
  cancel: {
    fontSize: 16,
    color: "red",
  },
  totalsBox: {
    position: "absolute",
    bottom: 100,
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
  averageButtonContainer: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 10,
    borderRadius: 24,
    zIndex: 10,
  },
  starButtonContainer: {
    position: "absolute",
    bottom: 100,
    right: 32,
    padding: 10,
    borderRadius: 24,
    zIndex: 10,
  },
  input: {
    width: 50,
    fontSize: 24,
    color: "#555555",
    textAlign: 'center',
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
    textAlign: 'center',
    fontSize: 24,
  },
  saveBox: {
    backgroundColor: '#B9B9BF',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  boxes: { 
    flexDirection: "row",          // ← lays these 3 out left→right
    width: '60%',
    alignItems: "center",
    justifyContent: "space-between",
  },
  save: {
    fontSize: 16,
    color: "green",
  },
});
