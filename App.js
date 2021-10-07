import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { socketUrl } from "./config/socketUrl";
import Ticker from "./src/components/Ticker";
import {
  fetchDataClear, fetchDataFailed, fetchDataSuccess
} from "./src/store/action";

export default function App() {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const loading = useSelector((state) => state.loading);
  const errors = useSelector((state) => state.errors);
  const [wsInstance, setWsInstance] = useState(null);

  let timeOutId = null;
  let intervalId = null;

  const init = () => {
    let webSocket = new WebSocket(socketUrl);

    const onOpenEvent = () => {
      let config = JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: "tBTCUSD",
      });
      webSocket.send(config);
      intervalId = setInterval(Ping, 5000);
    };
    const onMessageHandler = (message) => {
      let data = JSON.parse(message.data);
      if (Array.isArray(data[1])) {
        dispatch(fetchDataSuccess(data[1]));
      }
      if (data.event === "pong") {
        Pong();
      }
    };
    const onCloseEvent = (event) => {
      clearInterval(intervalId);
      dispatch(fetchDataClear());
      console.log(event);
    };

    const onErrorEvent = (error) => {
      dispatch(fetchDataFailed());
    };

    const Ping = () => {
      if (timeOutId === null) {
        console.log("In Ping");
        webSocket.send(
          JSON.stringify({
            event: "ping",
            cid: 1234,
          })
        );
        let tm = setTimeout(function () {
          dispatch(fetchDataFailed());
        }, 10000);
        timeOutId = tm;
      }
    };

    const Pong = () => {
      console.log("In Pong");
      if (timeOutId) clearTimeout(timeOutId);
      timeOutId = null;
    };

    webSocket.onopen = onOpenEvent;
    webSocket.onmessage = onMessageHandler;
    webSocket.onclose = onCloseEvent;
    webSocket.onerror = onErrorEvent;

    setWsInstance(webSocket);
  };

  const connectHandler = () => {
    timeOutId = null;
    init();
  };

  const disconnectHandler = () => {
    if (timeOutId) clearTimeout(timeOutId);
    wsInstance.close();
  };
  return (
    <View>
      {loading ? null : !data ? (
        <View>
          <Text>{errors}</Text>
          <View style={{ marginLeft: 150, marginRight: 150, marginTop: 50 }}>
            <Button
              title={errors ? "Try Again" : "Connect"}
              onPress={connectHandler}
            />
          </View>
        </View>
      ) : (
        <View>
          <Ticker data={data} />
          <View style={{ marginLeft: 150, marginRight: 150, marginTop: 10 }}>
            <Button title="Disconnect" onPress={disconnectHandler} />
          </View>
        </View>
      )}
    </View>
  );
}

