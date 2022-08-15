import React from 'react';
import {  Typography, Layout, TimePicker } from "antd";
import LineSelector from "./LineSelector";
import DirectionSelector from "./DirectionSelector";


const LinePage = (props: {}) => {
  return <div>
      <LineSelector/>
      <DirectionSelector/>
      <TimePicker/>
      <Layout style={{minHeight: 600, alignItems: "center", justifyContent: "center"}}>
          <Typography.Title>Map here</Typography.Title>
      </Layout>
  </div>
}

export default LinePage