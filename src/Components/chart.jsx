import {
    Card,
    CardBody,
    CardHeader,
    Typography,
  } from "@material-tailwind/react";
import Chart from "react-apexcharts";
   
  
   
  export default function BarChart(props) {

    const chartConfig = {
        type: "bar",
        height: 400,
        series: [
          {
            name: "Points",
            data: props.stat,
          },
        ],
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          title: {
            show: "",
          },
          dataLabels: {
            enabled: false,
          },
          colors: ["#020617"],
          plotOptions: {
            bar: {
              columnWidth: "80%",
              borderRadius: 2,
            },
          },
          xaxis: {
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            labels: {
              style: {
                colors: "#616161",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 400,
              },
            },
            categories: [
              "HP", "Attack", "Defense", "Special Attack", "Special Defense", "Speed"
            ],
          },
          yaxis: {
            labels: {
              style: {
                colors: "#616161",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 400,
              },
            },
          },
          grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
              lines: {
                show: true,
              },
            },
            padding: {
              top: 5,
              right: 20,
            },
          },
          fill: {
            opacity: 0.8,
          },
          tooltip: {
            theme: "dark",
          },
        },
      };
    return (
      <Card>
        <CardBody className="px-2 pb-0 w-[100%]">
          <Chart {...chartConfig} />
        </CardBody>
      </Card>
    );
  }