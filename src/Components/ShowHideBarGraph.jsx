import React, { useState } from 'react';

import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import Chart from "react-apexcharts";
//import { formatLongData } from '../utils/dataFormatter'; // adjust path as needed


const BarGraph1 = ({
  Heading,
  subTitle,
  barFile,
  color,
  bar,
  height
}) => {
  const [showGraph, setShowGraph] = useState(false);
  const formatLongData = (data, colors) => ({
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      dataLabels: {
        enabled: false,
        formatter: (val) => val,
        offsetY: -10,
        style: { fontSize: "12px", colors: ["#304758"] },
      },
      stroke: {
        show: true,
        width: -15,
        colors: ["transparent"],
      },
      legend: {
        show: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: 2,
          dataLabels: { position: "top" },
        },
      },
      colors: colors,
      xaxis: {
        categories: data.labels,
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "30%",
                borderRadius: 7,
              },
            },
          },
        },
      ],
    },
    series: [
      {
        name: data.datasets[0].label,
        data: data.datasets[0].data,
      },
    ],
  });

  const toggleGraph = () => {
    setShowGraph(prev => !prev);
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">
          {Heading}  
          <button className="btn add-btn ms-2" onClick={toggleGraph}>
            {showGraph ? "Hide" : "Show"}
          </button>
        </CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          {subTitle}
        </CardSubtitle>
        {showGraph && (
          <Chart
            options={formatLongData(barFile, color).options}
            series={formatLongData(barFile, color).series}
            type={bar}
            height={height}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default BarGraph1;
