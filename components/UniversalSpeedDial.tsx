import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { SpeedDial } from "react-native-elements";
import { RootStackParamList } from "../navigation/AppNavigator";

const UniversalSpeedDial = () => {
  const [open, setOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBookInspection = () => {
    setOpen(false);
    navigation.navigate("BookInspection");
  };

  const handleChat = () => {
    setOpen(false);
    console.log("Chat with Us");
  };

  return (
    <SpeedDial
      isOpen={open}
      icon={{ name: "add", color: "#fff" }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      overlayColor="transparent"
      buttonStyle={styles.fab}
      containerStyle={styles.fabContainer}
    >
      {/* Book Inspection Action */}
      <View style={styles.actionWrapperWithMargin}>
        <TouchableWithoutFeedback onPress={handleBookInspection}>
          <View>
            <SpeedDial.Action
              icon={{ name: "event-available", color: "#fff" }}
              title="Book Inspection"
              onPress={handleBookInspection}
              buttonStyle={styles.actionButton}
              titleStyle={styles.titleStyle}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Chat Action */}
      <View style={styles.actionWrapperWithMarginsecond}>
        <TouchableWithoutFeedback onPress={handleChat}>
          <View>
            <SpeedDial.Action
              icon={{ name: "chat", color: "#fff" }}
              title="Chat with Us"
              onPress={handleChat}
              buttonStyle={styles.actionButton}
              titleStyle={styles.titleStyle}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SpeedDial>
  );
};

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#4CAF50",
  },
  fabContainer: {
    position: "absolute",
    bottom: 50,
    right: 1,
  },
  actionButton: {
    backgroundColor: "#4CAF50",
  },
  actionWrapperWithMargin: {
    marginBottom: -10,
  },
  actionWrapperWithMarginsecond: {
    marginBottom: 90,
  },
  titleStyle: {
    marginLeft: 1,
    fontSize: 14,
  },
});

export default UniversalSpeedDial;
