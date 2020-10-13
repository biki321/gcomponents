const templateSimpleLineChart = document.createElement("template");

templateSimpleLineChart.innerHTML = `
<style> 

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}

</style><svg > </svg>`;

class SimpleLineChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      templateSimpleLineChart.content.cloneNode(true)
    );

    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // parse the date / time
    const parseTime = d3.timeParse("%d-%b-%y");

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // define the line
    const valueline = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.close);
      });

    const svg = d3.select(this.shadowRoot).select("svg");
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("./data.csv")
      .then(function (data) {
        // format the data
        data.forEach(function (d) {
          d.date = parseTime(d.date);
          d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(
          d3.extent(data, function (d) {
            return d.date;
          })
        );
        y.domain([
          0,
          d3.max(data, function (d) {
            return d.close;
          }),
        ]);

        // Add the valueline path.
        svg
          .append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", valueline);

        // Add the X Axis
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g").call(d3.axisLeft(y));
      })
      .catch(function (error) {
        console.log("hii");
        throw error;
      });
  }
}

window.customElements.define("simple-line-chart", SimpleLineChart);
