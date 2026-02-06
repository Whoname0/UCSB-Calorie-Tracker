import { useMeal } from '@/context/MealContext';
import { MenuItem } from '@/data/menu';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Cart() {
  const router = useRouter();

  const { cart, getCount, allItems, decimal, setDecimal, add, remove, totals } = useMeal();

  const [nutrition, setNutrition] = useState<MenuItem | null>(null);

  const cartItems = allItems.filter(item => cart[item.id] > 0);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Current Selection',
          headerBackVisible: false,
          headerRight: () => (
            <View style={styles.backButton}>
              <Pressable onPress={() => router.back()}>
                <MaterialIcons size={25} name="expand-more" color="black" />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.item}>
            <View style={{flexDirection: 'row',alignItems:'center',maxWidth:'55%'}}>
              <Text style={styles.itemText}>{item.name}{item.serving}</Text>
              <Pressable onPress={() => setNutrition(item)}>
                <View style={styles.info}>
                  <MaterialIcons size={20} name="info-outline" color="black" />
                </View>
              </Pressable>
            </View>

            <View style={styles.actions}>
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
      </ScrollView>

      {!!nutrition && (
        <View style={{flex:1,alignItems:'center'}}>
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

      <View style={styles.totalsBox}>
        <Text style={styles.totalsText}>Calories: {totals.cals}    Fat: {totals.fat}g</Text>
        <Text style={styles.totalsText}>Carbs: {totals.carbs}g    Protein: {totals.protein}g</Text>
      </View>

      <View style={[styles.decimalButtonContainer, decimal && {backgroundColor:'#FF6666'}]}>
        <Pressable 
          onPress={() => setDecimal(!decimal)}
        >
          <Text style={{fontSize:30,color:'black'}}>0.1</Text>
        </Pressable>
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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

  backButton: {
    backgroundColor: '#F2F2F7', // light grey iOS style
    padding: 6,
    borderRadius: 15,
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

  nutriBox: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },

  cancelBox: {
    backgroundColor: '#B9B9BF',
    padding: 7,
    borderRadius: 10,
  },
});
