import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Heading } from "react-native-sketchbook";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApolloClient } from "@apollo/client";

import Record, { IRecord } from "./Record";

import { ALL_RECORDS } from "../../queries/historys";

const User = () => {
  const [records, setRecords] = useState<IRecord[]>([]);

  const client = useApolloClient();

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      const { data } = await client.query({
        query: ALL_RECORDS,
        fetchPolicy: "network-only",
        context: { headers: { authorization: token } },
      });

      setRecords(data.getRecords);
    };

    fetchData();
  }, []);

  return (
    <>
      <Heading style={styles.heading}>Purchase History</Heading>
      {records.length === 0 ? (
        <Text style={styles.notFoundText}>
          You have no purchase history yet.
        </Text>
      ) : (
        <View style={{ gap: 12 }}>
          {records.map((record) => (
            <Record key={record.id} {...record} />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: 500,
    color: "#713030",
  },
  notFoundText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: 400,
    color: "#888888",
    textAlign: "center",
    marginVertical: 36,
  },
});

export default User;
