const chartDom = document.getElementById("main");
const myChart = echarts.init(chartDom);
const offset = 7;
let option;
let xAxisData = [];
let data1 = [];
let data2 = [];
let data3 = [];
let data4 = [];
let selected = {};
let isSelectChanged = false;
for (let i = 0; i < offset; i++) {
  xAxisData.push(data[i].period);
  data1.push(+data[i].value.toFixed(2));
  data2.push(+data[i + offset].value.toFixed(2));
  data3.push(+data[i + offset * 2].value.toFixed(2));
  data4.push(+data[i + offset * 3].value.toFixed(2));
}
const emphasisStyle = {
  itemStyle: {
    shadowBlur: 10,
    shadowColor: "rgba(0,0,0,0.3)",
  },
};

this.mySeries = [
  {
    name: data[offset].name,
    type: "bar",
    stack: "one",
    data: data2,
    color: "#56B9F2",
    label: {
      show: false,
      position: "top",
      formatter: (params) => {
        return params.data;
      },
    },
  },
  {
    name: data[0].name,
    type: "bar",
    stack: "one",
    data: data1,
    color: "#0078D2",
    label: {
      show: true,
      position: "top",
      formatter: (params) => {
        let total = 0;
        for (let i = 0; i < 2; i++) {
          total += this.mySeries[i].data[params.dataIndex];
        }
        return total;
      },
    },
  },
  {
    name: data[offset * 3].name,
    type: "bar",
    stack: "two",
    data: data4,
    color: "#22C38E",
    label: {
      show: false,
      position: "top",
      formatter: (params) => {
        return params.data;
      },
    },
  },
  {
    name: data[offset * 2].name,
    type: "bar",
    stack: "two",
    data: data3,
    color: "#00724C",
    label: {
      show: true,
      position: "top",
      formatter: (params) => {
        let total = 0;
        for (let i = 2; i < 4; i++) {
          total += this.mySeries[i].data[params.dataIndex];
        }
        return total;
      },
    },
  },
];

option = {
  title: {
    text: "Проекты в программах и вне программ",
    subtext:
      "Сумма и процентное соотношение проектов, находящихся в программах и вне программ",
  },
  legend: {
    data: [
      data[0].name,
      data[offset].name,
      data[offset * 2].name,
      data[offset * 3].name,
    ],
    left: "15%",
    bottom: "5%",
    icon: "circle",
  },
  tooltip: {
    borderWidth: 0,
    formatter: function (params) {
      const sum = option.series.reduce(
        (accumulator, currentValue) =>
          accumulator +
          currentValue.data[params.dataIndex] *
            +(!isSelectChanged || selected[currentValue.name]),
        0
      );
      const prog =
        +(selected[data[offset].name] || !isSelectChanged) *
          option.series[0].data[params.dataIndex] +
        +(selected[data[0].name] || !isSelectChanged) *
          option.series[1].data[params.dataIndex];
      const progPer = Math.round((prog * 100) / sum);
      const notProg =
        +(selected[data[offset * 3].name] || !isSelectChanged) *
          option.series[2].data[params.dataIndex] +
        +(selected[data[offset * 2].name] || !isSelectChanged) *
          option.series[3].data[params.dataIndex];
      const notProgPer = Math.round((notProg * 100) / sum);

      const top = `<div><span><b>В программе</b></span><span><b>${progPer}% | ${prog} шт.</b></span></div>
      ${
        selected[data[offset].name] || !isSelectChanged
          ? `<div><span>Проекты ИТ</span><span><b>${
              option.series[0].data[params.dataIndex]
            } шт.</b></span></div>`
          : ""
      }
      ${
        selected[data[0].name] || !isSelectChanged
          ? `<div><span>Проекты ЦП</span><span><b>${
              option.series[1].data[params.dataIndex]
            } шт.</b></span></div>`
          : ""
      }`;

      const bottom = `<div><span><b>Вне программ</b></span><span><b>${notProgPer}% | ${notProg} шт.</b></span></div>
      ${
        selected[data[offset * 3].name] || !isSelectChanged
          ? `<div><span>Проекты ИТ</span><span><b>${
              option.series[2].data[params.dataIndex]
            } шт.</b></span></div>`
          : ""
      }
      ${
        selected[data[offset * 2].name] || !isSelectChanged
          ? `<div><span>Проекты ЦП</span><span><b>${
              option.series[3].data[params.dataIndex]
            } шт.</b></span></div>`
          : ""
      }`;

      return `<div class='info'><b>${params.name} 2022</b>
      ${
        !isSelectChanged ||
        selected[data[offset].name] ||
        selected[data[0].name]
          ? top
          : ""
      }
      ${
        !isSelectChanged ||
        selected[data[offset * 3].name] ||
        selected[data[offset * 2].name]
          ? bottom
          : ""
      }</div>`;
    },
  },
  xAxis: {
    data: xAxisData,
    axisLine: { onZero: true },
    splitLine: { show: false },
    splitArea: { show: false },
  },
  yAxis: {},
  grid: {
    bottom: 100,
  },
  series: this.mySeries,
};

myChart.on("legendselectchanged", function (params) {
  isSelectChanged = true;
  selected = { ...params.selected };
  if (!params.selected[data[0].name] && params.selected[data[offset].name]) {
    option.series[0].label.show = true;
  } else {
    option.series[0].label.show = false;
    if (params.selected[data[0].name] && !params.selected[data[offset].name]) {
      option.series[1].label.formatter = (params) => {
        return params.data;
      };
    } else {
      option.series[1].label.formatter = (params) => {
        let total = 0;
        for (let i = 0; i < 2; i++) {
          total += option.series[i].data[params.dataIndex];
        }
        return total;
      };
    }
  }

  if (
    !params.selected[data[offset * 2].name] &&
    params.selected[data[offset * 3].name]
  ) {
    option.series[2].label.show = true;
  } else {
    option.series[2].label.show = false;
    if (
      params.selected[data[offset * 2].name] &&
      !params.selected[data[offset * 3].name]
    ) {
      option.series[3].label.formatter = (params) => {
        return params.data;
      };
    } else {
      option.series[3].label.formatter = (params) => {
        let total = 0;
        for (let i = 2; i < 4; i++) {
          total += option.series[i].data[params.dataIndex];
        }
        return total;
      };
    }
  }
  myChart.setOption(option);
});

option && myChart.setOption(option);
