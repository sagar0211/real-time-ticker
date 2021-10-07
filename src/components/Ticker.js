import React from "react";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { Text } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid"; // 0.1.14

export default function Ticker({ data }) {
  if (Array.isArray(data)) {
    // console.log(data);
    var [
      BID,
      BID_SIZE,
      ASK,
      ASK_SIZE,
      DAILY_CHANGE_DATA,
      DAILY_RELATIVE_CHANGE_DATA,
      LAST_UPDATED_PRICE,
      VOLUME,
      DAY_HIGH,
      DAY_LOW,
    ] = data;
  }

  return (
    <Grid>
      <Row style={{ width: 400 }}>
        <Col size={2} style={{ backgroundColor: "#102331", height: 70 }}>
          <Row
            style={{
              alignItems: "center",
              backgroundColor: "#102331",
            }}
          >
            <BsCurrencyBitcoin
              style={{
                fontSize: 42,
                color: "#E6E6E6",
                marginLeft: 10,
                marginRight: 5,
                marginBottom: 15,
              }}
            />
          </Row>
        </Col>
        <Col size={5} style={{ backgroundColor: "#102331", height: 70 }}>
          <Text style={{ color: "white" }}>BTC/USD</Text>
          <Text style={{ color: "white" }}>
            Vol : {Number(VOLUME).toLocaleString()} BTC
          </Text>
          <Text style={{ color: "white" }}>
            Low : {Number(DAY_LOW).toLocaleString()}
          </Text>
        </Col>
        <Col size={3.8} style={{ backgroundColor: "#102331", height: 70 }}>
          <Text style={{ color: "white" }}>
            {Number(LAST_UPDATED_PRICE).toLocaleString()}
          </Text>
          {DAILY_CHANGE_DATA < 0 && DAILY_RELATIVE_CHANGE_DATA < 0 ? (
            <Text style={{ color: "#E44B44" }}>
              {Math.abs(Number(DAILY_CHANGE_DATA).toFixed(2).toLocaleString())} <GoTriangleDown /> (
              {Math.abs(Number(DAILY_RELATIVE_CHANGE_DATA * 100).toFixed(2))}
              %)
            </Text>
          ) : (
            <Text style={{ color: "#01C095" }}>
              {Number(DAILY_CHANGE_DATA).toFixed(2).toLocaleString()} {<GoTriangleUp />} (
              {Number(DAILY_RELATIVE_CHANGE_DATA * 100).toFixed(2)}
              %)
            </Text>
          )}
          <Text style={{ color: "white" }}>
            High : {Number(DAY_HIGH).toLocaleString()}
          </Text>
        </Col>
      </Row>
    </Grid>
  );
}
