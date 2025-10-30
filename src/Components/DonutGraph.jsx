import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import Chart from "react-apexcharts";

const DonutGraph = ({ heading, subTitle, rawData, height = 350 }) => {
const formatDonutData = (data) => {
  const labels = data.map((item) => item.scandate);
  const series = data.map((item) =>
    parseInt(item.scannedfiles ?? item.scannedimages, 10)
  );

  return {
    options: {
      chart: {
        type: "donut",
        toolbar: {
          show: false,
        },
      },
      labels,
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    series,
  };
};


  // Format rawData internally
  const chartData = formatDonutData(rawData);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">{heading}</CardTitle>
        {subTitle && (
          <CardSubtitle className="text-muted" tag="h6">
            {subTitle}
          </CardSubtitle>
        )}
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          height={height}
        />
      </CardBody>
    </Card>
  );
};

export default DonutGraph;
