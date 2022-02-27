function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    var dem_metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = sampleArray.filter(sampleObj => sampleObj.id == sample);
    var resultdem = dem_metadata.filter(sampleObj => sampleObj.id == sample);   
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultSample[0];
    var dem = resultdem[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_otu_ids = firstSample.otu_ids;
    var sample_otu_labels = firstSample.otu_labels;
    var sample_value = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wash_frequency = dem.wfreq;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var top10ids = sample_otu_ids.slice(0,10).reverse();
    var top10values = sample_value.slice(0,10).reverse();
    
    var top10labels = sample_otu_labels.slice(0,10).reverse();

    var yticks = sample_otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    console.log(yticks);
    
    // sample_out_labels.forEach(label => yticks.append(`OUT ${label}`));

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10values,
      y: yticks,
      text: top10labels,
      name: "Sample",
      type: "bar",
      orientation:"h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 125,
        r: 125,
        t: 25,
        b: 100
      }     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sample_otu_ids,
      y: sample_value,
      text: sample_otu_labels,
      name: "Sample",
      mode: 'markers',
      marker: {    
        size: sample_value,
        color: sample_otu_ids ,
        colorscale: 'Earth',           
      }
    }
   
    ];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
      showlegend: false,
      hovermode: sample_otu_labels,     
      height: 600,    
      width: 1200,
      margin: {
        l: 0,
        r: 0,
        t: 50,
        b: 100
      }            
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {    
        value: wash_frequency,    
        title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week' },    
        type: "indicator",    
        mode: "gauge+number", 
        gauge: {
          axis: { range: [0.0, 10.0] },
          bar: { color: "black" },    
          steps: [    
            { range: [0.0, 2.0], color: "red" },    
            { range: [2.0, 4.0], color: "orange" },    
            { range: [4.0, 6.0], color: "yellow" },    
            { range: [6.0, 8.0], color: "lightgreen" },    
            { range: [8.0, 10.0], color: "green" }      
          ]  
        }   
      }     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500, 
      height: 400, 
      margin: { t: 0, b: 0 }      
    };
    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
