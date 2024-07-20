import React, { useMemo } from 'react';
import { Table, Text, Loader } from '@mantine/core';
import useApiFetch from './useApiFetch';
import './Table2.css';  

const AggregatedCropData = () => {
  const { data, loading, error } = useApiFetch('./src/api/api.json');

  const aggregatedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Filtering data between 1950 and 2020
    const filteredData = data.filter(item => {
      const yearMatch = item.Year.match(/(\d{4})/); 
      const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
      return year >= 1950 && year <= 2020;
    });

    // Aggregating data by crop
    const cropAggregation = filteredData.reduce((acc, item) => {
      const cropName = item["Crop Name"];
      const yieldValue = parseFloat(item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]) || 0;
      const areaValue = parseFloat(item["Area Under Cultivation (UOM:Ha(Hectares))"]) || 0;

      if (!acc[cropName]) {
        acc[cropName] = { totalYield: 0, totalArea: 0, count: 0 };
      }

      acc[cropName].totalYield += yieldValue;
      acc[cropName].totalArea += areaValue;
      acc[cropName].count += 1;

      return acc;
    }, {});

    // Calculating average yield and area for each crop
    return Object.keys(cropAggregation).map(cropName => {
      const { totalYield, totalArea, count } = cropAggregation[cropName];
      return {
        crop: cropName,
        averageYield: count === 0 ? 'N/A' : (totalYield / count).toFixed(2),
        averageArea: count === 0 ? 'N/A' : (totalArea / count).toFixed(2)
      };
    });
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Text color="red">Error: {error}</Text>;

  return (
    <div className="aggregated-table-wrapper">
      <Table className="aggregated-table" striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Crop</th>
            <th>Average Yield (Kg/Ha)</th>
            <th>Average Cultivation Area (Ha)</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-data">No data available</td>
            </tr>
          ) : (
            aggregatedData.map((item, index) => (
              <tr key={index}>
                <td>{item.crop}</td>
                <td>{item.averageYield}</td>
                <td>{item.averageArea}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AggregatedCropData;
