import React, { useMemo } from 'react';
import { Table } from '@mantine/core';
import useApiFetch from './useApiFetch';

const AggregatedCropData = () => {
  const { data, loading, error } = useApiFetch('./src/api/api.json');

  // Log data to debug
  console.log("Fetched data:", data);

  const aggregatedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Filter data between 1950 and 2020
    const filteredData = data.filter(item => {
      const yearMatch = item.Year.match(/(\d{4})/); // Extract the year from the Year field
      const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
      return year >= 1950 && year <= 2020;
    });

    console.log("Filtered data:", filteredData);

    // Aggregate data by crop
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

    console.log("Crop aggregation:", cropAggregation);

    // Calculate average yield and area for each crop
    return Object.keys(cropAggregation).map(cropName => {
      const { totalYield, totalArea, count } = cropAggregation[cropName];
      return {
        crop: cropName,
        averageYield: count === 0 ? 'N/A' : (totalYield / count).toFixed(2),
        averageArea: count === 0 ? 'N/A' : (totalArea / count).toFixed(2)
      };
    });
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table  highlightOnHover withTableBorder>
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
            <td colSpan="3">No data available</td>
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
  );
};

export default AggregatedCropData;
