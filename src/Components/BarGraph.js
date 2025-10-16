import React from "react";
import { Card, CardBody, CardTitle,CardSubtitle } from "reactstrap";
import Chart from "react-apexcharts";
import { SubTitle } from "chart.js";

const BarGraph = ({ Heading,subTitle, barFile, color, bar, height , width }) => {
  const formatChartData = (data, colors) => ({
    options: {
      chart: {
        toolbar: { show: false },
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1, // positive width
        colors: ["transparent"],
      },
      legend: {
        show: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 2,
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
                columnWidth: "90%",
                borderRadius: 7,
              },
            },
          },
        },
      ],
    },
    series: data.datasets.map(ds => ({
    name: ds.label,
    data: ds.data,}))
  });

  const formattedData = formatChartData(barFile, color);

  return (
    
    <Card>
      <CardBody>
        <CardTitle tag="h5">{Heading}</CardTitle>
        {subTitle && (
          <CardSubtitle className="text-muted" tag="h6">
            {subTitle}
          </CardSubtitle>
        )}
        <Chart
          options={formattedData.options}
          series={formattedData.series}
          type={bar}
          height={height}
          width={width}
        />
      </CardBody>
    </Card>

  );
};

export default BarGraph;
